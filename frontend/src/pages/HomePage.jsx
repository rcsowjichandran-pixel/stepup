import React, { useState, useEffect } from 'react';
import { ArrowRight, Gift, Check } from 'lucide-react';
import HeroSlider from '../components/HeroSlider';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import './HomePage.css';

export default function HomePage({ setCurrentPage, onSelectCategory, onSelectProduct }) {
  const { applyCoupon } = useCart();
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [trendingLoadError, setTrendingLoadError] = useState(false);
  const [couponCopied, setCouponCopied] = useState(false);

  useEffect(() => {
    api.getProducts({ trending: true })
      .then(data => {
        setTrendingProducts(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        console.error('Error fetching trending products:', err);
        setTrendingLoadError(true);
      })
  }, []);

  const categories = [
    {
      id: 'men',
      name: 'Men',
      image: '/images/category_men.png',
      desc: 'Formals, Sneakers, Loafers'
    },
    {
      id: 'women',
      name: 'Women',
      image: '/images/category_women.png',
      desc: 'Heels, Slip-ons, Flats'
    },
    {
      id: 'kids',
      name: 'Kids',
      image: '/images/category_kids.png',
      desc: 'Boys, Girls & Toddlers'
    }
  ];

  const handleClaimOffer = () => {
    applyCoupon('STEPUP50');
    setCouponCopied(true);
    setTimeout(() => setCouponCopied(false), 3000);
  };

  return (
    <div className="home-page" style={{ paddingBottom: '40px' }}>
      
      {/* 1. Dynamic Hero Slider with Bullets */}
      <HeroSlider 
        onShopClick={(cat) => {
          if (onSelectCategory) onSelectCategory(cat);
          setCurrentPage('shop');
        }} 
      />

      {/* 2. Overview Section (Exact Figma Mockup text) */}
      <section style={{ padding: '42px 20px 24px 20px', textAlign: 'center', maxWidth: '820px', margin: '0 auto' }}>
        <h3 style={{
          fontFamily: "'Libre Baskerville', Georgia, serif",
          fontSize: '20px',
          fontWeight: 700,
          color: '#2F4F4F',
          marginBottom: '14px',
          letterSpacing: '-0.2px'
        }}>
          Overview
        </h3>
        <p style={{
          fontSize: '13px',
          lineHeight: '1.8',
          color: '#555555',
          fontStyle: 'italic',
          fontFamily: "'Libre Baskerville', Georgia, serif"
        }}>
          "Explore our curated selection of high quality shoes for every occasion. From durable athletic shoes designed for peak performance to stylish everyday sneakers and elegant dress shoes, we offer a diverse range of footwear to suit your needs. Our user-friendly interface makes it easy to browse our collection and find the perfect pair, while detailed product descriptions and high-quality images ensure you make an informed decision. Join our community of style and discover your next favorite pair!"
        </p>
      </section>

      {/* 3. "What are you looking for?" Categories Section */}
      <section style={{ padding: '24px 0 36px 0' }}>
        <div className="container">
          <h3 style={{
            fontFamily: "'Libre Baskerville', Georgia, serif",
            fontSize: '22px',
            fontWeight: 700,
            textAlign: 'center',
            color: '#1C2E2E',
            marginBottom: '26px'
          }}>
            What are you looking for?
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
            maxWidth: '960px',
            margin: '0 auto'
          }}>
            {categories.map(cat => (
              <div 
                key={cat.id}
                onClick={() => {
                  if (onSelectCategory) onSelectCategory(cat.id);
                  setCurrentPage('shop');
                }}
                style={{
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'transform 0.25s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '345/362',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  backgroundColor: '#F3F4F6',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
                  border: '1px solid #EAEAEA',
                  marginBottom: '10px'
                }}>
                  <img 
                    src={cat.image} 
                    alt={cat.name} 
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.4s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.04)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                  />
                </div>
                <h4 style={{
                  fontFamily: "'Libre Baskerville', Georgia, serif",
                  fontSize: '16px',
                  fontWeight: 700,
                  color: '#2F4F4F'
                }}>
                  {cat.name}
                </h4>
                <span style={{ fontSize: '12px', color: '#888888' }}>{cat.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. "New & Trending" Section (Figma Shoe Grid) */}
      <section style={{ padding: '36px 0 44px 0', backgroundColor: '#FBFDFD' }}>
        <div className="container">
          
          {/* Section Header */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{
              fontFamily: "'Libre Baskerville', Georgia, serif",
              fontSize: '22px',
              fontWeight: 700,
              color: '#1C2E2E',
              textAlign: 'center'
            }}>
              New & Trending
            </h3>
          </div>

          {/* Product Cards Grid: the eight catalog shoes shown in the reference */}
          <div className="trending-product-grid">
            {trendingProducts.map(prod => (
              <article key={prod.id} className="trending-product">
                <button
                  type="button"
                  className="trending-product-image"
                  onClick={() => onSelectProduct && onSelectProduct(prod)}
                  aria-label={`View ${prod.name}`}
                >
                  <img src={prod.image} alt={prod.name} loading="lazy" />
                </button>
                <button
                  type="button"
                  className="trending-product-name"
                  onClick={() => onSelectProduct && onSelectProduct(prod)}
                  title={prod.name}
                >
                  {prod.name}
                </button>
                <p className="trending-product-price">
                  MRP: ₹{Number(prod.price).toLocaleString()}
                </p>
              </article>
            ))}
          </div>

          {trendingLoadError && (
            <p role="status" style={{ textAlign: 'center', color: '#666666' }}>
              Trending products could not be loaded. Please refresh the page.
            </p>
          )}
          {!trendingLoadError && trendingProducts.length === 0 && (
            <p role="status" style={{ textAlign: 'center', color: '#666666' }}>
              No trending products are available right now.
            </p>
          )}

          <div className="trending-view-all">
            <button
              onClick={() => {
                if (onSelectCategory) onSelectCategory('all');
                setCurrentPage('shop');
              }}
            >
              View all <ArrowRight size={14} />
            </button>
          </div>

        </div>
      </section>

      {/* 5. Promotional Gift Banner (matching Figma bottom banner) */}
      <section style={{ padding: '24px 0' }}>
        <div className="container">
          <div className="first-order-offer">
            <span className="offer-confetti offer-confetti-one" aria-hidden="true" />
            <span className="offer-confetti offer-confetti-two" aria-hidden="true" />
            <span className="offer-confetti offer-confetti-three" aria-hidden="true" />
            <span className="offer-confetti offer-confetti-four" aria-hidden="true" />
            <span className="offer-confetti offer-confetti-five" aria-hidden="true" />
            <div className="first-order-offer-copy">
              <span className="offer-gift-art" aria-hidden="true">
                <Gift className="offer-gift-icon" size={34} strokeWidth={1.8} />
                <span className="offer-sparkle offer-sparkle-one">✦</span>
                <span className="offer-sparkle offer-sparkle-two">✧</span>
                <span className="offer-sparkle offer-sparkle-three">✦</span>
              </span>
              <div className="first-order-offer-text">
                <h4 className="first-order-offer-title">
                  Get your first order with free gift & 50% offer 🌟
                </h4>
                <p className="first-order-offer-description">
                  Use exclusive promo code <code className="first-order-offer-code">STEPUP50</code> at checkout!
                </p>
              </div>
            </div>

            <button
              type="button"
              className="first-order-offer-button"
              onClick={handleClaimOffer}
            >
              {couponCopied ? <Check size={16} color="#FFA0A0" /> : <Gift size={16} />}
              <span>{couponCopied ? 'Coupon Applied!' : 'Claim 50% Offer'}</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
