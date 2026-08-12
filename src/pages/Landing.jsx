import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu as MenuIcon, X as XIcon } from 'lucide-react';

import heroBg from '../../images/backgroud.jpg';
import founderImg from '../../images/me.jpg';
import set1 from '../../images/set1.jpg';
import set2 from '../../images/set2.jpg';
import set3 from '../../images/set3.jpg';
import set4 from '../../images/set4.jpg';
import ring1 from '../../images/ring1.jpg';
import ring2 from '../../images/ring2.jpg';
import ring3 from '../../images/ring3.jpg';
import ring4 from '../../images/ring4.jpg';
import ear1 from '../../images/ear1.jpg';
import ear2 from '../../images/ear2.jpg';
import ear3 from '../../images/ear3.jpg';
import ear4 from '../../images/ear4.jpg';
import nack1 from '../../images/nack1.jpg';
import nack2 from '../../images/nack2.jpg';
import nack3 from '../../images/nack3.jpg';
import nack4 from '../../images/nack4.jpg';
import b1 from '../../images/b1.jpg';
import b2 from '../../images/b2.jpg';
import b3 from '../../images/b3.jpg';
import b4 from '../../images/b4.jpg';

const products = [
  { id: 1, name: 'Golden Fox Set', price: 20, category: 'set', image: set1 },
  { id: 2, name: 'Blessings Set', price: 20, category: 'set', image: set2 },
  { id: 3, name: 'Lucky Set', price: 20, category: 'set', image: set3 },
  { id: 4, name: 'Wealthy Set', price: 20, category: 'set', image: set4 },
  { id: 5, name: 'Elegant Gold Diamond Ring', price: 114, category: 'ring', image: ring1 },
  { id: 6, name: 'Delicate Gold Leaf Engagement Ring', price: 291, category: 'ring', image: ring2 },
  { id: 7, name: 'Floral Leafy Round Cut Ring', price: 160, category: 'ring', image: ring3 },
  { id: 8, name: 'Round Diamond Ring', price: 185, category: 'ring', image: ring4 },
  { id: 9, name: 'Butterfly Earrings', price: 90, category: 'earring', image: ear1 },
  { id: 10, name: 'Aurora Huggies Earrings', price: 110, category: 'earring', image: ear2 },
  { id: 11, name: 'Floral Earrings', price: 450, category: 'earring', image: ear3 },
  { id: 12, name: 'Cat’s Eye Stone Tassel Earrings', price: 321, category: 'earring', image: ear4 },
  { id: 13, name: 'Elegant Gold Necklace', price: 500, category: 'necklace', image: nack1 },
  { id: 14, name: 'Elegant Gold Pearl Necklace', price: 390, category: 'necklace', image: nack2 },
  { id: 15, name: 'Pear Diamond Necklace', price: 365, category: 'necklace', image: nack3 },
  { id: 16, name: 'Floral Necklace', price: 682, category: 'necklace', image: nack4 },
  { id: 17, name: 'Bamboo Style Bangle', price: 122, category: 'bangle', image: b1 },
  { id: 18, name: 'Flower Bangle', price: 90, category: 'bangle', image: b2 },
  { id: 19, name: 'Lotus Diamond Bangle', price: 256, category: 'bangle', image: b3 },
  { id: 20, name: 'Heart Shaped Bangle', price: 99, category: 'bangle', image: b4 },
];

const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'products', label: 'Products' },
  { id: 'about', label: 'About Us' },
  { id: 'founder', label: 'Founder' },
  { id: 'contact', label: 'Contact Us' },
];

function Landing() {
  const [activePage, setActivePage] = useState('home');
  const [filter, setFilter] = useState('all');
  const [quantities, setQuantities] = useState({});
  const navigate = useNavigate();
  const { currentUser, userRole, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleAccountClick = () => {
    if (currentUser) {
      if (userRole === 'admin') {
        navigate('/admin');
      } else {
        navigate('/user');
      }
    } else {
      navigate('/login');
    }
  };

  const visibleProducts = useMemo(() => {
    if (filter === 'all') return products;
    return products.filter((item) => item.category === filter);
  }, [filter]);

  const cartCount = useMemo(() => {
    return Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
  }, [quantities]);

  const updateQuantity = (id, delta) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta),
    }));
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <nav className="navbar">
          <div className="logo">Ash Luxe</div>
          <button className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
          </button>
          <ul className={`menu ${isMobileMenuOpen ? 'open' : ''}`}>
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  className={activePage === item.id ? 'nav-link active' : 'nav-link'}
                  onClick={() => {
                    setActivePage(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
          <div className="navbar-actions">
            {currentUser ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                backgroundColor: '#fce7f3', // Soft pink background from screenshot
                padding: '8px 16px',
                borderRadius: '16px', // Rounded card
                boxShadow: '0 2px 8px rgba(244, 63, 94, 0.05)'
              }}>
                <button
                  onClick={handleAccountClick}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: '#e9d5ff', // Purple pill
                    color: '#6b21a8',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '12px',
                    fontWeight: '700',
                    fontFamily: "'Inter', sans-serif",
                    cursor: 'pointer',
                    fontSize: '0.85rem'
                  }}
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                  Account
                </button>
              </div>
            ) : (
              <button className="account-section" onClick={handleAccountClick}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px' }}>
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span>Account</span>
              </button>
            )}

          </div>
        </nav>
      </header>

      {activePage === 'home' && (
        <main>
          <section className="hero" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url(${heroBg})` }}>
            <div className="hero-content">
              <p className="eyebrow">Luxury Jewelry from China</p>
              <h1>Ash Luxe</h1>
              <p>Discover handcrafted rings, earrings, necklaces, and bangles with timeless elegance.</p>
              <button className="btn" onClick={() => setActivePage('products')}>Shop Now</button>
            </div>
          </section>

          <section className="section">
            <h2>Luxury Jewelry Collection</h2>
            <p>
              From delicate rings to statement necklaces, each piece is designed to shine with refined craftsmanship and modern charm.
            </p>
          </section>
        </main>
      )}

      {activePage === 'products' && (
        <main className="page-section">
          <section className="section">
            <div className="section-heading">
              <p className="eyebrow">Curated collection</p>
              <h2>Our Collection</h2>
            </div>

            <div className="filter-bar">
              {['all', 'set', 'ring', 'earring', 'necklace', 'bangle'].map((category) => (
                <button
                  key={category}
                  className={filter === category ? 'filter-pill active' : 'filter-pill'}
                  onClick={() => setFilter(category)}
                >
                  {category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1) + 's'}
                </button>
              ))}
            </div>

            <div className="product-grid">
              {visibleProducts.map((item) => (
                <article className="card" key={item.id}>
                  <img src={item.image} alt={item.name} />
                  <h3>{item.name}</h3>
                  <p className="price">${item.price}</p>
                  <p className="meta">Free Delivery</p>
                </article>
              ))}
            </div>
          </section>
        </main>
      )}

      {activePage === 'about' && (
        <main className="page-section">
          <section className="section story-card">
            <p className="eyebrow">About Ash Luxe</p>
            <h2>Timeless luxury made accessible</h2>
            <p>
              Ash Luxe is a luxury jewelry brand inspired by timeless elegance and modern luxury. We source high-quality pieces directly from trusted suppliers in China and bring premium designs to customers with a warm and graceful experience.
            </p>
            <p>
              Every piece reflects thoughtful craftsmanship, delicate detail, and an effortless sense of sophistication.
            </p>
          </section>
        </main>
      )}

      {activePage === 'founder' && (
        <main className="page-section">
          <section className="section founder-card">
            <img src={founderImg} alt="Founder Heng MengHorng" />
            <div>
              <p className="eyebrow">Founder & Creative Director</p>
              <h2>Heng MengHorng</h2>
              <p>
                Welcome to Ash Luxe. I founded this brand with a passion for elegance, luxury, and timeless beauty. My vision is to create jewelry that inspires confidence and celebrates life’s special moments.
              </p>
              <p>
                Every collection reflects attention to detail, quality craftsmanship, and a commitment to providing beautiful jewelry for our customers.
              </p>
              <p className="contact-tag">Telegram: @httpsxmff</p>
            </div>
          </section>
        </main>
      )}

      {activePage === 'contact' && (
        <main className="page-section">
          <section className="section contact-card">
            <div>
              <p className="eyebrow">Client services</p>
              <h2>Let’s connect</h2>
              <p>We are honored to assist you with any questions about our collections or orders.</p>
              <form className="contact-form">
                <input type="text" placeholder="Your Name" />
                <input type="email" placeholder="Your Email" />
                <textarea rows="5" placeholder="Your Message" />
                <button type="submit">Send Message</button>
              </form>
            </div>
            <div className="contact-details">
              <h3>Contact details</h3>
              <p>📧 horng4061@gmail.com</p>
              <p>☎️ 096 404 7035</p>
              <p>📍 Chrouy Chongva, Phnom Penh, Cambodia</p>
            </div>
          </section>
        </main>
      )}

      <footer className="footer">
        <p>© {new Date().getFullYear()} Ash Luxe. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Landing;
