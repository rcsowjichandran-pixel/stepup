import React, { useState, useEffect } from 'react';
import { Filter, Star, ShoppingBag, Check, X, ArrowLeft, SlidersHorizontal } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import './ShopPage.css';

export default function ShopPage({ initialCategory, initialSubcategory, initialBrand, initialSearch, setCurrentPage, onSelectProduct }) {
  const { addToCart, setIsCartOpen } = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'all');
  const [selectedBrand, setSelectedBrand] = useState(initialBrand || 'all');
  const [sortBy, setSortBy] = useState('popular');
  const [priceMax, setPriceMax] = useState(10000);
  const [search, setSearch] = useState(initialSearch || '');

  useEffect(() => {
    if (initialCategory) setSelectedCategory(initialCategory);
    if (initialBrand) setSelectedBrand(initialBrand);
    if (initialSearch) setSearch(initialSearch);
  }, [initialCategory, initialBrand, initialSearch]);

  useEffect(() => {
    api.getCategories().then(setCategories).catch(console.error);
    api.getBrands().then(setBrands).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {
      ordering: sortBy,
      search: search || undefined
    };
    if (selectedCategory && selectedCategory !== 'all') {
      if (selectedCategory === 'offers') {
        params.offers = true;
      } else {
        params.category = selectedCategory;
      }
    }
    if (selectedBrand && selectedBrand !== 'all') {
      params.brand = selectedBrand;
    }

    api.getProducts(params)
      .then(data => {
        // filter by price
        const filtered = data.filter(p => Number(p.price) <= priceMax);
        setProducts(filtered);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedCategory, selectedBrand, sortBy, priceMax, search]);

  return (
    <div className="shop-page" style={{ padding: '24px 0 60px 0' }}>
      <div className="container">
        
        {/* Breadcrumb Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
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
              fontFamily: 'Inter, sans-serif'
            }}
          >
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </button>

          <div style={{ fontSize: '13px', color: '#666666' }}>
            Showing <b>{products.length}</b> shoes
          </div>
        </div>

        {/* Page Title */}
        <h2 style={{
          fontFamily: "'Libre Baskerville', Georgia, serif",
          fontSize: '26px',
          fontWeight: 700,
          color: '#1C2E2E',
          marginBottom: '24px'
        }}>
          {selectedCategory === 'all' ? 'All Footwear Collection' :
           selectedCategory === 'women' ? "Women's Footwear" :
           selectedCategory === 'men' ? "Men's Footwear" :
           selectedCategory === 'kids' ? "Kids Footwear" :
           selectedCategory === 'offers' ? "Special Offers & Deals" :
           selectedCategory.toUpperCase()}
        </h2>

        {/* Shop Layout: Sidebar Filters + Products Grid */}
        <div className="shop-layout" style={{ display: 'grid', gridTemplateColumns: '240px minmax(0, 1fr)', gap: '30px', alignItems: 'start' }}>
          
          {/* SIDEBAR FILTERS */}
          <aside style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px', paddingBottom: '12px', borderBottom: '1px solid #E2E8F0' }}>
              <SlidersHorizontal size={16} color="#2F4F4F" />
              <h4 style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: '15px', color: '#2F4F4F' }}>
                Filter Catalog
              </h4>
            </div>

            {/* Category Filter */}
            <div style={{ marginBottom: '22px' }}>
              <h5 style={{ fontSize: '13px', fontWeight: 700, color: '#333333', marginBottom: '10px' }}>
                Category
              </h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {['all', 'women', 'men', 'kids', 'offers'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      textAlign: 'left',
                      padding: '6px 10px',
                      borderRadius: '4px',
                      border: 'none',
                      backgroundColor: selectedCategory === cat ? '#EDF3F3' : 'transparent',
                      color: selectedCategory === cat ? '#2F4F4F' : '#555555',
                      fontWeight: selectedCategory === cat ? 700 : 400,
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontFamily: 'Inter, sans-serif',
                      textTransform: 'capitalize'
                    }}
                  >
                    {cat === 'all' ? 'All Shoes' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            <div style={{ marginBottom: '22px' }}>
              <h5 style={{ fontSize: '13px', fontWeight: 700, color: '#333333', marginBottom: '10px' }}>
                Brand
              </h5>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '4px',
                  border: '1px solid #CBD5E1',
                  fontSize: '13px',
                  outline: 'none',
                  backgroundColor: '#FFFFFF',
                  color: '#333333'
                }}
              >
                <option value="all">All Brands</option>
                {brands.map(b => (
                  <option key={b.id} value={b.slug}>{b.name}</option>
                ))}
              </select>
            </div>

            {/* Max Price Range Filter */}
            <div style={{ marginBottom: '22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 700, color: '#333333', marginBottom: '8px' }}>
                <span>Max Price:</span>
                <span style={{ color: '#2F4F4F' }}>₹{priceMax}</span>
              </div>
              <input 
                type="range"
                min="800"
                max="10000"
                step="100"
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#2F4F4F' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#888888', marginTop: '4px' }}>
                <span>₹800</span>
                <span>₹10,000</span>
              </div>
            </div>

            {/* Reset Filters */}
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedBrand('all');
                setPriceMax(10000);
                setSearch('');
              }}
              style={{
                width: '100%',
                padding: '8px',
                backgroundColor: 'transparent',
                border: '1px solid #CBD5E1',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 600,
                color: '#666666',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
            >
              Reset Filters
            </button>
          </aside>

          {/* PRODUCTS MAIN AREA */}
          <div>
            
            {/* Top Sort & Filter Bar */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#F8FAF9',
              padding: '12px 18px',
              borderRadius: '8px',
              marginBottom: '20px',
              border: '1px solid #E2E8F0'
            }}>
              <div style={{ fontSize: '13px', color: '#555555' }}>
                {search && <span>Search: <b>"{search}"</b></span>}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                <span style={{ color: '#666666' }}>Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '4px',
                    border: '1px solid #CBD5E1',
                    fontSize: '13px',
                    outline: 'none',
                    backgroundColor: '#FFFFFF',
                    color: '#333333'
                  }}
                >
                  <option value="popular">Most Popular</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: '#888888', fontSize: '15px' }}>
                Loading shoes...
              </div>
            ) : products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0', backgroundColor: '#F8FAF9', borderRadius: '8px' }}>
                <p style={{ fontSize: '16px', color: '#555555', marginBottom: '12px' }}>
                  No footwear found matching the selected filters.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedBrand('all');
                    setPriceMax(10000);
                  }}
                  className="btn btn-primary"
                >
                  Show All Footwear
                </button>
              </div>
            ) : (
              <div className="shop-products-grid">
                {products.map(prod => (
                  <div 
                    key={prod.id} 
                    className="product-card"
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '8px',
                      border: '1px solid #EAEAEA',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                      transition: 'all 0.25s ease'
                    }}
                  >
                    {/* Product Image */}
                    <div 
                      onClick={() => onSelectProduct && onSelectProduct(prod)}
                      style={{
                        width: '100%',
                        height: '160px',
                        backgroundColor: '#F8F9FA',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        overflow: 'hidden',
                        padding: '12px'
                      }}
                    >
                      <img 
                        src={prod.image} 
                        alt={prod.name}
                        style={{
                          maxHeight: '100%',
                          maxWidth: '100%',
                          objectFit: 'contain',
                          transition: 'transform 0.3s ease'
                        }}
                      />
                    </div>

                    {/* Details */}
                    <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                      <div>
                        <h5 
                          onClick={() => onSelectProduct && onSelectProduct(prod)}
                          style={{
                            fontFamily: "'Libre Baskerville', Georgia, serif",
                            fontSize: '12px',
                            fontWeight: 700,
                            color: '#1C2E2E',
                            marginBottom: '4px',
                            cursor: 'pointer',
                            lineHeight: 1.35,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            height: '32px'
                          }}
                          title={prod.name}
                        >
                          {prod.name}
                        </h5>

                        <div
                          aria-label={`Rated ${prod.rating} out of 5`}
                          style={{ display: 'flex', alignItems: 'center', gap: '1px', marginBottom: '6px' }}
                        >
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={12}
                              fill={star <= Math.round(Number(prod.rating)) ? '#FFB800' : 'none'}
                              color="#FFB800"
                            />
                          ))}
                        </div>
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '4px' }}>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: '#2F4F4F' }}>
                            MRP: ₹{Number(prod.price).toLocaleString()}
                          </span>
                          {prod.original_price && Number(prod.original_price) > Number(prod.price) && (
                            <span style={{ fontSize: '10px', color: '#999999', textDecoration: 'line-through' }}>
                              ₹{Number(prod.original_price).toLocaleString()}
                            </span>
                          )}
                        </div>

                        <div className="shop-product-colors">
                          <span>Color</span>
                          {prod.colors?.slice(0, 3).map((color) => (
                            <span
                              key={color}
                              className="shop-product-color"
                              title={color}
                              aria-label={color}
                              style={{ backgroundColor: getColorValue(color) }}
                            />
                          ))}
                        </div>

                        <div className="shop-product-actions">
                          <button
                            type="button"
                            className="shop-buy-button"
                            onClick={() => {
                              addToCart(prod);
                              setIsCartOpen(false);
                              setCurrentPage('cart');
                            }}
                          >
                            Buy
                          </button>
                          <button
                            type="button"
                            className="shop-add-button"
                            onClick={() => addToCart(prod)}
                          >
                            <ShoppingBag size={12} />
                            <span>Add to Cart</span>
                          </button>
                        </div>
                      </div>

                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}

function getColorValue(colorName) {
  const name = colorName.toLowerCase();
  if (name.includes('white') || name.includes('cream')) return '#F5F5F2';
  if (name.includes('black')) return '#252525';
  if (name.includes('navy') || name.includes('blue')) return '#284B78';
  if (name.includes('pink') || name.includes('rose')) return '#E993A5';
  if (name.includes('purple') || name.includes('lilac')) return '#8A70B0';
  if (name.includes('silver') || name.includes('grey')) return '#AEB3B8';
  if (name.includes('gold') || name.includes('tan') || name.includes('beige')) return '#B78A5A';
  if (name.includes('red')) return '#C73C43';
  return '#6F816D';
}
