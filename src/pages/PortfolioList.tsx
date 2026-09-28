import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchPortfolios } from '../lib/data';
import type { Portfolio } from '../lib/data';

export const PortfolioList: React.FC = () => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortfolios()
      .then(data => {
        setPortfolios(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh' }}>
      <header className="page-header animate-fade-in">
        <div className="container">
          <h1 className="page-title">Client Stories</h1>
          <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>
            A curated collection of love, tradition, and joyous celebrations. Discover the magic we've captured for our wonderful couples.
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
            <div className="client-grid">
              {portfolios.map((portfolio, idx) => (
                <Link to={`/portfolio/${encodeURIComponent(portfolio.clientName)}`} key={idx} className="client-card">
                  {portfolio.photos[0] && (
                    <img className="client-card-image" src={portfolio.photos[0]} alt="" />
                  )}
                  <h2 className="client-name">{portfolio.clientName}</h2>
                  <span className="client-photo-count">{portfolio.photos.length} Captured Moments</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
