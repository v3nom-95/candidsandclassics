import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { fetchPortfolios } from '../lib/data';
import type { Portfolio, PortfolioCategory } from '../lib/data';
import { SEOHead } from '../components/SEOHead';

const categoryContent: Record<PortfolioCategory, { title: string; description: string }> = {
  weddings: {
    title: 'Wedding Stories',
    description: 'A curated collection of love, tradition, and joyous celebrations, captured for the couples who invited us into their story.',
  },
  'kids-photography': {
    title: 'Kids Photography',
    description: 'Big imaginations, little details, and the wonderfully unscripted moments of growing up.',
  },
  'documentary-films': {
    title: 'Documentary Films',
    description: 'Real moments, honest emotion, and the stories that deserve to be revisited on screen.',
  },
};

const categorySEO: Record<PortfolioCategory, { seoTitle: string; seoDescription: string; seoKeywords: string }> = {
  weddings: {
    seoTitle: 'Wedding Photography Portfolio – Best Wedding Photographer Hyderabad',
    seoDescription: 'Browse our stunning wedding photography portfolio. Candids & Classics captures candid moments, traditional ceremonies, haldi, mehndi, sangeet, baraat & reception across Hyderabad, Telangana & India. See why we are rated the best wedding photographers in Hyderabad.',
    seoKeywords: 'wedding photography portfolio Hyderabad, best wedding photos Hyderabad, candid wedding photography gallery, Indian wedding photographer portfolio, South Indian wedding photography, Telugu wedding photos, haldi photography, mehndi photography, reception photography Hyderabad, destination wedding portfolio India',
  },
  'kids-photography': {
    seoTitle: 'Kids & Child Photography Portfolio – Best in Hyderabad',
    seoDescription: 'Explore our kids and child photography portfolio. Candids & Classics is Hyderabad\'s best studio for baby photography, newborn shoots, birthday portraits, and milestone sessions. Capturing childhood magic since 2003.',
    seoKeywords: 'kids photography Hyderabad, child photography portfolio, baby photography Hyderabad, newborn photography Hyderabad, birthday photography Hyderabad, best kids photographer Hyderabad, toddler photography, milestone photography, family photography Hyderabad',
  },
  'documentary-films': {
    seoTitle: 'Documentary Films Portfolio – Cinematic Storytelling Hyderabad',
    seoDescription: 'Watch our documentary films portfolio. Candids & Classics creates cinematic, emotionally rich documentary films in Hyderabad. Real stories, honest emotions, and beautifully crafted narratives.',
    seoKeywords: 'documentary films Hyderabad, documentary filmmaker Hyderabad, cinematic documentary India, real story films, documentary photography Hyderabad, best documentary filmmaker Telangana',
  },
};

export const PortfolioList: React.FC = () => {
  const location = useLocation();
  const pathCategory = location.pathname.split('/')[2] as PortfolioCategory | undefined;
  const category = pathCategory && pathCategory in categoryContent ? pathCategory : 'weddings';
  const content = categoryContent[category];
  const seo = categorySEO[category];
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

  const portfolioJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `https://candidsandclassics.com/portfolio/${category}#portfolio`,
    "url": `https://candidsandclassics.com/portfolio/${category}`,
    "name": seo.seoTitle,
    "description": seo.seoDescription,
    "isPartOf": { "@id": "https://candidsandclassics.com/#website" },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://candidsandclassics.com/" },
        { "@type": "ListItem", "position": 2, "name": "Portfolio", "item": "https://candidsandclassics.com/portfolio" },
        { "@type": "ListItem", "position": 3, "name": content.title, "item": `https://candidsandclassics.com/portfolio/${category}` }
      ]
    },
    "mainEntity": {
      "@type": "ImageGallery",
      "name": content.title,
      "description": content.description,
      "numberOfItems": portfolios.length,
      "provider": { "@id": "https://candidsandclassics.com/#organization" }
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh' }}>
      <SEOHead
        title={seo.seoTitle}
        description={seo.seoDescription}
        keywords={seo.seoKeywords}
        canonicalPath={`/portfolio/${category}`}
        jsonLd={portfolioJsonLd}
      />
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
