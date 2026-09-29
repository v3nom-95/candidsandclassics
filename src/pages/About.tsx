import React from 'react';

export const About: React.FC = () => {
  return (
    <div className="content-page">
      <div className="container">
        <h1 className="page-title animate-fade-in text-center" style={{ marginBottom: '4rem' }}>Our Story</h1>
        
        <div className="about-content animate-fade-in delay-200">
          <div>
            <img 
              src="https://images.unsplash.com/photo-1595981267035-7b04d84b52ad?auto=format&fit=crop&w=800&q=80" 
              alt="Candids & Classics Studio"
              className="about-image"
            />
          </div>
          <div>
            <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: 'var(--color-primary)' }}>Capturing the Soul of Indian Traditions</h2>
            <p style={{ marginBottom: '1.5rem', fontSize: '1.1rem', color: 'var(--color-text-dark)' }}>
              Welcome to Candids & Classics. With over two decades of expertise in visual storytelling, we capture weddings, childhood, and the everyday moments that deserve to be remembered.
            </p>
            <p style={{ marginBottom: '1.5rem', fontSize: '1.1rem', color: 'var(--color-text-dark)' }}>
              From the vibrant hues of the Haldi to the profound silence of the pheras, our approach is unobtrusive yet deeply intimate. We believe that true beauty lies in raw, unscripted moments.
            </p>
            <p style={{ fontSize: '1.1rem', color: 'var(--color-text-dark)' }}>
              Let us be the silent narrators of your most beautiful chapter. We promise an experience as premium and unique as your love story.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
