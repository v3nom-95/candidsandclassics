import React from 'react';

export const Contact: React.FC = () => {
  return (
    <div className="content-page">
      <div className="container">
        <h1 className="page-title animate-fade-in text-center">Get In Touch</h1>
        <p className="text-center mb-8 animate-fade-in delay-100" style={{ maxWidth: '600px', margin: '0 auto 3rem', fontSize: '1.1rem' }}>
          We would love to hear about your upcoming celebrations. Let's create visual poetry together.
        </p>

        <form className="contact-form animate-fade-in delay-200" onSubmit={(e) => e.preventDefault()}>
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Email Address" required />
          <input type="tel" placeholder="Phone Number" />
          <input type="text" placeholder="Event Date & Location" />
          <textarea placeholder="Tell us about your wedding..." required></textarea>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Send Inquiry
          </button>
        </form>
      </div>
    </div>
  );
};
