import React, { useEffect, useState } from 'react';
import { fetchWeddingFilms } from '../lib/data';
import type { WeddingFilm } from '../lib/data';

export const WeddingFilms: React.FC = () => {
  const [films, setFilms] = useState<WeddingFilm[]>([]);

  useEffect(() => {
    fetchWeddingFilms().then(setFilms);
  }, []);

  return (
    <div className="wedding-films-page">
      <header className="page-header animate-fade-in">
        <div className="container">
          <h1 className="page-title">Wedding Films</h1>
          <p className="films-intro">The laughter, vows, and little in-between moments, brought back to life.</p>
        </div>
      </header>
      <section className="section">
        {films.length > 0 ? (
          <div className="container wedding-films-grid">
            {films.map((film) => (
              <article className="wedding-film" key={film.videoId}>
                <div className="wedding-film-video">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${film.videoId}`}
                    title={film.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
                <h2>{film.title}</h2>
                {film.description && <p>{film.description}</p>}
              </article>
            ))}
          </div>
        ) : <p className="container text-center" style={{ padding: '4rem 0' }}>No wedding films published yet.</p>}
      </section>
    </div>
  );
};