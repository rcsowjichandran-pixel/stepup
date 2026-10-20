# StepUp.in - Full-Stack E-Commerce Footwear Website

A footwear e-commerce application built with **React** frontend and **Python Django** backend, designed according to the Figma mockups and specifications.

---

## 🎨 Design & Theme Specifications
- **Brand Name**: `StepUp.in`
- **Font Family**: `Libre Baskerville` (Headings, Brand, Overview, serif accents) & `Inter` (Body & UI text)
- **Primary Color**: `#2F4F4F` (Dark Slate Gray)
- **Accent Color**: `#FFA0A0` (Pale Red / Coral Pink)
- **Project Directory**: `E:\Stepup`

---

## 🚀 Key Features

### 1. Consistent Header & Dynamic Navbar
- **Header Top Bar** in Dark Slate Gray (`#2F4F4F`) with circular StepUp logo, dynamic live autocomplete search input, navigation links (`Home`, `About Us`, `Contact Us`, `Login`/User menu, `Cart` with live counter badge).
- **Brand Title**: `StepUp.in` in `Libre Baskerville`.
- **Dynamic Mega Dropdown on Hover**: Hovering over `Women`, `Men`, `Kids`, `Brands`, or `Offers` displays categorized sub-sections, trending styles, special collections, and featured promotion cards.

### 2. Dynamic Hero Slider with Bullets
- Auto-rotating slides with smooth transitions.
- Key shoe highlights with dynamic bullet points for each slide.
- Clickable bullet pagination indicators at the bottom center.
- Direct "Shop Now" call to action linking to filtered categories.

### 3. Pages Included
- **Home Page**:
  - Hero slider with bullets
  - "Overview" section with exact Figma text
  - "What are you looking for?" with Men, Women, and Kids categories
  - "New & Trending" 8-product card grid with ratings, MRP, discount badges, and Add to Cart
  - "🎁 Get your first order with free gift & 50% offer" promo banner
- **About Us Page** (matching Figma Mockup 3):
  - Brand heritage description
  - "Our Mission" statement
  - 3 Circular Pillars: *Simplicity In Design*, *Confidence In Comfort*, *Made From Nature*
  - Side illustration graphic
- **Contact Us Page** (matching Figma Mockup 4):
  - Online order customer care timings & helpline
  - Interactive Enquiry Form connected to Django API (`/api/contact/enquiry/`)
  - Side footwear collage banner
- **Login / Register Page** (matching Figma Mockup 5):
  - Tabbed interface (`[Log In] [Register]`)
  - Password show/hide toggle eye icon
  - Google login authentication mockup
  - Real Django JWT / Session authentication (`/api/auth/login/`, `/api/auth/register/`)
- **Shop / Catalog Page**:
  - Filter by category, brand, max price range slider, and search query
  - Sort by Most Popular, Price Low-High, Price High-Low, Newest
- **Product Detail Modal**:
  - Size selector (UK 5 to 10), Color selector, Quantity controls, and Add to Cart
- **Slide-Over Cart Drawer & Checkout**:
  - Slide-in cart with coupon code support (`STEPUP50` for 50% discount)
  - Full checkout modal with shipping address and order placement to Django backend

### 4. Consistent Dark Slate Gray Footer
- Contact info (Helpline, WhatsApp, Email, Address)
- Shop and Info quick links
- Interactive newsletter subscription form with toast feedback
- Social media icon links (Facebook, Instagram, Twitter, LinkedIn)

---

## 🔐 Demo Credentials
- **Superuser**: `stepup` / `step123` (Admin Access)
- **Admin**: `admin` / `admin123`
- **Customer User**: `user@stepup.in` / `user123`

---

## 🏃 Running the Application

### Option A: One-Click Starter
Double-click `E:\Stepup\run_project.bat` to automatically start both servers.

### Option B: Manual Command Line

#### 1. Backend (Django)
```powershell
cd E:\Stepup\backend
python -m pip install -r requirements.txt
python manage.py runserver 127.0.0.1:8000
```
API Root: `http://127.0.0.1:8000/api/`
The backend uses SQLite (`backend/db.sqlite3`) and serves imported images from `backend/media/`. Before the first run, migrate the database and import the image folder from the project root:
```powershell
cd E:\Stepup
python backend\manage.py migrate
python copy_images.py
python backend\seed_data.py
```
The importer copies every image in `stepupimages` into backend media, copies the men's, women's, and kids' catalog photos into the frontend, and registers the four rotating hero slides in SQLite. The seed script adds the matching category products to SQLite. The slide order and visibility can be managed in Django admin.

#### 2. Frontend (React + Vite)
```powershell
cd E:\Stepup\frontend
npm run dev -- --host 127.0.0.1 --port 5173
```
Website URL: `http://127.0.0.1:5173/`
Vite proxies `/media/` requests to Django, so imported backend images are served through the frontend origin.
After a successful order, delivery details are saved in the browser and reused for the next checkout. UPI and online payment selections are recorded as pending until a payment gateway is configured; they do not charge a customer.
