import React from 'react';
import { SEOHead } from '../components/SEOHead';

const CONTACT_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "@id": "https://candidsandclassics.com/contact#contactpage",
  "url": "https://candidsandclassics.com/contact",
  "name": "Contact Candids & Classics – Book Your Photography Session",
  "description": "Get in touch with Candids & Classics, Hyderabad's best photography studio. WhatsApp us at +91 99510 99998 to book your wedding, kids, or documentary photography session.",
  "isPartOf": { "@id": "https://candidsandclassics.com/#website" },
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://candidsandclassics.com/" },
      { "@type": "ListItem", "position": 2, "name": "Contact", "item": "https://candidsandclassics.com/contact" }
    ]
  }
};

export const Contact: React.FC = () => {
  const whatsappNumber = '919951099998';
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  return (
    <div className="content-page">
      <SEOHead
        title="Contact Us – Book Your Photography Session"
        description="Contact Candids & Classics, Hyderabad's best photography studio. Reach us on WhatsApp at +91 99510 99998 to discuss your wedding photography, kids photography, or film project. Available for bookings across Hyderabad, Telangana, and Andhra Pradesh."
        keywords="contact Candids and Classics, book wedding photographer Hyderabad, photography studio phone number Hyderabad, hire photographer Hyderabad, wedding photography booking, kids photography booking Hyderabad, best photographer contact Hyderabad"
        canonicalPath="/contact"
        jsonLd={CONTACT_JSON_LD}
      />
      <div className="container">
        <h1 className="page-title animate-fade-in text-center">Get In Touch</h1>
        <p className="text-center mb-8 animate-fade-in delay-100" style={{ maxWidth: '600px', margin: '0 auto 3rem', fontSize: '1.1rem' }}>
          We would love to hear about your upcoming celebrations. Let's create visual poetry together.
        </p>

        <div className="animate-fade-in delay-200" style={{
          maxWidth: '480px',
          margin: '0 auto',
          textAlign: 'center',
          padding: '3rem 2rem',
          borderRadius: '1rem',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(12px)',
        }}>
          <div style={{
            width: '72px',
            height: '72px',
            margin: '0 auto 1.5rem',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #25D366, #128C7E)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(37, 211, 102, 0.3)',
          }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </div>

          <h2 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', fontWeight: 600 }}>Chat with us on WhatsApp</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem', fontSize: '1.05rem' }}>
            +91 99510 99998
          </p>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.9rem 2.4rem',
              fontSize: '1.05rem',
              background: 'linear-gradient(135deg, #25D366, #128C7E)',
              border: 'none',
              textDecoration: 'none',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Start a Conversation
          </a>
        </div>
      </div>
    </div>
  );
};
