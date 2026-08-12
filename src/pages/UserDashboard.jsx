import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase/config';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import styles from './Dashboard.module.css';
import { Gem, ShoppingCart, ShoppingBag, User, ArrowRight } from 'lucide-react';

export default function UserDashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [jewelry, setJewelry] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingJewelry, setLoadingJewelry] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Fetch 4 available jewelry items
  useEffect(() => {
    const q = query(collection(db, 'jewelry'), limit(4));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      setJewelry(items);
      setLoadingJewelry(false);
    }, (error) => {
      console.error(error);
      setLoadingJewelry(false);
    });
    return unsubscribe;
  }, []);

  // Fetch user's recent orders (limit 3)
  useEffect(() => {
    if (!currentUser) return;
    const q = query(
      collection(db, 'orders'),
      where('customerEmail', '==', currentUser.email),
      orderBy('createdAt', 'desc'),
      limit(3)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      setOrders(items);
      setLoadingOrders(false);
    }, (error) => {
      console.error(error);
      setLoadingOrders(false);
    });
    return unsubscribe;
  }, [currentUser]);

  return (
    <div className={styles.dashboardContainer}>
      {/* Welcome Banner */}
      <div className={styles.welcomeBanner}>
        <div>
          <h2>Welcome back, {currentUser?.displayName || 'Li Li'}! 👋</h2>
          <p>Find your perfect jewelry and make every moment shine.</p>
        </div>
        <button className={styles.browseBtn} onClick={() => navigate('/user/browse')}>
          <Gem size={18} style={{ fill: 'white' }} />
          Browse Jewelry
        </button>
      </div>

      {/* Main Grid */}
      <div className={styles.bottomGrid}>
        {/* Available Jewelry */}
        <div className={styles.recentOrders}>
          <div className={styles.sectionHeader}>
            <h3>Available Jewelry</h3>
            <button className={styles.textBtn} onClick={() => navigate('/user/browse')}>View All &gt;</button>
          </div>
          {loadingJewelry ? (
            <div className={styles.loader}>Loading...</div>
          ) : (
            <div className={styles.tableResponsive}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>Jewelry</th>
                    <th></th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {jewelry.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <img 
                          src={item.imageUrl} 
                          alt={item.name} 
                          className={styles.thumbnail}
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/150' }}
                        />
                      </td>
                      <td className={styles.bold}>{item.name}</td>
                      <td className={styles.capitalize}>{item.category}</td>
                      <td className={styles.bold}>${item.price.toFixed(2)}</td>
                      <td>
                        <button className={styles.actionBtn} onClick={() => navigate('/user/browse')}>
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {/* Pagination Carousel Dots */}
          <div className={styles.carouselDots}>
            <span className={`${styles.dot} ${styles.activeDot}`}></span>
            <span className={styles.dot}></span>
            <span className={styles.dot}></span>
          </div>
        </div>

        {/* My Recent Orders */}
        <div className={styles.recentOrders}>
          <div className={styles.sectionHeader}>
            <h3>My Recent Orders</h3>
            <button className={styles.textBtn} onClick={() => navigate('/user/orders')}>View All &gt;</button>
          </div>
          {loadingOrders ? (
            <div className={styles.loader}>Loading...</div>
          ) : (
            <div className={styles.tableResponsive}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Jewelry</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td className={styles.bold}>#{order.id.slice(0, 8).toUpperCase()}</td>
                      <td className={styles.descCol} style={{ maxWidth: '100px' }}>
                        {order.items?.map(i => i.name).join(', ')}
                      </td>
                      <td className={styles.bold}>${order.total?.toFixed(2)}</td>
                      <td>
                        <span className={`${styles.status} ${styles[order.status?.toLowerCase()]}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan="5" className={styles.empty}>No orders placed yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className={styles.quickActionsSection}>
        <div className={styles.sectionHeader}>
          <h3>Quick Actions</h3>
        </div>
        <div className={styles.actionsGrid4}>
          <div className={`${styles.actionCardRow} ${styles.purpleCard}`} onClick={() => navigate('/user/browse')}>
             <div className={styles.actionIconContainer}>
                <Gem size={22} />
             </div>
             <div className={styles.actionText}>
                <h4>Browse Jewelry</h4>
                <p>Explore our collection</p>
             </div>
             <ArrowRight size={18} className={styles.arrowIcon} />
          </div>

          <div className={`${styles.actionCardRow} ${styles.blueCard}`} onClick={() => navigate('/user/cart')}>
             <div className={styles.actionIconContainer}>
                <ShoppingCart size={22} />
             </div>
             <div className={styles.actionText}>
                <h4>View Cart</h4>
                <p>Check your items</p>
             </div>
             <ArrowRight size={18} className={styles.arrowIcon} />
          </div>

          <div className={`${styles.actionCardRow} ${styles.greenCard}`} onClick={() => navigate('/user/orders')}>
             <div className={styles.actionIconContainer}>
                <ShoppingBag size={22} />
             </div>
             <div className={styles.actionText}>
                <h4>My Orders</h4>
                <p>Track your orders</p>
             </div>
             <ArrowRight size={18} className={styles.arrowIcon} />
          </div>

          <div className={`${styles.actionCardRow} ${styles.orangeCard}`} onClick={() => navigate('/user/profile')}>
             <div className={styles.actionIconContainer}>
                <User size={22} />
             </div>
             <div className={styles.actionText}>
                <h4>Update Profile</h4>
                <p>Edit your information</p>
             </div>
             <ArrowRight size={18} className={styles.arrowIcon} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className={styles.dashboardFooter}>
        <p>© 2025 Ashluxe Jewelry Store. All rights reserved.</p>
      </footer>
    </div>
  );
}
