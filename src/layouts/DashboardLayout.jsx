import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from './DashboardLayout.module.css';
import { 
  LayoutDashboard, 
  Gem, 
  Users, 
  ShoppingBag, 
  UserCircle, 
  LogOut,
  Bell,
  ShoppingCart,
  Store,
  Menu,
  ChevronDown
} from 'lucide-react';

export default function DashboardLayout() {
  const { currentUser, userRole, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const updateCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const count = cart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(count);
    };

    updateCount();
    window.addEventListener('cartUpdate', updateCount);
    return () => window.removeEventListener('cartUpdate', updateCount);
  }, []);

  // Close sidebar on page change
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const adminLinks = [
    { path: '/admin', name: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/jewelry', name: 'Jewelry', icon: Gem },
    { path: '/admin/customers', name: 'Customers', icon: Users },
    { path: '/admin/orders', name: 'Orders', icon: ShoppingBag },
    { path: '/admin/users', name: 'Users', icon: UserCircle },
    { path: '/', name: 'Back to Website', icon: Store },
  ];

  const userLinks = [
    { path: '/user', name: 'Dashboard', icon: LayoutDashboard },
    { path: '/user/cart', name: 'Cart', icon: ShoppingCart },
    { path: '/user/orders', name: 'Orders', icon: ShoppingBag },
    { path: '/user/profile', name: 'Profile', icon: UserCircle },
    { path: '/', name: 'Back to Website', icon: Store },
  ];

  const links = userRole === 'admin' ? adminLinks : userLinks;

  const getPageTitle = () => {
    const currentLink = links.find(link => {
       if (link.path === '/admin' || link.path === '/user') {
           return location.pathname === link.path;
       }
       return location.pathname.startsWith(link.path);
     });
    return currentLink ? currentLink.name : 'Dashboard';
  };

  return (
    <div className={styles.layoutContainer}>
      {/* Sidebar Backdrop Overlay on Mobile/Tablet */}
      {isSidebarOpen && (
        <div className={styles.sidebarBackdrop} onClick={() => setIsSidebarOpen(false)} />
      )}

      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.brand}>
          <Gem size={32} color="#eab308" />
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', 'Georgia', serif", letterSpacing: '1px' }}>Ashluxe</h2>
            <p>{userRole === 'admin' ? 'Admin Panel' : 'Jewelry Store'}</p>
          </div>
        </div>

        <nav className={styles.nav}>
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) => {
                const isLinkActive = link.path === '/' 
                  ? location.pathname === '/'
                  : isActive || (link.path !== '/admin' && link.path !== '/user' && location.pathname.startsWith(link.path));
                return isLinkActive ? `${styles.navItem} ${styles.active}` : styles.navItem;
              }}
              end={link.path === '/admin' || link.path === '/user' || link.path === '/'}
              style={{ display: 'flex', alignItems: 'center', width: '100%', boxSizing: 'border-box' }}
            >
              <link.icon size={20} />
              <span style={{ flexGrow: 1, marginLeft: '12px' }}>{link.name}</span>
              {link.name === 'Cart' && cartCount > 0 && (
                <span className={styles.badge} style={{ position: 'static', backgroundColor: '#e2dff9', color: '#6c5ce7', border: 'none', marginLeft: '8px', padding: '3px 8px', borderRadius: '12px', fontSize: '0.75rem', height: 'auto', width: 'auto' }}>
                  {cartCount}
                </span>
              )}
            </NavLink>
          ))}
          
          <div className={styles.logout}>
            <button onClick={handleLogout} className={styles.navItem} style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left', display: 'flex', alignItems: 'center', boxSizing: 'border-box' }}>
              <LogOut size={20} />
              <span style={{ marginLeft: '12px' }}>Logout</span>
            </button>
          </div>
        </nav>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <button className={styles.menuToggle} onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <Menu size={24} />
            </button>
            <div className={styles.headerTitle}>{getPageTitle()}</div>
          </div>
          
          <div className={styles.userProfile}>
            <div className={styles.notification}>
              <Bell size={20} />
              <span className={styles.badge}>3</span>
            </div>
            
            <div className={styles.userInfo}>
              <div className={styles.userDetails}>
                <h4>{currentUser?.displayName || (userRole === 'admin' ? 'Admin' : 'Customer')}</h4>
                <p>{userRole === 'admin' ? 'Administrator' : 'Customer'}</p>
              </div>
              <ChevronDown size={16} color="#94a3b8" />
            </div>
          </div>
        </header>

        <div className={styles.contentBody}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
