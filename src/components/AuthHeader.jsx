import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu as MenuIcon, X as XIcon } from 'lucide-react';

export default function AuthHeader() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="topbar">
      <nav className="navbar">
        <div className="logo" onClick={() => navigate('/')}>
          Ash Luxe
        </div>
        <button className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
        </button>
        <ul className={`menu ${isMobileMenuOpen ? 'open' : ''}`}>
          <li><Link to="/" className="nav-link active" onClick={() => setIsMobileMenuOpen(false)}>Home</Link></li>
          <li><Link to="/" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Products</Link></li>
          <li><Link to="/" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link></li>
          <li><Link to="/" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Founder</Link></li>
          <li><Link to="/" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Contact Us</Link></li>
        </ul>
      </nav>
    </header>
  );
}
