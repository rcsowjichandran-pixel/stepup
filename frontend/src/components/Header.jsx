import React, { useState, useEffect, useRef } from 'react';
import { Search, ShoppingCart, LogOut, ChevronDown, ArrowRight, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import './Header.css';

const groupBrandsByLetter = (brands) => {
  const groups = [];
  brands.forEach((brand) => {
    const letter = brand.name.charAt(0).toUpperCase();
    let group = groups.find((entry) => entry.letter === letter);
    if (!group) {
      group = { letter, brands: [] };
      groups.push(group);
    }
    group.brands.push(brand);
  });
  return groups;
};

export default function Header({ currentPage, setCurrentPage, onSelectCategory }) {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [brandMenuData, setBrandMenuData] = useState(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const searchTimeoutRef = useRef(null);

  // Search autocomplete
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        setIsSearching(true);
        const data = await api.getProducts({ search: searchQuery.trim() });
        setSearchResults(data.slice(0, 5));
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [searchQuery]);

  useEffect(() => {
    if (activeDropdown !== 'brands' || brandMenuData) return;

    Promise.all([api.getBrands(), api.getProducts({ ordering: 'name' })])
      .then(([brands, products]) => {
        setBrandMenuData({
          brands: [...brands].sort((first, second) => first.name.localeCompare(second.name)),
          products: products.slice(0, 4),
        });
      })
      .catch((error) => {
        console.error('Error loading brand menu:', error);
      });
  }, [activeDropdown, brandMenuData]);

  const navCategories = [
    {
      id: 'women',
      name: 'Womens',
      bannerText: "Women's Glamour & Comfort Collection",
      columns: [
        {
          title: "Footwear Categories",
          items: [
            { name: "Glamour Heels", sub: "heels" },
            { name: "Slip-On Walking Shoes", sub: "slip-ons" },
            { name: "Casual Sneakers", sub: "casuals" },
            { name: "Flats & Bellies", sub: "flats" },
            { name: "Ethnic Mojaris & Juttis", sub: "ethnic" }
          ]
        },
        {
          title: "Trending Styles",
          items: [
            { name: "Ophelia Silver Stiletto", sub: "heels" },
            { name: "Millie Block Metallic Heel", sub: "heels" },
            { name: "UPN Blush Cloud Knit", sub: "slip-ons" },
            { name: "UPN Navy Comfort Slip-on", sub: "slip-ons" }
          ]
        },
        {
          title: "Special Collections",
          items: [
            { name: "Bridal & Wedding Footwear", sub: "heels" },
            { name: "Orthopedic Daily Cushions", sub: "slip-ons" },
            { name: "Workplace & Office Wear", sub: "heels" },
            { name: "New Arrivals 2026", sub: "all" }
          ]
        }
      ],
      promo: {
        title: "Spring Glamour Heels",
        desc: "Up to 50% Off On Silver & Metallic Party Heels",
        image: "/images/product_ophelia_silver.png"
      }
    },
    {
      id: 'men',
      name: 'Mens',
      bannerText: "Handcrafted Men's Formal & Athletic Collection",
      columns: [
        {
          title: "Popular Categories",
          items: [
            { name: "Office Formal Shoes", sub: "formal-shoes" },
            { name: "Lace-Up Sneakers", sub: "lace-up-sneakers" },
            { name: "Loafers & Slip-Ons", sub: "loafers" },
            { name: "Sports & Marathon Running", sub: "sports-running" },
            { name: "Genuine Leather Boots", sub: "formal-shoes" }
          ]
        },
        {
          title: "Featured Men's Footwear",
          items: [
            { name: "Men High Heel Office Loafer", sub: "formal-shoes" },
            { name: "Power White Street Sneaker", sub: "lace-up-sneakers" },
            { name: "Men Navy Dynamic Lace-Up", sub: "lace-up-sneakers" },
            { name: "AeroStep Cloud Runner", sub: "sports-running" }
          ]
        },
        {
          title: "Shop By Occasion",
          items: [
            { name: "Executive & Formal Events", sub: "formal-shoes" },
            { name: "Gym, Running & Training", sub: "sports-running" },
            { name: "Weekend Street Casuals", sub: "lace-up-sneakers" },
            { name: "Outdoor & Trekking", sub: "sports-running" }
          ]
        }
      ],
      promo: {
        title: "Executive Office Footwear",
        desc: "Burnished Italian Leather with 40% Today Only",
        image: "/images/hero_office_shoe.png"
      }
    },
    {
      id: 'kids',
      name: 'Kids',
      bannerText: "Playful, Supportive & Durable Footwear for Children",
      columns: [
        {
          title: "By Age & Gender",
          items: [
            { name: "Boys Sneakers & Trainers", sub: "boys-footwear" },
            { name: "Girls Daisy & Glitter Sandals", sub: "girls-footwear" },
            { name: "School & Uniform Footwear", sub: "boys-footwear" },
            { name: "Toddler Soft Soles (1-4 yrs)", sub: "kids-sandals" },
            { name: "Active Sports Shoes", sub: "boys-footwear" }
          ]
        },
        {
          title: "Kid Favorites",
          items: [
            { name: "Canny Boys Blue Dinosaur Sneaker", sub: "boys-footwear" },
            { name: "Canny Kids Pink Daisy Sandal", sub: "girls-footwear" },
            { name: "Lightning Speed Velcro Runner", sub: "boys-footwear" },
            { name: "Cloud Foam Soft Walkers", sub: "kids-sandals" }
          ]
        },
        {
          title: "Kids Benefits",
          items: [
            { name: "🎁 Free Surprise Gift with Order", sub: "all" },
            { name: "Non-Marking Anti-Skid Rubber", sub: "all" },
            { name: "Easy Slip-On Dual Velcro", sub: "all" },
            { name: "Reinforced Toe Guard", sub: "all" }
          ]
        }
      ],
      promo: {
        title: "Kids Adventure Line",
        desc: "Dino & Daisy Prints with Free Gift Inside!",
        image: "/images/product_canny_boys_blue.png"
      }
    },
    {
      id: 'brands',
      name: 'Brands',
      bannerText: "Official Footwear Partners & Global Brands",
      columns: [
        {
          title: "Top Footwear Brands",
          items: [
            { name: "StepUp Originals", brand: "stepup-originals" },
            { name: "Nike Sportswear", brand: "nike" },
            { name: "Adidas Originals", brand: "adidas" },
            { name: "Puma Performance", brand: "puma" }
          ]
        },
        {
          title: "Value & Daily Brands",
          items: [
            { name: "Sparx Active Wear", brand: "sparx" },
            { name: "Bata Heritage Collection", brand: "bata" },
            { name: "Campus Running Shoes", brand: "campus" }
          ]
        },
        {
          title: "Brand Guarantees",
          items: [
            { name: "100% Verified Authentic Products", brand: "all" },
            { name: "Brand Warranty Included", brand: "all" },
            { name: "Easy 30-Day Return & Replacement", brand: "all" }
          ]
        }
      ],
      promo: {
        title: "Brand Spotlight",
        desc: "StepUp Originals & Top Brands at Direct Prices",
        image: "/images/product_power_men_white.png"
      }
    },
    {
      id: 'offers',
      name: 'Offers',
      bannerText: "Hot Shoe Deals, Clearance & Festive Discounts",
      columns: [
        {
          title: "Featured Savings",
          items: [
            { name: "🎁 50% Off First Order (Code: STEPUP50)", offer: "first50" },
            { name: "Flat 40% Off Men's Office Shoes", offer: "office40" },
            { name: "Buy 1 Get 1 on Kids Sandals", offer: "bogo" },
            { name: "Clearance Stock Under ₹999", offer: "under999" }
          ]
        },
        {
          title: "Exclusive Bundles",
          items: [
            { name: "His & Hers Festive Footwear Combo", offer: "combo" },
            { name: "Free Care Kit with Leather Shoes", offer: "carekit" },
            { name: "Free Delivery on Orders Above ₹999", offer: "shipping" }
          ]
        },
        {
          title: "Discount Coupons",
          items: [
            { name: "Coupon: STEPUP50 (Flat 50% Off)", offer: "coupon" },
            { name: "Coupon: STEPUP10 (Extra 10% Off)", offer: "coupon" }
          ]
        }
      ],
      promo: {
        title: "First Order 50% Off",
        desc: "Apply coupon STEPUP50 during checkout!",
        image: "/images/product_upn_blush.png"
      }
    }
  ];

  const handleNavClick = (catId, sub = null, brand = null) => {
    setActiveDropdown(null);
    if (onSelectCategory) {
      onSelectCategory(catId, sub, brand);
    }
    setCurrentPage('shop');
  };

  return (
    <header className="site-header" style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: '#FFFFFF' }}>
      
      {/* 1. TOP BAR: Dark Slate Gray (#2F4F4F) matching Figma Asset 5 */}
      <div style={{ backgroundColor: '#2F4F4F', color: '#FFFFFF', padding: '10px 0', minHeight: '60px', display: 'flex', alignItems: 'center' }}>
        <div style={{ width: '100%', maxWidth: '1024px', margin: '0 auto', padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          
          {/* Left: Exact StepUp Logo & Search Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '22px', flex: '1 1 auto' }}>
            
            {/* StepUp Circular Logo with Footprint & StepUp Text */}
            <button 
              onClick={() => {
                onSelectCategory?.('all');
                setCurrentPage('shop');
              }}
              className="header-logo-button"
              title="Browse all footwear categories"
              aria-label="Browse all footwear categories"
            >
              <img 
                src="/logo.jpg"
                alt="StepUp footwear logo"
                className="header-logo-image"
                onError={(event) => {
                  if (event.currentTarget.src.endsWith('/logo.jpg')) {
                    event.currentTarget.src = '/stepup_logo.png';
                  }
                }}
              />
            </button>

            {/* Pill Search Input: "Search here" */}
            <div style={{ position: 'relative', maxWidth: '340px', width: '100%' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                padding: '6px 16px',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.08)'
              }}>
                <Search size={15} color="#777777" style={{ marginRight: '10px', flexShrink: 0 }} />
                <input 
                  type="text" 
                  placeholder="Search here"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    width: '100%',
                    fontSize: '13px',
                    fontFamily: 'Inter, sans-serif',
                    color: '#222222'
                  }}
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                  >
                    <X size={14} color="#888888" />
                  </button>
                )}
              </div>

              {/* Dynamic Live Search Dropdown */}
              {searchQuery.trim().length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '110%',
                  left: 0,
                  width: '100%',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '8px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                  zIndex: 200,
                  overflow: 'hidden',
                  border: '1px solid #E2E8F0',
                  color: '#222222'
                }}>
                  {isSearching ? (
                    <div style={{ padding: '12px 16px', fontSize: '13px', color: '#666666' }}>Searching...</div>
                  ) : searchResults.length > 0 ? (
                    <div>
                      {searchResults.map(prod => (
                        <div 
                          key={prod.id}
                          onClick={() => {
                            setSearchQuery('');
                            if (onSelectCategory) onSelectCategory('all', null, null, prod.id);
                            setCurrentPage('shop');
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '8px 12px',
                            cursor: 'pointer',
                            borderBottom: '1px solid #F1F1F1'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F5F9F9'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                        >
                          <img src={prod.image} alt={prod.name} style={{ width: '36px', height: '36px', objectFit: 'contain', borderRadius: '4px' }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '13px', fontWeight: 600, color: '#1A2E2E' }}>{prod.name}</div>
                            <div style={{ fontSize: '11px', color: '#666666' }}>₹{prod.price}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ padding: '12px 16px', fontSize: '13px', color: '#666666' }}>
                      No shoes found matching "{searchQuery}"
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>

          {/* Right Links (Home, About Us, Contact Us, Log in, Cart) matching Asset 5 */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '22px', fontSize: '13px', fontWeight: 500 }}>
            
            {/* Home Link (Pale Red #FFA0A0 when active as in Figma) */}
            <button 
              onClick={() => setCurrentPage('home')}
              style={{
                background: 'none',
                border: 'none',
                color: currentPage === 'home' ? '#FFA0A0' : '#FFFFFF',
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: '13px',
                padding: 0,
                transition: 'color 0.2s'
              }}
            >
              Home
            </button>

            {/* About Us */}
            <button 
              onClick={() => setCurrentPage('about')}
              style={{
                background: 'none',
                border: 'none',
                color: currentPage === 'about' ? '#FFA0A0' : '#FFFFFF',
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
                fontSize: '13px',
                padding: 0,
                transition: 'color 0.2s'
              }}
            >
              About Us
            </button>

            {/* Contact Us */}
            <button 
              onClick={() => setCurrentPage('contact')}
              style={{
                background: 'none',
                border: 'none',
                color: currentPage === 'contact' ? '#FFA0A0' : '#FFFFFF',
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
                fontSize: '13px',
                padding: 0,
                transition: 'color 0.2s'
              }}
            >
              Contact Us
            </button>

            {/* Log in */}
            {isAuthenticated ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: 'none',
                    border: 'none',
                    color: '#FFA0A0',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 600
                  }}
                >
                  <span>{user.first_name || user.username}</span>
                  <ChevronDown size={13} />
                </button>

                {userDropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    right: 0,
                    top: '120%',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '6px',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                    padding: '8px 0',
                    minWidth: '150px',
                    zIndex: 200,
                    color: '#222222'
                  }}>
                    <div style={{ padding: '6px 14px', fontSize: '11px', color: '#888888', borderBottom: '1px solid #F1F1F1' }}>
                      {user.email}
                    </div>
                    <button
                      onClick={() => { logout(); setUserDropdownOpen(false); }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        width: '100%',
                        padding: '8px 14px',
                        background: 'none',
                        border: 'none',
                        textAlign: 'left',
                        fontSize: '13px',
                        color: '#D9534F',
                        cursor: 'pointer'
                      }}
                    >
                      <LogOut size={14} />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={() => setCurrentPage('auth')}
                style={{
                  background: 'none',
                  color: currentPage === 'auth' ? '#FFA0A0' : '#FFFFFF',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500,
                  fontSize: '13px',
                  padding: 0
                }}
              >
                Log in
              </button>
            )}

            {/* Cart Button with a badge only when the cart has items */}
            <button 
              onClick={() => setCurrentPage('cart')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                background: 'none',
                color: currentPage === 'cart' ? '#FFA0A0' : '#FFFFFF',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
                fontSize: '13px',
                padding: 0,
                position: 'relative'
              }}
              title="View Cart"
            >
              <span>Cart</span>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <ShoppingCart size={17} color={currentPage === 'cart' ? '#FFA0A0' : '#FFFFFF'} />
                {totalItems > 0 && <span style={{
                  position: 'absolute',
                  top: '-7px',
                  right: '-8px',
                  backgroundColor: '#E53E3E',
                  color: '#FFFFFF',
                  borderRadius: '50%',
                  width: '15px',
                  height: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  fontWeight: 700
                }}>
                  {totalItems}
                </span>}
              </div>
            </button>

          </nav>
        </div>
      </div>

      {/* 2. BRAND TITLE: "StepUp.in" in Libre Baskerville */}
      <div style={{ textAlign: 'center', paddingTop: '18px', paddingBottom: '6px' }}>
        <button 
          onClick={() => setCurrentPage('home')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          <h1 style={{
            fontFamily: "'Libre Baskerville', Georgia, serif",
            fontSize: '32px',
            fontWeight: 700,
            letterSpacing: '0.2px',
            color: '#111111',
            margin: 0
          }}>
            StepUp.in
          </h1>
        </button>
      </div>

      {/* Subtle Horizontal Divider below Title (matching Asset 5) */}
      <div style={{ maxWidth: '880px', margin: '8px auto 0 auto', borderBottom: '1px solid #D5D5D5' }} />

      {/* 3. DYNAMIC HOVER NAVBAR: Womens, Mens, Kids, Brands, Offers */}
      <nav style={{ position: 'relative', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1024px', margin: '0 auto', display: 'flex', justifyContent: 'center' }}>
          <div style={{ display: 'flex', gap: '42px', padding: '10px 0' }}>
            {navCategories.map(cat => (
              <div 
                key={cat.id}
                className="nav-item"
                onMouseEnter={() => setActiveDropdown(cat.id)}
                onMouseLeave={() => setActiveDropdown(null)}
                style={{ position: 'relative' }}
              >
                <button
                  onClick={() => handleNavClick(cat.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: 500,
                    fontFamily: 'Inter, sans-serif',
                    color: activeDropdown === cat.id ? '#2F4F4F' : '#111111',
                    cursor: 'pointer',
                    padding: '4px 0',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {cat.name}
                </button>

                {/* DYNAMIC MEGA DROPDOWN MENU ON HOVER */}
                {activeDropdown === cat.id && (
                  <div 
                    style={{
                      position: 'fixed',
                      left: 0,
                      width: '100vw',
                      backgroundColor: '#FFFFFF',
                      boxShadow: '0 16px 32px rgba(47, 79, 79, 0.15)',
                      borderTop: '2px solid #FFA0A0',
                      borderBottom: '1px solid #E2E8F0',
                      zIndex: 99,
                      animation: 'fadeIn 0.2s ease forwards'
                    }}
                    onMouseEnter={() => setActiveDropdown(cat.id)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    {cat.id === 'brands' ? (
                      <div className="brand-mega-menu container">
                        <div className="brand-directory" aria-label="Browse brands alphabetically">
                          {brandMenuData?.brands.length > 0 && groupBrandsByLetter(brandMenuData.brands).map((group) => (
                            <div className="brand-directory-group" key={group.letter}>
                              <span className="brand-directory-letter">{group.letter}</span>
                              {group.brands.map((brand) => (
                                <button
                                  type="button"
                                  className="brand-directory-link"
                                  key={brand.id}
                                  onClick={() => handleNavClick('all', null, brand.slug)}
                                >
                                  {brand.name}
                                </button>
                              ))}
                            </div>
                          ))}
                          {!brandMenuData && <span className="brand-menu-loading">Loading brands...</span>}
                          {brandMenuData?.brands.length === 0 && <span className="brand-menu-loading">No brands available.</span>}
                        </div>

                        <div className="brand-menu-products" aria-label="Featured footwear">
                          {brandMenuData?.products.map((product) => (
                            <button
                              type="button"
                              className="brand-menu-product"
                              key={product.id}
                              onClick={() => handleNavClick('all', null, product.brand_name
                                ? brandMenuData.brands.find((brand) => brand.name === product.brand_name)?.slug
                                : null)}
                              title={`Browse ${product.brand_name || 'all'} footwear`}
                            >
                              <span className="brand-menu-product-image">
                                <img src={product.image} alt="" />
                              </span>
                              <span className="brand-menu-product-name">{product.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                    <div className="container" style={{ padding: '28px 20px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '28px' }}>
                      
                      {/* Subcategory Columns */}
                      {cat.columns.map((col, idx) => (
                        <div key={idx}>
                          <h4 style={{
                            fontFamily: "'Libre Baskerville', Georgia, serif",
                            fontSize: '15px',
                            color: '#2F4F4F',
                            marginBottom: '14px',
                            borderBottom: '1px solid #EBF1F1',
                            paddingBottom: '6px'
                          }}>
                            {col.title}
                          </h4>
                          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '9px' }}>
                            {col.items.map((item, itemIdx) => (
                              <li key={itemIdx}>
                                <button
                                  onClick={() => handleNavClick(cat.id, item.sub, item.brand)}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    padding: 0,
                                    fontSize: '13px',
                                    color: '#555555',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    fontFamily: 'Inter, sans-serif',
                                    transition: 'color 0.15s, transform 0.15s',
                                    display: 'inline-block'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.color = '#2F4F4F';
                                    e.currentTarget.style.fontWeight = '600';
                                    e.currentTarget.style.transform = 'translateX(4px)';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.color = '#555555';
                                    e.currentTarget.style.fontWeight = '400';
                                    e.currentTarget.style.transform = 'translateX(0)';
                                  }}
                                >
                                  {item.name}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}

                      {/* Featured Promotion Card */}
                      <div style={{
                        backgroundColor: '#F8FAF9',
                        borderRadius: '8px',
                        padding: '16px',
                        border: '1px solid #E2E8F0',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}>
                        <div>
                          <div style={{
                            display: 'inline-block',
                            backgroundColor: '#FFA0A0',
                            color: '#2F4F4F',
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: '12px',
                            marginBottom: '10px'
                          }}>
                            FEATURED
                          </div>
                          <h4 style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: '15px', color: '#1C2E2E', marginBottom: '6px' }}>
                            {cat.promo.title}
                          </h4>
                          <p style={{ fontSize: '12px', color: '#666666', marginBottom: '12px' }}>
                            {cat.promo.desc}
                          </p>
                        </div>

                        <div style={{ position: 'relative', width: '100%', height: '90px', borderRadius: '6px', overflow: 'hidden', backgroundColor: '#FFFFFF', marginBottom: '12px' }}>
                          <img 
                            src={cat.promo.image} 
                            alt={cat.promo.title} 
                            style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '6px' }} 
                          />
                        </div>

                        <button 
                          onClick={() => handleNavClick(cat.id)}
                          className="btn btn-primary"
                          style={{ fontSize: '12px', padding: '7px 14px', width: '100%' }}
                        >
                          <span>Explore Now</span>
                          <ArrowRight size={13} />
                        </button>
                      </div>

                    </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Clean Horizontal Divider Line below Navbar (matching Asset 5) */}
        <div style={{ maxWidth: '880px', margin: '0 auto', borderBottom: '1.5px solid #222222' }} />
      </nav>

    </header>
  );
}
