# Ash Luxe - Luxury Jewelry Store

Ash Luxe is a premium, fully responsive web application for a luxury jewelry boutique. It features a public-facing brochure catalog, a fully functional shopping cart system, and two custom, role-based dashboards (Admin Portal and User Portal) powered by Firebase Authentication and Cloud Firestore.

## 🌟 Features

### 🛍️ Public website
- **Brochure Showcase**: Responsive home section displaying handcrafted rings, earrings, necklaces, and bangles.
- **Product Catalog**: Curated listings with category filter tabs.
- **Responsive Header Navigation**: Dynamic collapsible navigation menu for smaller devices.
- **Single-Sign-On Integration**: Direct auth state check that redirects authenticated users to their corresponding dashboard when clicking "Account".

### 🏠 User Dashboard
- **Dynamic Welcome Card**: Personalized greeting banner with quick shortcuts.
- **Available Jewelry List**: Live catalog preview with image thumbnails and interactive details modal.
- **My Recent Orders**: Live order tracking table featuring colorful status badges (Pending, Processing, Shipped, Completed, Cancelled).
- **Quick Action Grid**: Beautifully styled cards with interactive hover effects.
- **Shopping Cart**: Real-time persistent local cart badge count updates, cart items editor, and custom checkout form.
- **Profile Manager**: Fully functional editing form for user display names, phone numbers, and shipping addresses stored securely in Firestore.

### 👑 Admin Dashboard
- **Live Business Analytics**: Dynamic KPI statistic cards displaying:
  - Total Jewelry Items in database.
  - Registered Customers (role-filtered user counts).
  - Total Placed Orders.
  - Cumulative Total Earnings (Real-time financial sum).
- **Recent Orders Log**: Chronological order logs with customer name mappings, purchase price tags, and order status pills.
- **Quick Admin Shortcuts**: Hotlinks to instantly create and update jewelry inventory, track user accounts, and review order documents.

---

## 🛠️ Tech Stack
- **Frontend Framework**: [React](https://reactjs.org/) (Vite)
- **Routing**: [React Router DOM](https://reactrouter.com/)
- **Database & Authentication**: [Firebase](https://firebase.google.com/) (Auth & Cloud Firestore)
- **Styling**: Vanilla CSS (Premium responsive themes, glassmorphism, grid/flexbox)
- **Icons Library**: [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

### 📋 Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed on your local computer.

### 🔧 Installation & Running
1. Clone the repository:
   ```bash
   git clone https://github.com/AshLuxeee/FinalWCT.git
   cd FinalWCT
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Firebase:
   Edit connection configuration properties inside `src/firebase/config.js` with your active Firebase keys.

4. Start the local development server:
   ```bash
   npm run dev
   ```

---

## 📂 Project Structure
```text
├── public/                 # Static assets served at root (jewelry images)
├── src/
│   ├── components/         # Reusable headers and layouts
│   ├── contexts/           # AuthContext managing user logins and Google popups
│   ├── firebase/           # config.js and seed.js (auto-populates Firestore catalog)
│   ├── layouts/            # DashboardLayout managing sidebar & topbar navigation
│   ├── pages/
│   │   ├── admin/          # Admin pages (ManageJewelry, ManageCustomers, etc.)
│   │   ├── user/           # User pages (Cart, MyOrders, Profile, etc.)
│   │   ├── Landing.jsx     # Main public website catalog homepage
│   │   ├── Login.jsx       # Email & Google Sign-In gate page
│   │   └── Register.jsx    # User sign-up registration forms
│   ├── App.jsx             # React router declaration and role-protected routes
│   └── main.jsx            # Application root entry point
├── style.css               # Public website stylesheet
└── package.json            # Project dependencies and run script configurations
```

---

## 🔒 License
This project is open-source and available under the MIT License.
