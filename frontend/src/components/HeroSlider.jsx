import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '../services/api';
import './HeroSlider.css';

const FALLBACK_SLIDES = [
  {
    id: 'women-red',
    title: 'Womens red color high heel for party for your first order get a free gift',
    category: 'women',
    image: '/images/hero_slide_1_red.png',
  },
  {
    id: 'kids-sale',
    title: 'Flat 50% Sale kids shoes',
    category: 'kids',
    image: '/images/hero_slide_2_kids.png',
  },
  {
    id: 'men-office',
    title: "Men's wear high heel office shoe only 40% discount today only",
    category: 'men',
    image: '/images/hero_slide_3_men.png',
  },
  {
    id: 'women-blue',
    title: 'Womens High Heels Flat 30% offer for your first order',
    category: 'women',
    image: '/images/hero_slide_4_blue.png',
  },
];

export default function HeroSlider({ onShopClick }) {
  const [slides, setSlides] = useState(FALLBACK_SLIDES);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    api.getHeroSlides()
      .then(data => {
        if (data.length > 0) setSlides(data);
      })
      .catch(error => console.error('Error fetching hero slides:', error));
  }, []);

  useEffect(() => {
    if (slides.length < 2) return undefined;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = (e) => {
    if (e) e.stopPropagation();
    setCurrentSlide(current => (current + 1) % slides.length);
  };

  const prevSlide = (e) => {
    if (e) e.stopPropagation();
    setCurrentSlide(current => (current - 1 + slides.length) % slides.length);
  };

  if (slides.length === 0) return null;

  const active = slides[currentSlide];

  return (
    <section 
      style={{
        position: 'relative',
        width: '100%',
        backgroundColor: '#FFFFFF',
        padding: '0 0 20px 0',
      }}
    >
      <div style={{ maxWidth: '1024px', margin: '0 auto', padding: '0 12px' }}>
        
        {/* Banner Frame */}
        <div style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1024 / 330',
          overflow: 'hidden',
          backgroundColor: '#F8F9FA',
          cursor: 'pointer',
          borderRadius: '2px'
        }}
        onClick={() => onShopClick && onShopClick(active.category)}
        >
          {/* Smooth Cross-Fade Slides */}
          {slides.map((s, idx) => (
            <img 
              key={s.id}
              src={s.image}
              alt={s.title}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                opacity: currentSlide === idx ? 1 : 0,
                transition: 'opacity 0.7s ease-in-out',
                zIndex: currentSlide === idx ? 2 : 1,
                display: 'block'
              }}
            />
          ))}

          {/* Left Arrow Button */}
          <button
            onClick={prevSlide}
            style={{
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.7)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 15,
              color: '#2F4F4F',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#FFFFFF'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.7)'}
            title="Previous Slide"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={nextSlide}
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.7)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 15,
              color: '#2F4F4F',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#FFFFFF'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.7)'}
            title="Next Slide"
          >
            <ChevronRight size={20} />
          </button>

          <div
            aria-label="Choose a hero slide"
            style={{
              position: 'absolute',
              left: '50%',
              bottom: '23%',
              transform: 'translateX(-50%)',
              display: 'flex',
              alignItems: 'center',
              width: '80px',
              height: '24px',
              justifyContent: 'space-between',
              padding: '0 6px',
              border: '1px solid rgba(47, 79, 79, 0.18)',
              borderRadius: '999px',
              backgroundColor: 'rgba(255, 255, 255, 0.94)',
              boxShadow: '0 1px 4px rgba(0, 0, 0, 0.2)',
              zIndex: 12,
            }}
          >
            {slides.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                aria-label={`Show slide ${idx + 1}: ${slide.title}`}
                aria-pressed={currentSlide === idx}
                className="hero-slide-dot"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentSlide(idx);
                }}
                style={{
                  width: '18px',
                  height: '18px',
                }}
              />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
