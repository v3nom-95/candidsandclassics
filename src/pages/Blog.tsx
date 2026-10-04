import React from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';

const BLOG_POSTS = [
  {
    id: 1,
    title: 'The Significance of Haldi in Indian Weddings',
    date: 'Sep 24, 2026',
    image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=80',
    excerpt: 'Exploring the vibrant traditions and the emotional significance behind the golden hues of the Haldi ceremony.'
  },
  {
    id: 2,
    title: '5 Tips for the Perfect Bridal Portrait',
    date: 'Aug 15, 2026',
    image: 'https://images.unsplash.com/photo-1544078755-9b2fdfb8fb5e?auto=format&fit=crop&w=800&q=80',
    excerpt: 'Our top secrets to looking effortless and radiant in your bridal portraits.'
  },
  {
    id: 3,
    title: 'Capturing the Chaos: The Baraat',
    date: 'Jul 02, 2026',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    excerpt: 'How we navigate the beautiful chaos of the groom\'s procession to capture high-energy moments.'
  }
];

const BLOG_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": "https://candidsandclassics.com/blog#blogpage",
  "url": "https://candidsandclassics.com/blog",
  "name": "Photography Journal & Blog | Candids & Classics Hyderabad",
  "description": "Wedding photography tips, Indian wedding traditions, bridal portrait guides, and behind-the-scenes stories from Hyderabad's best photography studio.",
  "isPartOf": { "@id": "https://candidsandclassics.com/#website" },
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://candidsandclassics.com/" },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://candidsandclassics.com/blog" }
    ]
  },
  "mainEntity": {
    "@type": "ItemList",
    "itemListElement": BLOG_POSTS.map((post, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "item": {
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.excerpt,
        "datePublished": post.date,
        "image": post.image,
        "author": { "@id": "https://candidsandclassics.com/#organization" },
        "publisher": { "@id": "https://candidsandclassics.com/#organization" }
      }
    }))
  }
};

export const Blog: React.FC = () => {
  return (
    <div className="content-page">
      <SEOHead
        title="Photography Blog & Journal – Wedding Tips & Inspiration"
        description="Read expert tips on Indian wedding photography, bridal portraits, haldi ceremonies, baraat processions, and more from Candids & Classics – Hyderabad's leading photography studio. Expert wedding photography advice and behind-the-scenes stories."
        keywords="wedding photography tips, Indian wedding traditions, bridal portrait tips, haldi ceremony photography, baraat photography tips, wedding photography blog Hyderabad, photography inspiration, best wedding photographer blog India"
        canonicalPath="/blog"
        ogType="blog"
        jsonLd={BLOG_JSON_LD}
      />
      <div className="container">
        <h1 className="page-title animate-fade-in text-center">Journal</h1>
        <p className="text-center mb-8 animate-fade-in delay-100" style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>
          Stories, tips, and inspiration from behind the lens.
        </p>

        <div className="blog-grid animate-fade-in delay-200">
          {BLOG_POSTS.map(post => (
            <article key={post.id} className="blog-card">
              <img src={post.image} alt={post.title} className="blog-image" />
              <div className="blog-content">
                <span className="blog-date">{post.date}</span>
                <h3 className="blog-title">{post.title}</h3>
                <p style={{ color: 'var(--color-text-dark)', marginBottom: '1.5rem' }}>{post.excerpt}</p>
                <Link to="#" className="btn" style={{ padding: '0.5rem 1.5rem', fontSize: '0.9rem' }}>Read More</Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};
