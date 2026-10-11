import React, { useEffect, useState } from 'react';
import { fetchBlogPosts } from '../lib/data';
import type { BlogPost } from '../lib/data';
import { SEOHead } from '../components/SEOHead';

export const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogPosts()
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load blog posts', err);
        setLoading(false);
      });
  }, []);

  const blogJsonLd = {
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
      "numberOfItems": posts.length,
      "itemListElement": posts.map((post, i) => ({
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

  return (
    <div className="content-page">
      <SEOHead
        title="Photography Blog & Journal – Wedding Tips & Inspiration"
        description="Read expert tips on Indian wedding photography, bridal portraits, haldi ceremonies, baraat processions, and more from Candids & Classics – Hyderabad's leading photography studio. Expert wedding photography advice and behind-the-scenes stories."
        keywords="wedding photography tips, Indian wedding traditions, bridal portrait tips, haldi ceremony photography, baraat photography tips, wedding photography blog Hyderabad, photography inspiration, best wedding photographer blog India"
        canonicalPath="/blog"
        ogType="blog"
        jsonLd={blogJsonLd}
      />
      <div className="container">
        <h1 className="page-title animate-fade-in text-center">Journal</h1>
        <p className="text-center mb-8 animate-fade-in delay-100" style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>
          Stories, tips, and inspiration from behind the lens.
        </p>

        {loading ? (
          <div className="text-center" style={{ padding: '4rem 0' }}>
            <p style={{ fontSize: '1.3rem', fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>Loading Journal Stories...</p>
          </div>
        ) : posts.length > 0 ? (
          <div className="blog-grid animate-fade-in delay-200">
            {posts.map(post => (
              <article key={post.id} className="blog-card">
                {post.image && (
                  <img src={post.image} alt={post.title} className="blog-image" loading="lazy" />
                )}
                <div className="blog-content">
                  {post.date && <span className="blog-date">{post.date}</span>}
                  <h3 className="blog-title">{post.title}</h3>
                  {post.excerpt && (
                    <p style={{ color: 'var(--color-text-dark)', marginBottom: '1.5rem' }}>{post.excerpt}</p>
                  )}
                  {post.link && (
                    <a
                      href={post.link}
                      target={post.link.startsWith('http') ? '_blank' : '_self'}
                      rel="noopener noreferrer"
                      className="btn"
                      style={{ padding: '0.5rem 1.5rem', fontSize: '0.9rem' }}
                    >
                      Read More
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-center" style={{ padding: '4rem 0' }}>No stories published in the journal sheet yet.</p>
        )}
      </div>
    </div>
  );
};
