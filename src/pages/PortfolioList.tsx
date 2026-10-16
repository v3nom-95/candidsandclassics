import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { fetchPortfolios } from '../lib/data';
import type { PortfolioCategory } from '../lib/data';
import { SEOHead } from '../components/SEOHead';

// ── Category metadata ────────────────────────────────────────
const categoryContent: Record<PortfolioCategory, { title: string; description: string }> = {
  weddings: {
    title: 'Wedding Stories',
    description:
      'A curated collection of love, tradition, and joyous celebrations, captured for the couples who invited us into their story.',
  },
  'kids-photography': {
    title: 'Kids Photography',
    description:
      'Big imaginations, little details, and the wonderfully unscripted moments of growing up.',
  },
  'documentary-films': {
    title: 'Documentary Films',
    description:
      'Real moments, honest emotion, and the stories that deserve to be revisited on screen.',
  },
};

const categorySEO: Record<
  PortfolioCategory,
  { seoTitle: string; seoDescription: string; seoKeywords: string }
> = {
  weddings: {
    seoTitle: 'Wedding Photography Portfolio – Best Wedding Photographer Hyderabad',
    seoDescription:
      'Browse our stunning wedding photography portfolio. Candids & Classics captures candid moments, traditional ceremonies, haldi, mehndi, sangeet, baraat & reception across Hyderabad.',
    seoKeywords:
      'wedding photography portfolio Hyderabad, best wedding photos, candid wedding photography, Indian wedding photographer, South Indian wedding photography',
  },
  'kids-photography': {
    seoTitle: 'Kids & Child Photography Portfolio – Best in Hyderabad',
    seoDescription:
      "Explore our kids and child photography portfolio. Candids & Classics is Hyderabad's best studio for baby, newborn, birthday, and milestone sessions.",
    seoKeywords:
      'kids photography Hyderabad, child photography portfolio, baby photography Hyderabad, best kids photographer Hyderabad',
  },
  'documentary-films': {
    seoTitle: 'Documentary Films Portfolio – Cinematic Storytelling Hyderabad',
    seoDescription:
      'Watch our documentary films portfolio. Real stories, honest emotions, and beautifully crafted narratives by Candids & Classics Hyderabad.',
    seoKeywords: 'documentary films Hyderabad, documentary filmmaker Hyderabad, cinematic documentary India',
  },
};

// ── Masonry column helper ────────────────────────────────────
function splitIntoColumns(photos: string[], cols: number): string[][] {
  const columns: string[][] = Array.from({ length: cols }, () => []);
  photos.forEach((p, i) => columns[i % cols].push(p));
  return columns;
}

// ── Lightbox ─────────────────────────────────────────────────
interface LightboxProps {
  photos: string[];
  index: number;
  onClose: () => void;
  onNav: (dir: 'prev' | 'next') => void;
}

const Lightbox: React.FC<LightboxProps> = ({ photos, index, onClose, onNav }) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNav('next');
      if (e.key === 'ArrowLeft') onNav('prev');
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, onNav]);

  return (
    <div
      className="lightbox-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Photo lightbox"
    >
      <div className="lightbox-content" onClick={e => e.stopPropagation()}>
        <button className="lightbox-close" onClick={onClose} aria-label="Close lightbox">
          <X size={28} />
        </button>
        <button
          className="lightbox-nav lightbox-prev"
          onClick={() => onNav('prev')}
          aria-label="Previous photo"
        >
          <ChevronLeft size={32} />
        </button>
        <img
          src={photos[index]}
          alt={`Gallery photo ${index + 1}`}
          style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain', borderRadius: 4 }}
        />
        <button
          className="lightbox-nav lightbox-next"
          onClick={() => onNav('next')}
          aria-label="Next photo"
        >
          <ChevronRight size={32} />
        </button>
        <div className="lightbox-counter">
          {index + 1} / {photos.length}
        </div>
      </div>
    </div>
  );
};

// ── Main page component ──────────────────────────────────────
export const PortfolioList: React.FC = () => {
  const location = useLocation();
  const pathCategory = location.pathname.split('/')[2] as PortfolioCategory | undefined;
  const category =
    pathCategory && pathCategory in categoryContent ? pathCategory : 'weddings';

  const content = categoryContent[category];
  const seo = categorySEO[category];

  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [cols, setCols] = useState(3);

  // Lightbox state
  const [lbOpen, setLbOpen] = useState(false);
  const [lbIndex, setLbIndex] = useState(0);

  // Lazy-load: how many images to render
  const BATCH = 24;
  const [visible, setVisible] = useState(BATCH);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Responsive columns
  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640) setCols(2);
      else if (window.innerWidth < 1024) setCols(3);
      else setCols(4);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Fetch
  useEffect(() => {
    setLoading(true);
    setVisible(BATCH);
    fetchPortfolios(category, false)
      .then(data => {
        setPhotos(data.flatMap(p => p.photos));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [category]);

  // Infinite scroll sentinel
  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(v => Math.min(v + BATCH, photos.length));
      },
      { rootMargin: '400px' }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [photos.length]);

  // Lightbox handlers
  const openLb = (idx: number) => {
    setLbIndex(idx);
    setLbOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLb = useCallback(() => {
    setLbOpen(false);
    document.body.style.overflow = '';
  }, []);

  const navLb = useCallback(
    (dir: 'prev' | 'next') => {
      setLbIndex(i =>
        dir === 'next' ? (i + 1) % photos.length : (i - 1 + photos.length) % photos.length
      );
    },
    [photos.length]
  );

  const visiblePhotos = photos.slice(0, visible);
  const columns = splitIntoColumns(visiblePhotos, cols);

  const portfolioJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `https://candidsandclassics.com/portfolio/${category}#portfolio`,
    url: `https://candidsandclassics.com/portfolio/${category}`,
    name: seo.seoTitle,
    description: seo.seoDescription,
    isPartOf: { '@id': 'https://candidsandclassics.com/#website' },
    mainEntity: {
      '@type': 'ImageGallery',
      name: content.title,
      description: content.description,
      numberOfItems: photos.length,
      provider: { '@id': 'https://candidsandclassics.com/#organization' },
    },
  };

  return (
    <div style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh' }}>
      <SEOHead
        title={seo.seoTitle}
        description={seo.seoDescription}
        keywords={seo.seoKeywords}
        canonicalPath={`/portfolio/${category}`}
        jsonLd={portfolioJsonLd}
      />

      {/* Page header */}
      <header className="page-header animate-fade-in">
        <div className="container">
          <h1 className="page-title">{content.title}</h1>
          <p style={{ maxWidth: 600, margin: '0 auto', fontSize: '1.1rem' }}>
            {content.description}
          </p>
        </div>
      </header>

      <section className="section" style={{ paddingTop: '3rem' }}>
        <div className="container">
          {loading ? (
            <div className="text-center" style={{ padding: '4rem 0' }}>
              <p
                style={{
                  fontSize: '1.5rem',
                  fontFamily: 'var(--font-heading)',
                  color: 'var(--color-primary)',
                }}
              >
                Curating Masterpieces…
              </p>
            </div>
          ) : photos.length === 0 ? (
            <p className="text-center" style={{ padding: '4rem 0' }}>
              No photos published yet.
            </p>
          ) : (
            <>
              {/* Photo count badge */}
              <p
                style={{
                  textAlign: 'center',
                  fontSize: '0.8rem',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: 'var(--color-primary)',
                  marginBottom: '2.5rem',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 600,
                }}
              >
                {photos.length} Captured Moments
              </p>

              {/* Masonry grid */}
              <div className="portfolio-masonry">
                {columns.map((col, ci) => (
                  <div className="portfolio-masonry-col" key={ci}>
                    {col.map((photo, ri) => {
                      const globalIdx = ri * cols + ci;
                      return (
                        <button
                          key={`${ci}-${ri}`}
                          className="portfolio-photo-btn"
                          onClick={() => openLb(globalIdx)}
                          aria-label={`View photo ${globalIdx + 1}`}
                        >
                          <img
                            src={photo}
                            alt={`${content.title} photo ${globalIdx + 1}`}
                            loading="lazy"
                            onError={e =>
                              (
                                e.currentTarget.closest('.portfolio-photo-btn') as HTMLElement | null
                              )?.style.setProperty('display', 'none')
                            }
                          />
                          <div className="portfolio-photo-overlay" aria-hidden="true" />
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* Infinite scroll sentinel */}
              {visible < photos.length && (
                <div ref={sentinelRef} style={{ height: 40, margin: '2rem 0' }} aria-hidden="true" />
              )}
            </>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lbOpen && (
        <Lightbox photos={photos} index={lbIndex} onClose={closeLb} onNav={navLb} />
      )}
    </div>
  );
};
