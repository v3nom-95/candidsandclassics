import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchPortfolios } from '../lib/data';

export const Home: React.FC = () => {
  const [galleryPhotos, setGalleryPhotos] = useState<string[]>([]);

  useEffect(() => {
    fetchPortfolios()
      .then(portfolios => setGalleryPhotos(portfolios.flatMap(portfolio => portfolio.photos)))
      .catch(error => console.error('Failed to load homepage gallery photos', error));
  }, []);

  return (
    <div>
      <section className="hero">
        <img 
          src="https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1920&q=80" 
          alt="Indian Wedding Couple" 
          className="hero-bg animate-fade-in"
        />
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

      <section className="section" style={{ backgroundColor: 'var(--color-bg)', paddingBottom: 0 }}>
        <div className="container text-center animate-fade-in delay-100">
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>A Symphony of Moments</h2>
          <p style={{ maxWidth: '700px', margin: '0 auto', color: 'var(--color-text-dark)' }}>
            From the delicate intricacies of mehendi to the sacred vows around the holy fire, our lenses capture the soul of indigenous Indian celebrations. Here is a glimpse of our artistry.
          </p>
        </div>

        {galleryPhotos.length > 0 && (
          <div className="scroll-gallery-container mt-8">
            <div className="scroll-gallery-track">
              {[...galleryPhotos, ...galleryPhotos].map((photo, index) => (
                <div className="scroll-item" key={`${photo}-${index}`} aria-hidden={index >= galleryPhotos.length}>
                  <img src={photo} alt={index < galleryPhotos.length ? `Wedding moment ${index + 1}` : ''} loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        )}
          
        <div className="container text-center mt-8" style={{ marginTop: '4rem' }}>
          <Link to="/portfolio" className="btn">Explore Client Stories</Link>
        </div>
      </section>
    </div>
  );
};
