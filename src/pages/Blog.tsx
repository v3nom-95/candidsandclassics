import React from 'react';
import { Link } from 'react-router-dom';

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

export const Blog: React.FC = () => {
  return (
    <div className="content-page">
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
