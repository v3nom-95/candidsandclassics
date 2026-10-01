import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { fetchDocumentaryFilms, fetchKidsFilms, fetchPortfolios, fetchWeddingFilms } from '../lib/data';
import type { PortfolioCategory, WeddingFilm } from '../lib/data';

const HERO_VIDEO_ID = 'ueuj4cmeLzI';
const HERO_VIDEO_URL = `https://www.youtube.com/embed/${HERO_VIDEO_ID}?autoplay=1&mute=1&loop=1&playlist=${HERO_VIDEO_ID}&controls=0&disablekb=1&fs=0&iv_load_policy=3&playsinline=1&rel=0&modestbranding=1`;
const PHOTO_PAGE_SIZE = 6;

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
  const [visiblePhotoCounts, setVisiblePhotoCounts] = useState<Record<PortfolioCategory, number>>({
    weddings: PHOTO_PAGE_SIZE,
    'kids-photography': PHOTO_PAGE_SIZE,
    'documentary-films': PHOTO_PAGE_SIZE,
  });

  useEffect(() => {
    Promise.all([
      Promise.all(photoCategories.map(({ key }) => fetchPortfolios(key))),
      fetchWeddingFilms(),
      fetchKidsFilms(),
      fetchDocumentaryFilms(),
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
      <section className="hero">
        <div className="hero-video" aria-hidden="true">
          <iframe
            className="hero-video-player"
            src={HERO_VIDEO_URL}
            title="Candids & Classics wedding film"
            allow="autoplay; encrypted-media"
            loading="eager"
            referrerPolicy="strict-origin-when-cross-origin"
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

      {homepageSections.map((section) => {
        if (section.type === 'photo') {
          const { key, title, description } = section.item;
          const categoryIndex = key === 'weddings' ? 0 : 1;

          return (
            <section className={`section home-category-section${categoryIndex % 2 === 1 ? ' home-category-section--alternate' : ''}`} key={key}>
              <div className="container">
                <div className="home-category-heading">
                  <div>
                    <span className="home-category-kicker">Collection {String(categoryIndex + 1).padStart(2, '0')}</span>
                    <h2>{title}</h2>
                    <p>{description}</p>
                  </div>
                  <div className="home-category-actions">
                    <span className="home-photo-count">
                      {galleries[key].length} {galleries[key].length === 1 ? 'photograph' : 'photographs'}
                    </span>
                    <Link to={`/portfolio/${key}`} className="home-category-link">
                      Explore gallery <ArrowUpRight size={17} aria-hidden="true" />
                    </Link>
                  </div>
                </div>
                <div className="home-photo-grid" aria-label={`${title}: ${galleries[key].length} photographs`}>
                  {galleries[key].length > 0 ? galleries[key].slice(0, visiblePhotoCounts[key]).map((photo, photoIndex) => (
                    <Link to={`/portfolio/${key}`} className="home-photo" key={`${photo}-${photoIndex}`}>
                      <img
                        src={photo}
                        alt={`${title} photograph ${photoIndex + 1}`}
                        loading="lazy"
                        onError={event => {
                          event.currentTarget.style.display = 'none';
                          event.currentTarget.parentElement?.classList.add('is-unavailable');
                        }}
                      />
                    </Link>
                  )) : <p className="home-empty-state">No published photos in this sheet yet.</p>}
                </div>
                {galleries[key].length > visiblePhotoCounts[key] && (
                  <div className="home-photo-more">
                    <span className="home-photo-more-count">
                      Showing {visiblePhotoCounts[key]} of {galleries[key].length}
                    </span>
                    <button
                      className="home-photo-more-button"
                      type="button"
                      onClick={() => setVisiblePhotoCounts(current => ({
                        ...current,
                        [key]: current[key] + PHOTO_PAGE_SIZE,
                      }))}
                    >
                      Show {Math.min(PHOTO_PAGE_SIZE, galleries[key].length - visiblePhotoCounts[key])} more
                      <ArrowDown size={16} aria-hidden="true" />
                    </button>
                  </div>
                )}
              </div>
            </section>
          );
        }

        const { key, title, subtitle, description, buttonLabel, route, emptyText } = section.item;

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
            <div className="container home-films-grid">
              {filmCollections[key].length > 0 ? filmCollections[key].slice(0, 3).map(film => (
                <Link to={route} className="home-film-preview" key={`${key}-${film.videoId}`}>
                  <img src={`https://img.youtube.com/vi/${film.videoId}/hqdefault.jpg`} alt="" loading="lazy" />
                  <span>{film.title}</span>
                </Link>
              )) : <p className="home-empty-state">{emptyText}</p>}
            </div>
          </section>
        );
      })}
    </div>
  );
};
