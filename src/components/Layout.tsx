import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Mail, Menu, X } from 'lucide-react';

export const Layout: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navSolid = scrolled || location.pathname !== '/' || mobileMenuOpen;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} style={{
        background: navSolid ? 'rgba(253, 251, 247, 0.97)' : 'transparent',
        borderBottom: navSolid ? '1px solid var(--color-accent)' : 'none',
      }}>
        <div className="container">
          <Link to="/" className="navbar-logo" style={{ color: navSolid ? 'var(--color-primary)' : 'var(--color-text-light)' }}>
            CANDIDS <span style={{ color: 'var(--color-secondary)' }}>&</span> CLICKS
          </Link>
          <button
            className="navbar-toggle"
            type="button"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="primary-navigation"
            onClick={() => setMobileMenuOpen(open => !open)}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <div className={`navbar-links ${mobileMenuOpen ? 'is-open' : ''}`} id="primary-navigation">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className={location.pathname === '/' ? 'active' : ''} style={{ color: navSolid ? 'var(--color-text-dark)' : 'var(--color-text-light)' }}>Home</Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className={location.pathname.includes('/about') ? 'active' : ''} style={{ color: navSolid ? 'var(--color-text-dark)' : 'var(--color-text-light)' }}>About</Link>
            <Link to="/portfolio" onClick={() => setMobileMenuOpen(false)} className={location.pathname.includes('/portfolio') ? 'active' : ''} style={{ color: navSolid ? 'var(--color-text-dark)' : 'var(--color-text-light)' }}>Portfolio</Link>
            <Link to="/blog" onClick={() => setMobileMenuOpen(false)} className={location.pathname.includes('/blog') ? 'active' : ''} style={{ color: navSolid ? 'var(--color-text-dark)' : 'var(--color-text-light)' }}>Blog</Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className={location.pathname.includes('/contact') ? 'active' : ''} style={{ color: navSolid ? 'var(--color-text-dark)' : 'var(--color-text-light)' }}>Contact</Link>
          </div>
        </div>
      </nav>

      <main>
        <Outlet />
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-logo">CANDIDS & CLICKS</div>
          <p style={{ maxWidth: '600px', margin: '0 auto' }}>
            Capturing the ethereal beauty of indigenous Indian weddings. We believe every glance, every tear, and every smile tells a timeless story.
          </p>
          <div className="footer-socials">
            <a href="#">Instagram</a>
            <a href="#">Facebook</a>
            <a href="#"><Mail size={24} /></a>
          </div>
          <div className="footer-bottom">
            &copy; {new Date().getFullYear()} Candids & Clicks Studio. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
};
