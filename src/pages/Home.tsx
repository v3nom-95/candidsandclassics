import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { fetchPortfolios, fetchWeddingFilms } from '../lib/data';
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
  {
    key: 'everyday-joys',
    title: 'Everyday Joys',
    description: 'The everyday connections that become lifelong keepsakes.',
  },
];

export const Home: React.FC = () => {
  const [films, setFilms] = useState<WeddingFilm[]>([]);
  const [galleries, setGalleries] = useState<Record<PortfolioCategory, string[]>>({
    weddings: [],
    'kids-photography': [],
    'everyday-joys': [],
  });
  const [visiblePhotoCounts, setVisiblePhotoCounts] = useState<Record<PortfolioCategory, number>>({
    weddings: PHOTO_PAGE_SIZE,
    'kids-photography': PHOTO_PAGE_SIZE,
    'everyday-joys': PHOTO_PAGE_SIZE,
  });
  useEffect(() => {
    Promise.all([
      Promise.all(photoCategories.map(({ key }) => fetchPortfolios(key))),
      fetchWeddingFilms(),
    ])
      .then(([portfolios, sheetFilms]) => {
        const [weddings, kids, everyday] = portfolios;
        setGalleries({
          weddings: [...new Set(weddings.flatMap(portfolio => portfolio.photos))],
          'kids-photography': [...new Set(kids.flatMap(portfolio => portfolio.photos))],
          'everyday-joys': [...new Set(everyday.flatMap(portfolio => portfolio.photos))],
        });
        setFilms(sheetFilms);
      })
      .catch(error => console.error('Failed to load homepage portfolio photos', error));
  }, []);

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

      {photoCategories.map(({ key, title, description }, categoryIndex) => (
        <section className="section home-category-section" key={key}>
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
                {galleries[key].length > 0 ? galleries[key].slice(0, visiblePhotoCounts[key]).map((photo, index) => (
                  <Link
                    to={`/portfolio/${key}`}
                  className="home-photo"
                    key={`${photo}-${index}`}
                  >
                    <img
                      src={photo}
                      alt={`${title} photograph ${index + 1}`}
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
      ))}

      <section className="home-films-section">
        <div className="container home-films-content">
          <div>
            <span className="hero-subtitle">Moving stories</span>
            <h2>Wedding Films</h2>
            <p>Relive the voices, music, and moments that made the day yours.</p>
          </div>
          <Link to="/portfolio/wedding-films" className="btn btn-primary">Watch wedding films</Link>
        </div>
        <div className="container home-films-grid">
          {films.length > 0 ? films.slice(0, 3).map(film => (
            <Link to="/portfolio/wedding-films" className="home-film-preview" key={film.videoId}>
              <img src={`https://img.youtube.com/vi/${film.videoId}/hqdefault.jpg`} alt="" loading="lazy" />
              <span>{film.title}</span>
            </Link>
          )) : <p className="home-empty-state">No wedding films published in this sheet yet.</p>}
        </div>
      </section>
    </div>
  );
};
