import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchDocumentaryFilms, fetchKidsFilms, fetchPortfolios, fetchWeddingFilms } from '../lib/data';
import type { PortfolioCategory, WeddingFilm } from '../lib/data';
import { SEOHead } from '../components/SEOHead';

const HOME_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://candidsandclassics.com/#homepage",
  "url": "https://candidsandclassics.com/",
  "name": "Candids & Classics | Best Photography Studio in Hyderabad",
  "description": "Hyderabad's best photography studio for weddings, kids photography, child portraits, documentary films & cinematic wedding films. 20+ years of capturing timeless Indian elegance.",
  "isPartOf": { "@id": "https://candidsandclassics.com/#website" },
  "about": { "@id": "https://candidsandclassics.com/#localbusiness" },
  "primaryImageOfPage": {
    "@type": "ImageObject",
    "url": "https://candidsandclassics.com/og-image.jpg"
  },
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://candidsandclassics.com/"
      }
    ]
  },
  "speakable": {
    "@type": "SpeakableSpecification",
    "cssSelector": [".hero-title", ".hero-subtitle"]
  }
};

const photoCategories: { key: PortfolioCategory; title: string; description: string }[] = [
  {
    key: 'weddings',
    title: 'Wedding Photography',
    description: 'The rituals, the embraces, and every beautiful moment in between.',
  },
  {
    key: 'kids-photography',
    title: 'Kids Photography',
    description: 'Big personalities and little moments, just as they happen.',
  },
];

const filmSections: {
  key: 'wedding-films' | 'kids-films' | 'documentary-films';
  title: string;
  subtitle: string;
  description: string;
  buttonLabel: string;
  route: string;
  emptyText: string;
  fetcher: () => Promise<WeddingFilm[]>;
}[] = [
  {
    key: 'wedding-films',
    title: 'Wedding Films',
    subtitle: 'Moving stories',
    description: 'Relive the voices, music, and moments that made the day yours.',
    buttonLabel: 'Watch wedding films',
    route: '/portfolio/wedding-films',
    emptyText: 'No wedding films published in this sheet yet.',
    fetcher: fetchWeddingFilms,
  },
  {
    key: 'kids-films',
    title: 'Kids Films',
    subtitle: 'Little adventures',
    description: 'The joy, chaos, and wonder that turn everyday moments into treasured memories.',
    buttonLabel: 'Watch kids films',
    route: '/portfolio/kids-films',
    emptyText: 'No kids films published in this sheet yet.',
    fetcher: fetchKidsFilms,
  },
  {
    key: 'documentary-films',
    title: 'Documentary Films',
    subtitle: 'Real life, beautifully told',
    description: 'A cinematic look at the genuine emotion, texture, and rhythm of life as it unfolds.',
    buttonLabel: 'Watch documentary films',
    route: '/portfolio/documentary-films',
    emptyText: 'No documentary films published in this sheet yet.',
    fetcher: fetchDocumentaryFilms,
  },
];

// Reusable premium horizontal scroll carousel with prev/next buttons + drag-to-scroll
const HScrollCarousel: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const scroll = (dir: 'left' | 'right') => {
    if (!trackRef.current) return;
    const amount = trackRef.current.clientWidth * 0.72;
    trackRef.current.scrollBy({ left: dir === 'right' ? amount : -amount, behavior: 'smooth' });
  };

  const onMouseDown = (e: React.MouseEvent) => {
    if (!trackRef.current) return;
    isDragging.current = true;
    startX.current = e.pageX - trackRef.current.offsetLeft;
    scrollLeft.current = trackRef.current.scrollLeft;
    trackRef.current.style.cursor = 'grabbing';
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !trackRef.current) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.4;
    trackRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const stopDrag = () => {
    isDragging.current = false;
    if (trackRef.current) trackRef.current.style.cursor = 'grab';
  };

  return (
    <div className="hscroll-wrapper">
      <button className="hscroll-btn hscroll-btn--prev" onClick={() => scroll('left')} aria-label="Scroll left">
        <ChevronLeft size={22} />
      </button>
      <div
        id={id}
        ref={trackRef}
        className="hscroll-track"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
      >
        {children}
      </div>
      <button className="hscroll-btn hscroll-btn--next" onClick={() => scroll('right')} aria-label="Scroll right">
        <ChevronRight size={22} />
      </button>
    </div>
  );
};

export const Home: React.FC = () => {
  const [filmCollections, setFilmCollections] = useState<Record<string, WeddingFilm[]>>({
    'wedding-films': [],
    'kids-films': [],
    'documentary-films': [],
  });
  const [galleries, setGalleries] = useState<Record<PortfolioCategory, string[]>>({
    weddings: [],
    'kids-photography': [],
    'documentary-films': [],
  });

  useEffect(() => {
    Promise.all([
      Promise.all(photoCategories.map(({ key }) => fetchPortfolios(key, true))),
      fetchWeddingFilms(true),
      fetchKidsFilms(true),
      fetchDocumentaryFilms(true),
    ])
      .then(([portfolios, weddingFilms, kidsFilms, documentaryFilms]) => {
        const [weddings, kids] = portfolios;
        setGalleries({
          weddings: [...new Set(weddings.flatMap(portfolio => portfolio.photos))],
          'kids-photography': [...new Set(kids.flatMap(portfolio => portfolio.photos))],
          'documentary-films': [],
        });
        setFilmCollections({
          'wedding-films': weddingFilms,
          'kids-films': kidsFilms,
          'documentary-films': documentaryFilms,
        });
      })
      .catch(error => console.error('Failed to load homepage content', error));
  }, []);

  const homepageSections: Array<
    | { type: 'photo'; item: (typeof photoCategories)[number] }
    | { type: 'film'; item: (typeof filmSections)[number] }
  > = [
    { type: 'photo', item: photoCategories[0] },
    { type: 'film', item: filmSections[0] },
    { type: 'photo', item: photoCategories[1] },
    { type: 'film', item: filmSections[1] },
    { type: 'film', item: filmSections[2] },
  ];

  return (
    <div>
      <SEOHead
        title="Best Wedding & Kids Photography Studio in Hyderabad"
        description="Candids & Classics – Hyderabad's #1 photography studio. Premium wedding photography, kids & child photography, cinematic wedding films, and documentary filmmaking. 20+ years of capturing timeless Indian elegance across Telangana & Andhra Pradesh. Book your session today!"
        keywords="best photography studio Hyderabad, best wedding photographer Hyderabad, kids photography Hyderabad, child photography Hyderabad, baby photography Hyderabad, wedding films Hyderabad, documentary films Hyderabad, candid wedding photography Hyderabad, bridal portraits, pre-wedding shoot Hyderabad, South Indian wedding photographer, Telugu wedding photography, destination wedding photographer India, Candids and Classics"
        canonicalPath="/"
        jsonLd={HOME_JSON_LD}
      />

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-video" aria-hidden="true">
          <iframe
            className="hero-video-player"
            src="https://www.youtube-nocookie.com/embed/4YH3nncZzuA?autoplay=1&mute=1&loop=1&playlist=4YH3nncZzuA&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1&disablekb=1"
            title="Candids & Classics Hero Background"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            tabIndex={-1}
          />
        </div>
        <div className="hero-overlay"></div>
        <div className="hero-content animate-fade-in delay-200">
          <span className="hero-subtitle">Premium Wedding Photography</span>
          <h1 className="hero-title">Timeless Indian Elegance</h1>
          <p className="mb-8 text-center" style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
            We craft visual poems that celebrate the grandeur, traditions, and raw emotions of your most special day.
          </p>
          <Link to="/portfolio" className="btn btn-primary">
            View Our Masterpieces
          </Link>
        </div>
      </section>

      {/* ── Photo & Film sections ── */}
      {homepageSections.map((section) => {
        if (section.type === 'photo') {
          const { key, title, description } = section.item;
          const categoryIndex = key === 'weddings' ? 0 : 1;
          const isAlternate = categoryIndex % 2 === 1;
          const photos = galleries[key];

          return (
            <section
              className={`section home-category-section${isAlternate ? ' home-category-section--alternate' : ''}`}
              key={key}
            >
              {/* Section header */}
              <div className="container">
                <div className="home-category-heading">
                  <div>
                    <span className="home-category-kicker">Collection {String(categoryIndex + 1).padStart(2, '0')}</span>
                    <h2>{title}</h2>
                    <p>{description}</p>
                  </div>
                  <div className="home-category-actions">
                    <span className="home-photo-count">
                      {photos.length} {photos.length === 1 ? 'photograph' : 'photographs'}
                    </span>
                    <Link to={`/portfolio/${key}`} className="home-category-link">
                      Explore gallery <ArrowUpRight size={17} aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Premium horizontal photo scroll carousel */}
              {photos.length > 0 ? (
                <HScrollCarousel id={`photo-scroll-${key}`}>
                  {photos.map((photo, idx) => (
                    <Link
                      to={`/portfolio/${key}`}
                      className="hscroll-photo-card"
                      key={`${photo}-${idx}`}
                      draggable={false}
                    >
                      <img
                        src={photo}
                        alt={`${title} photograph ${idx + 1}`}
                        loading="lazy"
                        draggable={false}
                        onError={e => {
                          (e.currentTarget.closest('.hscroll-photo-card') as HTMLElement | null)?.style.setProperty('display', 'none');
                        }}
                      />
                      <div className="hscroll-photo-overlay">
                        <span className="hscroll-photo-label">{title}</span>
                      </div>
                    </Link>
                  ))}
                </HScrollCarousel>
              ) : (
                <div className="container">
                  <p className="home-empty-state">No published photos in this sheet yet.</p>
                </div>
              )}
            </section>
          );
        }

        // Film section
        const { key, title, subtitle, description, buttonLabel, route, emptyText } = section.item;
        const films = filmCollections[key];

        return (
          <section className="home-films-section" key={key}>
            <div className="container home-films-content">
              <div>
                <span className="hero-subtitle">{subtitle}</span>
                <h2>{title}</h2>
                <p>{description}</p>
              </div>
              <Link to={route} className="btn btn-primary">{buttonLabel}</Link>
            </div>

            {/* Premium horizontal film scroll carousel */}
            {films.length > 0 ? (
              <HScrollCarousel id={`film-scroll-${key}`}>
                {films.map(film => (
                  <article className="hscroll-film-card" key={`${key}-${film.videoId}`}>
                    <div className="hscroll-film-video">
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${film.videoId}`}
                        title={film.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                        loading="lazy"
                      />
                    </div>
                    <div className="hscroll-film-info">
                      <h3 className="hscroll-film-title">{film.title}</h3>
                      {film.description && <p className="hscroll-film-desc">{film.description}</p>}
                    </div>
                  </article>
                ))}
              </HScrollCarousel>
            ) : (
              <div className="container">
                <p className="home-empty-state">{emptyText}</p>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
};
