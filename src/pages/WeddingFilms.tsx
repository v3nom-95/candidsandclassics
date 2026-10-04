import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchWeddingFilms, fetchKidsFilms } from '../lib/data';
import type { WeddingFilm } from '../lib/data';
import { SEOHead } from '../components/SEOHead';

const pageSEO: Record<string, { title: string; description: string; keywords: string; heading: string; intro: string }> = {
  'wedding-films': {
    title: 'Cinematic Wedding Films – Best Wedding Videography Hyderabad',
    description: 'Watch our cinematic wedding films. Candids & Classics creates breathtaking wedding highlight reels and full-length wedding films in Hyderabad. Best wedding videographer in Telangana & Andhra Pradesh.',
    keywords: 'wedding films Hyderabad, cinematic wedding video Hyderabad, best wedding videographer Hyderabad, wedding highlight reel, Telugu wedding film, South Indian wedding video, destination wedding film India, wedding cinematography Hyderabad',
    heading: 'Wedding Films',
    intro: 'The laughter, vows, and little in-between moments, brought back to life.',
  },
  'kids-films': {
    title: 'Kids Films – Cinematic Childhood Memories Hyderabad',
    description: 'Beautiful cinematic films capturing childhood joy, milestones, and birthday celebrations. Candids & Classics – the best kids videographer in Hyderabad.',
    keywords: 'kids films Hyderabad, child video Hyderabad, birthday film Hyderabad, milestone video, kids cinematography, best kids videographer Hyderabad',
    heading: 'Kids Films',
    intro: 'The joy, chaos, and wonder that turn everyday moments into treasured memories.',
  },
};

export const WeddingFilms: React.FC = () => {
  const location = useLocation();
  const pageKey = location.pathname.includes('kids-films') ? 'kids-films' : 'wedding-films';
  const seo = pageSEO[pageKey];
  const [films, setFilms] = useState<WeddingFilm[]>([]);

  useEffect(() => {
    const fetcher = pageKey === 'kids-films' ? fetchKidsFilms : fetchWeddingFilms;
    fetcher().then(setFilms);
  }, [pageKey]);

  const filmsJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `https://candidsandclassics.com/portfolio/${pageKey}#filmspage`,
    "url": `https://candidsandclassics.com/portfolio/${pageKey}`,
    "name": seo.title,
    "description": seo.description,
    "isPartOf": { "@id": "https://candidsandclassics.com/#website" },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://candidsandclassics.com/" },
        { "@type": "ListItem", "position": 2, "name": "Portfolio", "item": "https://candidsandclassics.com/portfolio" },
        { "@type": "ListItem", "position": 3, "name": seo.heading, "item": `https://candidsandclassics.com/portfolio/${pageKey}` }
      ]
    },
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": films.length,
      "itemListElement": films.slice(0, 10).map((film, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "item": {
          "@type": "VideoObject",
          "name": film.title,
          "description": film.description || film.title,
          "thumbnailUrl": `https://img.youtube.com/vi/${film.videoId}/hqdefault.jpg`,
          "embedUrl": `https://www.youtube.com/embed/${film.videoId}`,
          "uploadDate": new Date().toISOString().split('T')[0],
          "publisher": { "@id": "https://candidsandclassics.com/#organization" }
        }
      }))
    }
  };

  return (
    <div className="wedding-films-page">
      <SEOHead
        title={seo.title}
        description={seo.description}
        keywords={seo.keywords}
        canonicalPath={`/portfolio/${pageKey}`}
        jsonLd={filmsJsonLd}
      />
      <header className="page-header animate-fade-in">
        <div className="container">
          <h1 className="page-title">{seo.heading}</h1>
          <p className="films-intro">{seo.intro}</p>
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