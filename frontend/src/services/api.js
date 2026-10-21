const API_ORIGIN = import.meta.env.VITE_API_BASE || 'https://stepup-wx1d.onrender.com/api';
const API_BASE = API_ORIGIN.replace(/\/$/, '');
export const MEDIA_BASE = `${API_BASE.replace(/\/api$/, '')}/media`;

export const api = {
  // Auth
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'Login failed');
    return data;
  },

  async register(userData) {
    const res = await fetch(`${API_BASE}/auth/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (!res.ok) {
      const err = Object.values(data).flat().join(', ') || 'Registration failed';
      throw new Error(err);
    }
    return data;
  },

  async getCurrentUser(token) {
    const res = await fetch(`${API_BASE}/auth/me/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) throw new Error('Failed to fetch user');
    return res.json();
  },

  // Products
  async getProducts(params = {}) {
    const query = new URLSearchParams();
    if (params.category) query.append('category', params.category);
    if (params.gender) query.append('gender', params.gender);
    if (params.brand) query.append('brand', params.brand);
    if (params.trending) query.append('trending', 'true');
    if (params.offers) query.append('offers', 'true');
    if (params.search) query.append('search', params.search);
    if (params.ordering) query.append('ordering', params.ordering);

    const url = `${API_BASE}/products/items/?${query.toString()}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  },

  async getProduct(slug) {
    const res = await fetch(`${API_BASE}/products/items/${slug}/`);
    if (!res.ok) throw new Error('Failed to fetch product');
    return res.json();
  },

  async getCategories() {
    const res = await fetch(`${API_BASE}/products/categories/`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  },

  async getBrands() {
    const res = await fetch(`${API_BASE}/products/brands/`);
    if (!res.ok) throw new Error('Failed to fetch brands');
    return res.json();
  },

  async getHeroSlides() {
    const res = await fetch(`${API_BASE}/products/hero-slides/`);
    if (!res.ok) throw new Error('Failed to fetch hero slides');
    return res.json();
  },

  // Contact
  async sendContactEnquiry(enquiryData) {
    const res = await fetch(`${API_BASE}/contact/enquiry/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(enquiryData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to send message');
    return data;
  },

  async subscribeNewsletter(email) {
    const res = await fetch(`${API_BASE}/contact/newsletter/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'Subscription failed');
    return data;
  },

  // Orders
  async checkout(orderData, token = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}/orders/checkout/`, {
      method: 'POST',
      headers,
      body: JSON.stringify(orderData),
    });
    const data = await res.json();
    if (!res.ok) {
      const validationMessage = Object.values(data)
        .flatMap((value) => Array.isArray(value) ? value : [value])
        .find((value) => typeof value === 'string');
      throw new Error(data.detail || validationMessage || 'Checkout failed');
    }
    return data;
  },

  async verifyPayment(paymentData) {
    const res = await fetch(`${API_BASE}/orders/verify-payment/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'Could not verify the payment');
    return data;
  },
};
