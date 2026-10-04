import React from 'react';
import { SEOHead } from '../components/SEOHead';

const ABOUT_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "@id": "https://candidsandclassics.com/about#aboutpage",
  "url": "https://candidsandclassics.com/about",
  "name": "About Candids & Classics – Our Story | Best Photography Studio Hyderabad",
  "description": "Learn about Candids & Classics, Hyderabad's most trusted photography studio with 20+ years of expertise in wedding photography, kids photography, and cinematic filmmaking.",
  "isPartOf": { "@id": "https://candidsandclassics.com/#website" },
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://candidsandclassics.com/" },
      { "@type": "ListItem", "position": 2, "name": "About", "item": "https://candidsandclassics.com/about" }
    ]
  }
};

export const About: React.FC = () => {
  return (
    <div className="content-page">
      <SEOHead
        title="About Us – Our Story & Mission"
        description="Candids & Classics has 20+ years of expertise in visual storytelling. Based in Hyderabad, we are the most trusted photography studio for weddings, kids photography, child portraits, and cinematic filmmaking across Telangana and Andhra Pradesh."
        keywords="about Candids and Classics, photography studio Hyderabad, best photographers Hyderabad, wedding photographer team Hyderabad, professional photography studio Telangana, experienced wedding photographers India"
        canonicalPath="/about"
        jsonLd={ABOUT_JSON_LD}
      />
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
