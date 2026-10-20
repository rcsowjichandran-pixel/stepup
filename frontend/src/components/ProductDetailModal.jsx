import React, { useState } from 'react';
import { X, Star, ShoppingBag, ShieldCheck, RotateCcw, Truck, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductDetailModal({ product, onClose }) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '7');
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || 'Default');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product, selectedSize, selectedColor);
    }
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 900);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 250,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        maxWidth: '840px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
        position: 'relative',
        animation: 'fadeIn 0.25s ease'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: '#F1F5F5',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
            color: '#555555'
          }}
        >
          <X size={18} />
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: '32px', padding: '32px' }}>
          
          {/* Left: Product Image */}
          <div style={{
            backgroundColor: '#F8FAF9',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            border: '1px solid #E2E8F0',
            position: 'relative'
          }}>
            <img 
              src={product.image} 
              alt={product.name}
              style={{
                maxWidth: '100%',
                maxHeight: '320px',
                objectFit: 'contain'
              }}
            />
            {product.discount_percentage > 0 && (
              <div style={{
                position: 'absolute',
                top: '14px',
                left: '14px',
                backgroundColor: '#FFA0A0',
                color: '#2F4F4F',
                fontSize: '12px',
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: '4px'
              }}>
                {product.discount_percentage}% OFF
              </div>
            )}
          </div>

          {/* Right: Product Details & Selectors */}
          <div>
            <div style={{ fontSize: '12px', color: '#888888', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
              {product.brand_name || 'StepUp Originals'} • {product.category_name}
            </div>

            <h3 style={{
              fontFamily: "'Libre Baskerville', Georgia, serif",
              fontSize: '20px',
              fontWeight: 700,
              color: '#1C2E2E',
              marginBottom: '10px',
              lineHeight: 1.3
            }}>
              {product.name}
            </h3>

            {/* Ratings */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
              <div style={{ display: 'flex', color: '#FFB800' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="#FFB800" strokeWidth={0} />
                ))}
              </div>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#333333' }}>{product.rating}</span>
              <span style={{ fontSize: '12px', color: '#888888' }}>({product.reviews_count} verified reviews)</span>
            </div>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '16px' }}>
              <span style={{ fontSize: '22px', fontWeight: 700, color: '#2F4F4F' }}>
                MRP: ₹{Number(product.price).toLocaleString()}
              </span>
              {product.original_price && Number(product.original_price) > Number(product.price) && (
                <span style={{ fontSize: '14px', color: '#888888', textDecoration: 'line-through' }}>
                  ₹{Number(product.original_price).toLocaleString()}
                </span>
              )}
            </div>

            <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#555555', marginBottom: '20px' }}>
              {product.description || 'Engineered with high performance sole materials and ergonomic memory foam cushions for supreme daily durability.'}
            </p>

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div style={{ marginBottom: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>
                  <span>Select Size (UK/India):</span>
                  <span style={{ color: '#2F4F4F' }}>UK {selectedSize}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '4px',
                        border: selectedSize === size ? '2px solid #2F4F4F' : '1px solid #CBD5E1',
                        backgroundColor: selectedSize === size ? '#EDF3F3' : '#FFFFFF',
                        color: selectedSize === size ? '#2F4F4F' : '#444444',
                        fontWeight: 700,
                        fontSize: '13px',
                        cursor: 'pointer'
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selector */}
            {product.colors && product.colors.length > 0 && (
              <div style={{ marginBottom: '22px' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>
                  Select Color: <span style={{ color: '#2F4F4F', fontWeight: 700 }}>{selectedColor}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {product.colors.map(col => (
                    <button
                      key={col}
                      onClick={() => setSelectedColor(col)}
                      style={{
                        padding: '5px 12px',
                        borderRadius: '14px',
                        border: selectedColor === col ? '1.5px solid #2F4F4F' : '1px solid #CBD5E1',
                        backgroundColor: selectedColor === col ? '#FFA0A0' : '#FFFFFF',
                        color: selectedColor === col ? '#2F4F4F' : '#555555',
                        fontWeight: selectedColor === col ? 700 : 500,
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      {col}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Add to Cart Action */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #CBD5E1', borderRadius: '4px', overflow: 'hidden' }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ padding: '8px 12px', background: '#F8FAF9', border: 'none', cursor: 'pointer', fontWeight: 700 }}
                >
                  -
                </button>
                <span style={{ padding: '8px 14px', fontSize: '14px', fontWeight: 600 }}>{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  style={{ padding: '8px 12px', background: '#F8FAF9', border: 'none', cursor: 'pointer', fontWeight: 700 }}
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                style={{
                  flex: 1,
                  backgroundColor: added ? '#38A169' : '#2F4F4F',
                  color: '#FFFFFF',
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
                  transition: 'background 0.2s'
                }}
              >
                {added ? <Check size={16} /> : <ShoppingBag size={16} />}
                <span>{added ? 'Added to Cart!' : 'Add to Cart'}</span>
              </button>
            </div>

            {/* Badges / Guarantees */}
            <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', fontSize: '11px', color: '#666666' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Truck size={14} color="#2F4F4F" />
                <span>Free Delivery</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <RotateCcw size={14} color="#2F4F4F" />
                <span>30-Day Returns</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={14} color="#2F4F4F" />
                <span>100% Genuine</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
