import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('stepup_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [coupon, setCoupon] = useState(null); // { code: 'STEPUP50', discountPercent: 50 }

  useEffect(() => {
    localStorage.setItem('stepup_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, size = '7', color = 'Default') => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id && item.size === size && item.color === color);
      if (existing) {
        return prev.map(item => 
          item.id === product.id && item.size === size && item.color === color
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, {
        id: product.id,
        name: product.name,
        price: Number(product.price),
        original_price: Number(product.original_price || product.price),
        image: product.image,
        category: product.category_name,
        size,
        color,
        quantity: 1
      }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id, size, color) => {
    setCartItems(prev => prev.filter(item => !(item.id === id && item.size === size && item.color === color)));
  };

  const updateQuantity = (id, size, color, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id, size, color);
      return;
    }
    setCartItems(prev => prev.map(item => 
      item.id === id && item.size === size && item.color === color
        ? { ...item, quantity }
        : item
    ));
  };

  const clearCart = () => {
    setCartItems([]);
    setCoupon(null);
    setIsCartOpen(false);
  };

  const applyCoupon = (code) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'STEPUP50' || cleanCode === 'OFFER50') {
      setCoupon({ code: cleanCode, discountPercent: 50 });
      return { success: true, message: '🎉 50% discount coupon applied successfully!' };
    }
    if (cleanCode === 'STEPUP10') {
      setCoupon({ code: cleanCode, discountPercent: 10 });
      return { success: true, message: '🎉 10% welcome coupon applied!' };
    }
    return { success: false, message: 'Invalid coupon code. Try STEPUP50 for 50% off!' };
  };

  const removeCoupon = () => {
    setCoupon(null);
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = coupon ? (subtotal * coupon.discountPercent) / 100 : 0;
  const grandTotal = Math.max(0, subtotal - discountAmount);

  return (
    <CartContext.Provider value={{
      cartItems,
      isCartOpen,
      setIsCartOpen,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      coupon,
      applyCoupon,
      removeCoupon,
      totalItems,
      subtotal,
      discountAmount,
      grandTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
