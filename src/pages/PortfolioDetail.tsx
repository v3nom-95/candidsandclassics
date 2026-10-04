import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { fetchPortfolios } from '../lib/data';
import type { Portfolio, PortfolioCategory } from '../lib/data';
import { SEOHead } from '../components/SEOHead';

const categoryLabels: Record<string, string> = {
  weddings: 'Wedding Photography',
  'kids-photography': 'Kids Photography',
  'documentary-films': 'Documentary Films',
};

export const PortfolioDetail: React.FC = () => {
  const { category: routeCategory, clientName } = useParams<{ category?: string; clientName: string }>();
  const category = (routeCategory || 'weddings') as PortfolioCategory;
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const albumRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    fetchPortfolios(category)
      .then(data => {
        const found = data.find(p => p.clientName === clientName);
        setPortfolio(found || null);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [category, clientName]);

  // Scroll to a specific slide index
  const goToSlide = useCallback((index: number) => {
    const el = slideRefs.current[index];
    if (el && albumRef.current) {
      const container = albumRef.current;
      const slideCenter = el.offsetLeft + el.offsetWidth / 2;
      const scrollTarget = slideCenter - container.clientWidth / 2;
      container.scrollTo({ left: scrollTarget, behavior: 'smooth' });
    }
  }, []);

  const goNext = () => {
    if (!portfolio) return;
    const next = Math.min(activeIndex + 1, portfolio.photos.length - 1);
    setActiveIndex(next);
    goToSlide(next);
  };

  const goPrev = () => {
    const prev = Math.max(activeIndex - 1, 0);
    setActiveIndex(prev);
    goToSlide(prev);
  };

  // Detect which slide is centered on scroll
  const handleScroll = useCallback(() => {
    if (!albumRef.current || !portfolio) return;
    const container = albumRef.current;
    const containerCenter = container.scrollLeft + container.clientWidth / 2;

    let closestIdx = 0;
    let closestDist = Infinity;

    slideRefs.current.forEach((el, idx) => {
      if (!el) return;
      const slideCenter = el.offsetLeft + el.offsetWidth / 2;
      const dist = Math.abs(containerCenter - slideCenter);
      if (dist < closestDist) {
        closestDist = dist;
        closestIdx = idx;
      }
    });

    setActiveIndex(closestIdx);
  }, [portfolio]);

  // Center the first slide on mount
  useEffect(() => {
    if (portfolio && portfolio.photos.length > 0) {
      setTimeout(() => goToSlide(0), 100);
    }
  }, [portfolio, goToSlide]);

  const openLightbox = (idx: number) => {
    setLightboxIndex(idx);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = '';
  };

  const lightboxNav = useCallback((direction: 'prev' | 'next') => {
    if (!portfolio) return;
    if (direction === 'next') {
      setLightboxIndex(prev => (prev + 1) % portfolio.photos.length);
    } else {
      setLightboxIndex(prev => (prev - 1 + portfolio.photos.length) % portfolio.photos.length);
    }
  }, [portfolio]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (lightboxOpen) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') lightboxNav('next');
        if (e.key === 'ArrowLeft') lightboxNav('prev');
      } else {
        if (e.key === 'ArrowRight') goNext();
        if (e.key === 'ArrowLeft') goPrev();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxOpen, lightboxNav, activeIndex, portfolio]);

  if (loading) {
    return (
      <div className="album-loading">
        <p>Loading Memories...</p>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="album-loading">
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Portfolio Not Found</h1>
        <Link to="/portfolio" className="btn">Return to Portfolios</Link>
      </div>
    );
  }

  const categoryLabel = categoryLabels[category] || 'Photography';
  const detailJsonLd = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "@id": `https://candidsandclassics.com/portfolio/${category}/${encodeURIComponent(portfolio.clientName)}#gallery`,
    "url": `https://candidsandclassics.com/portfolio/${category}/${encodeURIComponent(portfolio.clientName)}`,
    "name": `${portfolio.clientName} – ${categoryLabel} by Candids & Classics`,
    "description": `${categoryLabel} album for ${portfolio.clientName}. ${portfolio.photos.length} professionally captured moments by Candids & Classics, Hyderabad's best photography studio.`,
    "numberOfItems": portfolio.photos.length,
    "isPartOf": { "@id": "https://candidsandclassics.com/#website" },
    "provider": { "@id": "https://candidsandclassics.com/#organization" },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://candidsandclassics.com/" },
        { "@type": "ListItem", "position": 2, "name": "Portfolio", "item": "https://candidsandclassics.com/portfolio" },
        { "@type": "ListItem", "position": 3, "name": categoryLabel, "item": `https://candidsandclassics.com/portfolio/${category}` },
        { "@type": "ListItem", "position": 4, "name": portfolio.clientName, "item": `https://candidsandclassics.com/portfolio/${category}/${encodeURIComponent(portfolio.clientName)}` }
      ]
    },
    "image": portfolio.photos.slice(0, 5).map(url => ({
      "@type": "ImageObject",
      "url": url,
      "creator": { "@id": "https://candidsandclassics.com/#organization" }
    }))
  };

  return (
    <div className="album-page">
      <SEOHead
        title={`${portfolio.clientName} – ${categoryLabel} Album`}
        description={`View the ${categoryLabel.toLowerCase()} album of ${portfolio.clientName}. ${portfolio.photos.length} beautiful moments captured by Candids & Classics, Hyderabad's premier photography studio. Candid, emotional, and timeless.`}
        keywords={`${portfolio.clientName} wedding photos, ${categoryLabel.toLowerCase()} Hyderabad, Candids and Classics portfolio, ${portfolio.clientName} photography album, best ${categoryLabel.toLowerCase()} Hyderabad`}
        canonicalPath={`/portfolio/${category}/${encodeURIComponent(portfolio.clientName)}`}
        ogImage={portfolio.photos[0]}
        ogImageAlt={`${portfolio.clientName} – ${categoryLabel} by Candids & Classics Hyderabad`}
        jsonLd={detailJsonLd}
      />
      {/* Header */}
      <div className="album-header">
        <Link to="/portfolio" className="album-back-btn">
          <ArrowLeft size={20} />
          <span>All Stories</span>
        </Link>
        <div className="album-header-text">
          <span className="album-label">{categoryLabel} Album</span>
          <h1 className="album-title">{portfolio.clientName}</h1>
          <span className="album-count">{activeIndex + 1} of {portfolio.photos.length} Moments</span>
        </div>
      </div>

      <div className="album-gallery">
        {/* Scrollable Album */}
        <div className="album-wrapper">
          <button className="album-nav-btn album-nav-left" onClick={goPrev} aria-label="Previous photo">
            <ChevronLeft size={32} />
          </button>

          <div className="album-scroll" ref={albumRef} onScroll={handleScroll}>
            <div className="album-spacer" />
            {portfolio.photos.map((photo, idx) => {
              const distance = Math.abs(idx - activeIndex);
              const isActive = idx === activeIndex;
              return (
                <div
                  className={`album-slide ${isActive ? 'active' : ''} ${distance === 1 ? 'neighbor' : ''} ${distance >= 2 ? 'far' : ''}`}
                  key={idx}
                  ref={el => { slideRefs.current[idx] = el; }}
                  onClick={() => isActive ? openLightbox(idx) : goToSlide(idx)}
                >
                  <img src={photo} alt={`${portfolio.clientName} - photo ${idx + 1}`} loading="lazy" />
                  <div className="album-slide-number">{idx + 1} / {portfolio.photos.length}</div>
                </div>
              );
            })}
            <div className="album-spacer" />
          </div>

          <button className="album-nav-btn album-nav-right" onClick={goNext} aria-label="Next photo">
            <ChevronRight size={32} />
          </button>
        </div>

        <div className="album-thumbnails" aria-label="Photo previews">
          {portfolio.photos.map((photo, idx) => (
            <button
              key={idx}
              className={`album-thumb ${idx === activeIndex ? 'active' : ''}`}
              onClick={() => {
                setActiveIndex(idx);
                goToSlide(idx);
              }}
              aria-label={`Show photo ${idx + 1}`}
              aria-current={idx === activeIndex ? 'true' : undefined}
            >
              <img src={photo} alt="" />
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox}>&times;</button>
            <button className="lightbox-nav lightbox-prev" onClick={() => lightboxNav('prev')}>
              <ChevronLeft size={40} />
            </button>
            <img
              src={portfolio.photos[lightboxIndex]}
              alt={`${portfolio.clientName} - photo ${lightboxIndex + 1}`}
            />
            <button className="lightbox-nav lightbox-next" onClick={() => lightboxNav('next')}>
              <ChevronRight size={40} />
            </button>
            <div className="lightbox-counter">
              {lightboxIndex + 1} / {portfolio.photos.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
