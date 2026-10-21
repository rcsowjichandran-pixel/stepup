import React, { useState } from 'react';
import { ArrowLeft, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import './ContactPage.css';

export default function ContactPage({ setCurrentPage }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatusMessage({ success: false, text: 'Please fill in your name, email, and message.' });
      return;
    }

    setLoading(true);
    setStatusMessage(null);
    try {
      const response = await api.sendContactEnquiry(formData);
      setStatusMessage({
        success: true,
        text: response.message || 'Thank you! Your message has been sent to our customer care team.',
      });
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      setStatusMessage({
        success: false,
        text: error.message || 'We could not send your enquiry. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-page-container">
        <button
          type="button"
          className="contact-back-button"
          onClick={() => setCurrentPage('home')}
        >
          <ArrowLeft size={14} />
          <span>Back</span>
        </button>

        <section className="contact-overview" aria-labelledby="contact-title">
          <div className="contact-details">
            <h1 id="contact-title">Contact Us</h1>
            <div className="contact-online-orders">
              <h2>For Online Orders</h2>
              <p>Enquiry/Complaint</p>
              <a href="tel:9976357250">9976357250</a>
              <p className="contact-other-queries">Any other queries</p>
              <a href="tel:9976357250">9976357250</a>
              <a href="tel:9976357250">9976357250</a>
              <p>10 AM-7:00 PM</p>
              <p className="contact-email">
                Email: <a href="mailto:customercarestepup.in@gmail.com">customercarestepup.in@gmail.com</a>
              </p>
            </div>
          </div>

          <img
            className="contact-feature-image"
            src="https://stepup-wx1d.onrender.com/media/contact.JPG"
            alt="StepUp shoes in a colorful collection"
          />
        </section>

        <section className="contact-enquiry-section" aria-labelledby="enquiry-title">
          <div className="contact-enquiry">
            <h2 id="enquiry-title">Enquiry Form</h2>

            {statusMessage && (
              <div
                className={`contact-status ${statusMessage.success ? 'is-success' : 'is-error'}`}
                role="status"
              >
                {statusMessage.success ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <span>{statusMessage.text}</span>
              </div>
            )}

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="contact-field contact-field-name">
                <label htmlFor="contact-name">Name</label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="name"
                  required
                />
              </div>

              <div className="contact-field">
                <label htmlFor="contact-email">Email</label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>

              <div className="contact-field">
                <label htmlFor="contact-phone">Phone</label>
                <input
                  id="contact-phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  autoComplete="tel"
                />
              </div>

              <div className="contact-field contact-field-message">
                <label htmlFor="contact-message">Message</label>
                <textarea
                  id="contact-message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  required
                />
              </div>

              <button className="contact-submit-button" type="submit" disabled={loading}>
                <Send size={14} />
                <span>{loading ? 'Sending...' : 'Send'}</span>
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
