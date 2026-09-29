import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { fetchPortfolios } from '../lib/data';
import type { Portfolio, PortfolioCategory } from '../lib/data';

const categoryContent: Record<PortfolioCategory, { title: string; description: string }> = {
  weddings: {
    title: 'Wedding Stories',
    description: 'A curated collection of love, tradition, and joyous celebrations, captured for the couples who invited us into their story.',
  },
  'kids-photography': {
    title: 'Kids Photography',
    description: 'Big imaginations, little details, and the wonderfully unscripted moments of growing up.',
  },
  'everyday-joys': {
    title: 'Everyday Joys',
    description: 'The ordinary moments that become the stories you keep coming back to.',
  },
};

export const PortfolioList: React.FC = () => {
  const location = useLocation();
  const pathCategory = location.pathname.split('/')[2] as PortfolioCategory | undefined;
  const category = pathCategory && pathCategory in categoryContent ? pathCategory : 'weddings';
  const content = categoryContent[category];
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortfolios(category)
      .then(data => {
        setPortfolios(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [category]);

  return (
    <div style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh' }}>
      <header className="page-header animate-fade-in">
        <div className="container">
          <h1 className="page-title">{content.title}</h1>
          <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>
            {content.description}
          </p>
        </div>
      </header>

      <section className="section">
        <div className="container">
          {loading ? (
            <div className="text-center" style={{ padding: '4rem 0' }}>
              <p style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>Curating Masterpieces...</p>
            </div>
          ) : (
            portfolios.length > 0 ? (
              <div className="client-grid">
                {portfolios.map((portfolio, idx) => (
                  <Link to={`/portfolio/${category}/${encodeURIComponent(portfolio.clientName)}`} key={idx} className="client-card">
                    {portfolio.photos[0] && (
                      <img className="client-card-image" src={portfolio.photos[0]} alt="" />
                    )}
                    <h2 className="client-name">{portfolio.clientName}</h2>
                    <span className="client-photo-count">{portfolio.photos.length} Captured Moments</span>
                  </Link>
                ))}
              </div>
            ) : <p className="text-center" style={{ padding: '4rem 0' }}>No portfolios published yet.</p>
          )}
        </div>
      </section>
    </div>
  );
};
