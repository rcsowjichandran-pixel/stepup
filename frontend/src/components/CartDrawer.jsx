import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, Check, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartDrawer({ onCheckoutClick }) {
  const { 
    cartItems, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    updateQuantity, 
    subtotal, 
    discountAmount, 
    grandTotal,
    coupon,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState(null);

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponFeedback(res);
    if (res.success) setCouponInput('');
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.5)',
      backdropFilter: 'blur(3px)',
      zIndex: 300,
      display: 'flex',
      justifyContent: 'flex-end',
      animation: 'fadeIn 0.2s ease'
    }}>
      
      {/* Drawer Container */}
      <div style={{
        width: '100%',
        maxWidth: '420px',
        height: '100%',
        backgroundColor: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-8px 0 24px rgba(0,0,0,0.15)',
        animation: 'slideInRight 0.3s ease'
      }}>
        
        {/* Drawer Header */}
        <div style={{
          padding: '18px 20px',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#2F4F4F',
          color: '#FFFFFF'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={18} color="#FFA0A0" />
            <h3 style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: '17px', margin: 0, color: '#FFFFFF' }}>
              Your Shopping Cart ({cartItems.length})
            </h3>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart"
            style={{
              background: 'none',
              border: 'none',
              color: '#FFFFFF',
              cursor: 'pointer',
              padding: 0,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart Items List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#888888' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>🛍️</div>
              <h4 style={{ fontFamily: "'Libre Baskerville', Georgia, serif", color: '#2F4F4F', marginBottom: '8px' }}>Your cart is empty</h4>
              <p style={{ fontSize: '13px', marginBottom: '20px' }}>Discover high performance footwear and add your favorite shoes!</p>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="btn btn-primary"
                style={{ fontSize: '13px' }}
              >
                Browse Shoe Collection
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {cartItems.map((item, idx) => (
                <div 
                  key={`${item.id}-${item.size}-${item.color}`}
                  style={{
                    display: 'flex',
                    gap: '14px',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #EAEAEA',
                    backgroundColor: '#FAFCFC'
                  }}
                >
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    style={{ width: '64px', height: '64px', objectFit: 'contain', backgroundColor: '#FFFFFF', borderRadius: '4px', padding: '4px' }}
                  />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h5 style={{
                      fontFamily: "'Libre Baskerville', Georgia, serif",
                      fontSize: '13px',
                      color: '#1C2E2E',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      marginBottom: '4px'
                    }}>
                      {item.name}
                    </h5>

                    <div style={{ fontSize: '11px', color: '#666666', marginBottom: '8px' }}>
                      Size: <b>UK {item.size}</b> • Color: <b>{item.color}</b>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: '#2F4F4F' }}>
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </span>

                      {/* Quantity Controls */}
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #CBD5E1', borderRadius: '4px', overflow: 'hidden' }}>
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)}
                          style={{ padding: '2px 8px', background: '#FFFFFF', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 700 }}
                        >
                          -
                        </button>
                        <span style={{ padding: '2px 8px', fontSize: '12px', fontWeight: 600 }}>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}
                          style={{ padding: '2px 8px', background: '#FFFFFF', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 700 }}
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id, item.size, item.color)}
                        style={{ background: 'none', border: 'none', color: '#E85D5D', cursor: 'pointer', padding: 0 }}
                        title="Remove item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer & Checkout */}
        {cartItems.length > 0 && (
          <div style={{ padding: '16px 20px', borderTop: '1px solid #E2E8F0', backgroundColor: '#F8FAF9' }}>
            
            {/* Coupon Code Section */}
            <div style={{ marginBottom: '14px' }}>
              {coupon ? (
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: '#E8F5E9',
                  border: '1px solid #A5D6A7',
                  padding: '6px 10px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  color: '#2E7D32'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sparkles size={14} />
                    <span><b>{coupon.code}</b> applied ({coupon.discountPercent}% Off)</span>
                  </div>
                  <button onClick={removeCoupon} style={{ background: 'none', border: 'none', color: '#D32F2F', cursor: 'pointer', fontSize: '11px', fontWeight: 700 }}>
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '6px' }}>
                  <input 
                    type="text"
                    placeholder="Coupon (e.g. STEPUP50)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '7px 10px',
                      fontSize: '12px',
                      borderRadius: '4px',
                      border: '1px solid #CBD5E1',
                      outline: 'none',
                      textTransform: 'uppercase'
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      backgroundColor: '#2F4F4F',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '7px 14px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponFeedback && !coupon && (
                <div style={{ fontSize: '11px', color: couponFeedback.success ? '#2E7D32' : '#C62828', marginTop: '4px' }}>
                  {couponFeedback.message}
                </div>
              )}
            </div>

            {/* Price Calculations */}
            <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#555555' }}>
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#2E7D32', fontWeight: 600 }}>
                  <span>Discount ({coupon?.code})</span>
                  <span>-₹{discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#555555' }}>
                <span>Delivery Charges</span>
                <span style={{ color: '#2E7D32', fontWeight: 600 }}>FREE</span>
              </div>
              <div style={{ height: '1px', backgroundColor: '#CBD5E1', margin: '4px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 700, color: '#2F4F4F' }}>
                <span>Total Amount</span>
                <span>₹{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => {
                setIsCartOpen(false);
                if (onCheckoutClick) onCheckoutClick();
              }}
              style={{
                width: '100%',
                backgroundColor: '#FFA0A0',
                color: '#2F4F4F',
                border: 'none',
                padding: '12px',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontFamily: 'Inter, sans-serif',
                transition: 'background 0.2s',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#E88383';
                e.currentTarget.style.color = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FFA0A0';
                e.currentTarget.style.color = '#2F4F4F';
              }}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={16} />
            </button>

          </div>
        )}

      </div>
    </div>
  );
}
