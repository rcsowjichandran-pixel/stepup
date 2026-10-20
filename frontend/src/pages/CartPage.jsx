import React, { useState } from 'react';
import { ArrowLeft, Trash2, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './CartPage.css';

export default function CartPage({ setCurrentPage, onProceedToCheckout }) {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    subtotal, 
    discountAmount, 
    grandTotal, 
    coupon, 
    applyCoupon, 
    removeCoupon,
    addToCart
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [couponMsg, setCouponMsg] = useState(null);

  // If cart is empty, provide a quick demo item button to preview the exact Figma design
  const addDemoCartItem = () => {
    addToCart({
      id: 99,
      name: "Comfy Steps",
      category_name: "Men",
      price: 1750,
      original_price: 2499,
      image: "/images/cart_shoe_comfy.png"
    }, '8', 'Classic Tan');
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const res = applyCoupon(couponCode);
    setCouponMsg(res);
  };

  return (
    <div className="cart-page" style={{ padding: '18px 0 48px 0', minHeight: '65vh' }}>
      <div className="container cart-page-container" style={{ maxWidth: '700px' }}>
        
        {/* Breadcrumb Back Link */}
        <button
          onClick={() => setCurrentPage('home')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'none',
            border: 'none',
            color: '#2F4F4F',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            padding: 0,
            marginBottom: '12px',
            fontFamily: 'Inter, sans-serif'
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Shopping</span>
        </button>

        {/* Page Title: "Your Cart" in Libre Baskerville */}
        <h2 style={{
          fontFamily: "'Libre Baskerville', Georgia, serif",
          fontSize: '24px',
          fontWeight: 700,
          color: '#1C2E2E',
          textAlign: 'center',
          marginBottom: '18px'
        }}>
          Your Cart
        </h2>

        {/* Promo Bar (matching Figma Mockup) */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #9AAFAF',
          borderRadius: '10px',
          padding: '9px 14px',
          textAlign: 'center',
          fontSize: '12px',
          color: '#2F4F4F',
          fontWeight: 500,
          marginBottom: '20px',
          boxShadow: '0 2px 5px rgba(47, 79, 79, 0.12)'
        }}>
          <strong>Free &amp; Fast delivery</strong> on orders above ₹999
        </div>

        {/* Cart Content */}
        {cartItems.length === 0 ? (
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            padding: '48px 24px',
            textAlign: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
          }}>
            <div style={{ fontSize: '42px', marginBottom: '12px' }}>🛍️</div>
            <h3 style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: '20px', color: '#2F4F4F', marginBottom: '8px' }}>
              Your cart is currently empty
            </h3>
            <p style={{ fontSize: '13px', color: '#666666', marginBottom: '24px' }}>
              Explore our curated selection of high-quality shoes and add your favorite pairs.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setCurrentPage('shop')}
                className="btn btn-primary"
                style={{ padding: '10px 24px' }}
              >
                Browse Shoe Catalog
              </button>
              <button
                onClick={addDemoCartItem}
                style={{
                  backgroundColor: '#EDF3F3',
                  color: '#2F4F4F',
                  border: '1px solid #2F4F4F',
                  borderRadius: '4px',
                  padding: '10px 18px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Load Figma Sample Shoe (Comfy Steps)
              </button>
            </div>
          </div>
        ) : (
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            padding: '0',
            boxShadow: 'none'
          }}>
            
            {/* List of Cart Items */}
            <div className="cart-items-list" style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '18px' }}>
              {cartItems.map(item => (
                <div
                  key={`${item.id}-${item.size}-${item.color}`}
                  className="cart-item-row"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '92px minmax(0, 1fr) auto',
                    gap: '14px',
                    alignItems: 'center',
                    paddingBottom: '14px',
                    borderBottom: '1px solid #B8C2C2'
                  }}
                >
                  {/* Shoe Thumbnail */}
                  <div className="cart-item-image" style={{
                    width: '92px',
                    height: '92px',
                    backgroundColor: '#F8F9FA',
                    borderRadius: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                  }}>
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      onError={(e) => { e.target.src = '/images/cart_shoe_comfy.png'; }}
                    />
                  </div>

                  {/* Shoe Details & Dropdowns */}
                  <div className="cart-item-details">
                    <h4 style={{
                      fontFamily: "'Libre Baskerville', Georgia, serif",
                      fontSize: '16px',
                      fontWeight: 700,
                      color: '#1C2E2E',
                      marginBottom: '4px'
                    }}>
                      {item.name}
                    </h4>
                    <div style={{ fontSize: '12px', color: '#666666', marginBottom: '8px' }}>
                      {item.category || 'StepUp'} footwear · {item.color || 'Everyday comfort'}
                    </div>

                    <div className="cart-item-controls" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      {/* Size Selector */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#555555' }}>
                        <span className="cart-control-label">Size:</span>
                        <select 
                          value={item.size}
                          onChange={(e) => updateQuantity(item.id, e.target.value, item.color, item.quantity)}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            border: '1px solid #CBD5E1',
                            fontSize: '12px',
                            backgroundColor: '#FFFFFF',
                            outline: 'none'
                          }}
                        >
                          {['6', '7', '8', '9', '10', '11'].map(sz => (
                            <option key={sz} value={sz}>UK {sz}</option>
                          ))}
                        </select>
                      </div>

                      {/* Quantity Selector */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#555555' }}>
                        <span className="cart-control-label">Quantity:</span>
                        <select 
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, item.size, item.color, Number(e.target.value))}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            border: '1px solid #CBD5E1',
                            fontSize: '12px',
                            backgroundColor: '#FFFFFF',
                            outline: 'none'
                          }}
                        >
                          {[1, 2, 3, 4, 5, 6].map(q => (
                            <option key={q} value={q}>{q}</option>
                          ))}
                        </select>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id, item.size, item.color)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#C62828',
                          cursor: 'pointer',
                          fontSize: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: 0,
                          marginLeft: '6px'
                        }}
                      >
                        <Trash2 size={13} />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>

                  {/* Item Price */}
                  <div className="cart-item-price" style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#2F4F4F' }}>
                      MRP: ₹{(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>

                </div>
              ))}
            </div>

            {/* Coupon Code Input */}
            <div style={{
              backgroundColor: '#F8FAF9',
              borderRadius: '8px',
              padding: '14px 18px',
              marginBottom: '24px',
              border: '1px solid #E2E8F0'
            }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#2F4F4F', marginBottom: '8px' }}>
                Have a Promo Code or Gift Voucher?
              </div>
              {coupon ? (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#E8F5E9', padding: '8px 12px', borderRadius: '4px', fontSize: '12px', color: '#2E7D32' }}>
                  <span>✓ <b>{coupon.code}</b> active: {coupon.discountPercent}% Off applied!</span>
                  <button onClick={removeCoupon} style={{ background: 'none', border: 'none', color: '#C62828', fontWeight: 700, cursor: 'pointer' }}>
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    type="text"
                    placeholder="Enter code (e.g. STEPUP50)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: '4px',
                      border: '1px solid #CBD5E1',
                      fontSize: '13px',
                      textTransform: 'uppercase',
                      outline: 'none'
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      backgroundColor: '#2F4F4F',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '8px 18px',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Apply Coupon
                  </button>
                </form>
              )}
              {couponMsg && !coupon && (
                <div style={{ fontSize: '12px', color: couponMsg.success ? '#2E7D32' : '#C62828', marginTop: '6px' }}>
                  {couponMsg.message}
                </div>
              )}
            </div>

            {/* Summary Box */}
            <div className="cart-summary" style={{ borderTop: '1px solid #B8C2C2', paddingTop: '8px', marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#555555', marginBottom: '6px' }}>
                <span>Summary</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#2E7D32', fontWeight: 600, marginBottom: '6px' }}>
                  <span>Discount ({coupon?.code}):</span>
                  <span>-₹{discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#555555', marginBottom: '6px' }}>
                <span>Delivery:</span>
                <span style={{ color: '#2E7D32', fontWeight: 600 }}>Free</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: 700, color: '#2F4F4F', borderTop: '1px solid #CBD5E1', paddingTop: '8px' }}>
                <span>Total:</span>
                <span>₹{grandTotal.toLocaleString()}</span>
              </div>
              <div style={{ fontSize: '11px', color: '#668080', marginTop: '2px', textAlign: 'right' }}>
                Delivery &amp; returns information
              </div>
            </div>

            {/* Main "Checkout Securely" Button in #2F4F4F */}
            <button
              onClick={() => onProceedToCheckout?.('Cash on Delivery')}
              style={{
                width: '100%',
                maxWidth: '360px',
                backgroundColor: '#2F4F4F',
                color: '#FFFFFF',
                border: 'none',
                padding: '14px',
                borderRadius: '6px',
                fontSize: '15px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontFamily: 'Inter, sans-serif',
                boxShadow: '0 4px 12px rgba(47, 79, 79, 0.25)',
                transition: 'background 0.2s',
                margin: '0 auto 12px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1E3333'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2F4F4F'}
            >
              <Lock size={16} color="#FFA0A0" />
              <span>Checkout Securely</span>
            </button>
            <div style={{
              maxWidth: '360px',
              margin: '-4px auto 12px',
              textAlign: 'center',
              fontSize: '11px',
              color: '#668080',
            }}>
              Cash on Delivery available
            </div>

            {/* Express payment choices open checkout with the selected method. */}
            <div style={{
              maxWidth: '360px',
              margin: '0 auto 8px',
              fontSize: '13px',
              fontWeight: 600,
              color: '#2F4F4F',
            }}>
              Express Checkout
            </div>
            <div className="cart-payment-options" style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              maxWidth: '360px',
              margin: '0 auto'
            }}>
              <button 
                onClick={() => onProceedToCheckout?.('UPI')}
                style={{
                  width: '100%',
                  padding: '6px 10px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#333333',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <img src="/images/payment-upi.svg" alt="UPI" style={{ width: '42px', height: '22px' }} />
                <span>UPI</span>
              </button>

              <button
                onClick={() => onProceedToCheckout?.('Google Pay')}
                style={{
                  width: '100%',
                  padding: '6px 10px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#333333',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <img src="/images/payment-gpay.svg" alt="Google Pay" style={{ width: '58px', height: '24px' }} />
                <span>Google Pay</span>
              </button>

              <button 
                onClick={() => onProceedToCheckout?.('PayPal')}
                style={{
                  width: '100%',
                  padding: '6px 10px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#003087',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <b><i>PayPal</i></b>
              </button>

              <button 
                onClick={() => onProceedToCheckout?.('Clearpay')}
                style={{
                  width: '100%',
                  padding: '6px 10px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#111111',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <b>clearpay</b>
              </button>

              <button 
                onClick={() => onProceedToCheckout?.('Klarna')}
                style={{
                  width: '100%',
                  padding: '6px 10px',
                  border: '1px solid #CBD5E1',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#171142',
                  backgroundColor: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <b>Klarna</b>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
