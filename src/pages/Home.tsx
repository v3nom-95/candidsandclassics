import React from 'react';
import { Link } from 'react-router-dom';

const RANDOM_PHOTOS = [
  'https://images.unsplash.com/photo-1543880884-6338e55e0903?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1583939000240-690db252f4dc?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1544078755-9b2fdfb8fb5e?auto=format&fit=crop&w=800&q=80',
];

export const Home: React.FC = () => {
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

        <div className="scroll-gallery-container mt-8">
          <div className="scroll-gallery-track">
            {/* Duplicate array for seamless infinite loop */}
            {[...RANDOM_PHOTOS, ...RANDOM_PHOTOS].map((photo, index) => (
              <div className="scroll-item" key={index}>
                <img src={photo} alt={`Wedding moment ${index + 1}`} loading="lazy" />
              </div>
            ))}
          </div>
        </div>
          
        <div className="container text-center mt-8" style={{ marginTop: '4rem' }}>
          <Link to="/portfolio" className="btn">Explore Client Stories</Link>
        </div>
      </section>
    </div>
  );
};
