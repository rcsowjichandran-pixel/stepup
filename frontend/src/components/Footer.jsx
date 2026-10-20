import React, { useState } from 'react';
import { Mail, Phone, MapPin, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import './Footer.css';

export default function Footer({ setCurrentPage, onSelectCategory }) {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState(null); // { success: bool, message: str }
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      setSubscribeStatus({ success: false, message: 'Please enter a valid email address.' });
      return;
    }
    setLoading(true);
    try {
      const res = await api.subscribeNewsletter(newsletterEmail);
      setSubscribeStatus({ success: true, message: res.message || 'Subscribed successfully!' });
      setNewsletterEmail('');
    } catch (err) {
      setSubscribeStatus({
        success: false,
        message: err.message || 'We could not complete your subscription. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const navigateTo = (page, catId = null) => {
    if (catId && onSelectCategory) {
      onSelectCategory(catId);
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer style={{ backgroundColor: '#2F4F4F', color: '#EBF1F1', marginTop: 'auto', borderTop: '4px solid #FFA0A0' }}>
      {/* Top Banner Accent */}
      <div style={{ backgroundColor: '#243E3E', padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', fontSize: '13px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>🚚</span>
            <span><b>Free All-India Express Delivery</b> on orders above ₹999</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>🔄</span>
            <span><b>30-Day Hassle-Free Returns</b> & Instant Size Exchange</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>🛡️</span>
            <span><b>100% Genuine Quality</b> Handcrafted Comfort Guarantee</span>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container" style={{ padding: '48px 20px 36px 20px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '36px',
        }}>
          
          {/* Column 1: Contact Us */}
          <div>
            <h4 style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: '16px', color: '#FFFFFF', marginBottom: '16px', letterSpacing: '0.3px' }}>
              Contact Us
            </h4>
            <div style={{ fontSize: '13px', lineHeight: '1.8', color: '#D2DFDF' }}>
              <p style={{ marginBottom: '8px' }}>We'd love to hear from you!</p>
              <p style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <Phone size={14} color="#FFA0A0" />
                <span>Helpline: 1800 209 8000</span>
              </p>
              <p style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <Phone size={14} color="#FFA0A0" />
                <span>WhatsApp: +91 98450 12345</span>
              </p>
              <p style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <Mail size={14} color="#FFA0A0" />
                <span>Email: support@stepup.in</span>
              </p>
              <p style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginTop: '10px' }}>
                <MapPin size={15} color="#FFA0A0" style={{ flexShrink: 0, marginTop: '4px' }} />
                <span>StepUp Footwear Tower, Outer Ring Road, Bangalore - 560103, India</span>
              </p>
            </div>
          </div>

          {/* Column 2: Shop */}
          <div>
            <h4 style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: '16px', color: '#FFFFFF', marginBottom: '16px', letterSpacing: '0.3px' }}>
              Shop
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '10px', color: '#D2DFDF' }}>
              <li>
                <button onClick={() => navigateTo('shop', 'women')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}>
                  Women
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('shop', 'men')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}>
                  Men
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('shop', 'kids')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}>
                  Kids
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('shop', 'brands')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}>
                  Accessories & Brands
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('shop', 'offers')} style={{ background: 'none', border: 'none', color: '#FFA0A0', fontWeight: 600, cursor: 'pointer', padding: 0, fontSize: 'inherit' }}>
                  Offers & Clearance Sale
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Info */}
          <div>
            <h4 style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: '16px', color: '#FFFFFF', marginBottom: '16px', letterSpacing: '0.3px' }}>
              Info
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '10px', color: '#D2DFDF' }}>
              <li>
                <button onClick={() => navigateTo('shop')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}>
                  Search Catalog
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('about')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}>
                  Return & Exchange Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('about')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}>
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('about')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}>
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('contact')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}>
                  Shipping & Tracking
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('about')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}>
                  Footwear Care Blogs
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter & Social */}
          <div style={{ minWidth: '240px' }}>
            <h4 style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: '16px', color: '#FFFFFF', marginBottom: '16px', letterSpacing: '0.3px' }}>
              Let's stay in touch!
            </h4>
            <p style={{ fontSize: '12px', color: '#D2DFDF', marginBottom: '14px', lineHeight: '1.5' }}>
              Sign up for exclusive offers, new shoe drops, festive deals and style advice.
            </p>

            <form className="footer-newsletter-form" onSubmit={handleSubscribe}>
              <input
                  className="footer-newsletter-input"
                  type="email"
                  placeholder="Enter your email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  required
                />
                <button
                  className="footer-newsletter-button"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? '...' : 'Subscribe'}
                </button>
              {subscribeStatus && (
                <div style={{
                  marginTop: '8px',
                  fontSize: '12px',
                  color: subscribeStatus.success ? '#A5D6A7' : '#FFA0A0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  {subscribeStatus.success && <CheckCircle2 size={13} />}
                  <span>{subscribeStatus.message}</span>
                </div>
              )}
            </form>

            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#FFFFFF', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Social Media
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <a href="#facebook" aria-label="Facebook" title="Facebook" style={{ display: 'flex', width: '24px', height: '24px', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" role="img" aria-hidden="true">
                    <path fill="#1877F2" d="M24 12a12 12 0 1 0-13.875 11.85v-8.38H7.08V12h3.045V9.36c0-3.006 1.792-4.667 4.53-4.667 1.312 0 2.685.234 2.685.234v2.953h-1.512c-1.49 0-1.955.925-1.955 1.874V12h3.325l-.532 3.47h-2.793v8.38A12.003 12.003 0 0 0 24 12Z" />
                    <path fill="#FFFFFF" d="M16.666 15.47 17.2 12h-3.326V9.754c0-.95.465-1.874 1.955-1.874h1.512V4.927s-1.373-.234-2.685-.234c-2.738 0-4.53 1.661-4.53 4.667V12H7.08v3.47h3.045v8.38a12.1 12.1 0 0 0 3.75 0v-8.38h2.791Z" />
                  </svg>
                </a>
                <a href="#instagram" aria-label="Instagram" title="Instagram" style={{ display: 'flex', width: '24px', height: '24px', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="21" height="21" viewBox="0 0 24 24" role="img" aria-hidden="true">
                    <defs>
                      <linearGradient id="footer-instagram-gradient" x1="0" y1="1" x2="1" y2="0">
                        <stop offset="0%" stopColor="#FFD600" />
                        <stop offset="48%" stopColor="#FF3A44" />
                        <stop offset="100%" stopColor="#C13584" />
                      </linearGradient>
                    </defs>
                    <rect x="1" y="1" width="22" height="22" rx="6" fill="url(#footer-instagram-gradient)" />
                    <rect x="5" y="5" width="14" height="14" rx="4" fill="none" stroke="#FFFFFF" strokeWidth="2" />
                    <circle cx="12" cy="12" r="3.3" fill="none" stroke="#FFFFFF" strokeWidth="2" />
                    <circle cx="17.5" cy="6.8" r="1.2" fill="#FFFFFF" />
                  </svg>
                </a>
                <a href="#twitter" aria-label="Twitter" title="Twitter" style={{ display: 'flex', width: '24px', height: '24px', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" role="img" aria-hidden="true">
                    <rect width="24" height="24" rx="5" fill="#1DA1F2" />
                    <path fill="#FFFFFF" d="M19.9 7.1c-.58.26-1.2.43-1.85.51a3.23 3.23 0 0 0 1.42-1.78 6.45 6.45 0 0 1-2.05.78 3.22 3.22 0 0 0-5.57 2.2c0 .25.03.5.08.74a9.15 9.15 0 0 1-6.64-3.37 3.22 3.22 0 0 0 1 4.3 3.2 3.2 0 0 1-1.46-.4v.04c0 1.55 1.1 2.84 2.56 3.14-.27.07-.55.11-.85.11-.2 0-.41-.02-.6-.06a3.23 3.23 0 0 0 3.01 2.24 6.47 6.47 0 0 1-4 1.38c-.26 0-.51-.01-.77-.05a9.12 9.12 0 0 0 4.95 1.45c5.94 0 9.19-4.92 9.19-9.19l-.01-.42a6.56 6.56 0 0 0 1.59-1.62Z" />
                  </svg>
                </a>
                <a href="#meta" aria-label="Meta" title="Meta" style={{ display: 'flex', width: '34px', height: '24px', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="34" height="22" viewBox="0 0 34 22" role="img" aria-hidden="true">
                    <path
                      d="M2 11C5 4.2 9 4.2 17 11s12 6.8 15 0c-3-6.8-7-6.8-15 0s-12 6.8-15 0"
                      fill="none"
                      stroke="#0866FF"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Bar */}
        <div style={{
          marginTop: '40px',
          paddingTop: '20px',
          borderTop: '1px solid rgba(255,255,255,0.12)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '12px',
          color: '#A8BCBC'
        }}>
          <div>
            © 2026 StepUp.in Footwear India Pvt Ltd. All Rights Reserved.
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span>Secure 256-Bit SSL Checkout</span>
            <span>Made with Care for Indian Footwear</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
