import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AuthPage from './pages/AuthPage';
import ShopPage from './pages/ShopPage';
import CartPage from './pages/CartPage';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import ProductDetailModal from './components/ProductDetailModal';

function StepUpApp() {
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'about', 'contact', 'auth', 'shop', 'cart'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [activeProductModal, setActiveProductModal] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutPaymentMethod, setCheckoutPaymentMethod] = useState('Cash on Delivery');

  const openCheckout = (paymentMethod = 'Cash on Delivery') => {
    setCheckoutPaymentMethod(paymentMethod);
    setIsCheckoutOpen(true);
  };

  const handleSelectCategory = (catId, sub = null, brand = null, productId = null, search = '') => {
    setSelectedCategory(catId);
    setSelectedSubcategory(sub);
    setSelectedBrand(brand);
    setSearchFilter(search);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (product) => {
    setActiveProductModal(product);
  };

  return (
    <div className="stepup-application" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* 1. Header (Dynamic on all pages with Hover Dropdowns, Search, StepUp Logo, Libre Baskerville title) */}
      <Header 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onSelectCategory={handleSelectCategory}
      />

      {/* 2. Main Page Content */}
      <main style={{ flex: 1 }}>
        {currentPage === 'home' && (
          <HomePage 
            setCurrentPage={setCurrentPage}
            onSelectCategory={handleSelectCategory}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage 
            setCurrentPage={setCurrentPage}
          />
        )}

        {currentPage === 'contact' && (
          <ContactPage 
            setCurrentPage={setCurrentPage}
          />
        )}

        {currentPage === 'auth' && (
          <AuthPage 
            setCurrentPage={setCurrentPage}
          />
        )}

        {currentPage === 'shop' && (
          <ShopPage 
            initialCategory={selectedCategory}
            initialSubcategory={selectedSubcategory}
            initialBrand={selectedBrand}
            initialSearch={searchFilter}
            setCurrentPage={setCurrentPage}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentPage === 'cart' && (
          <CartPage 
            setCurrentPage={setCurrentPage}
            onProceedToCheckout={openCheckout}
          />
        )}
      </main>

      {/* 3. Footer (Consistent across all pages in #2F4F4F with links, newsletter, social media) */}
      <Footer 
        setCurrentPage={setCurrentPage}
        onSelectCategory={handleSelectCategory}
      />

      {/* 4. Global Modals & Drawers */}
      <CartDrawer 
        onCheckoutClick={() => openCheckout()}
      />

      {isCheckoutOpen && (
        <CheckoutModal
          onClose={() => setIsCheckoutOpen(false)}
          onOrderComplete={() => setCurrentPage('home')}
          selectedPaymentMethod={checkoutPaymentMethod}
        />
      )}

      {activeProductModal && (
        <ProductDetailModal 
          product={activeProductModal}
          onClose={() => setActiveProductModal(null)}
        />
      )}

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <StepUpApp />
      </CartProvider>
    </AuthProvider>
  );
}
