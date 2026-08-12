import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase/config';
import { collection, query, orderBy, limit, onSnapshot, where } from 'firebase/firestore';
import styles from './Dashboard.module.css';
import { Users, Gem, ShoppingBag, DollarSign } from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [jewelryCount, setJewelryCount] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch Jewelry Count
    const unsubscribeJewelry = onSnapshot(collection(db, 'jewelry'), (snapshot) => {
      setJewelryCount(snapshot.size);
    });

    // 2. Fetch Customer Count (users with role === 'user')
    const qCustomers = query(collection(db, 'users'), where('role', '==', 'user'));
    const unsubscribeCustomers = onSnapshot(qCustomers, (snapshot) => {
      setCustomerCount(snapshot.size);
    });

    // 3. Fetch Orders Count & Calculate Revenue
    const unsubscribeOrders = onSnapshot(collection(db, 'orders'), (snapshot) => {
      setOrdersCount(snapshot.size);
      let revenue = 0;
      snapshot.forEach((doc) => {
        const orderData = doc.data();
        revenue += orderData.total || 0;
      });
      setTotalRevenue(revenue);
    });

    // 4. Fetch 3 Recent Orders
    const qRecentOrders = query(
      collection(db, 'orders'),
      orderBy('createdAt', 'desc'),
      limit(3)
    );
    const unsubscribeRecent = onSnapshot(qRecentOrders, (snapshot) => {
      const list = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setRecentOrders(list);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching recent orders:", error);
      setLoading(false);
    });

    return () => {
      unsubscribeJewelry();
      unsubscribeCustomers();
      unsubscribeOrders();
      unsubscribeRecent();
    };
  }, []);

  const stats = [
    { title: 'Total Jewelry', value: jewelryCount.toString(), sub: 'All Jewelry Items', icon: Gem, color: '#0984e3', bg: '#e3f2fd' },
    { title: 'Total Customers', value: customerCount.toString(), sub: 'Registered Customers', icon: Users, color: '#00b894', bg: '#e8f5e9' },
    { title: 'Total Orders', value: ordersCount.toString(), sub: 'All Orders', icon: ShoppingBag, color: '#fdcb6e', bg: '#fff8e1' },
    { title: 'Total Revenue', value: `$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, sub: 'Total Earnings', icon: DollarSign, color: '#6c5ce7', bg: '#f3e5f5' }
  ];

  return (
    <div className={styles.dashboardContainer}>
      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        {stats.map((stat, i) => (
          <div key={i} className={styles.statCard}>
            <div className={styles.statIcon} style={{ color: stat.color, backgroundColor: stat.bg }}>
              <stat.icon size={24} />
            </div>
            <div className={styles.statInfo}>
              <p className={styles.statTitle}>{stat.title}</p>
              <h3 className={styles.statValue}>{stat.value}</h3>
              <p className={styles.statSub}>{stat.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className={styles.bottomGrid}>
        {/* Recent Orders */}
        <div className={styles.recentOrders}>
          <div className={styles.sectionHeader}>
            <h3>Recent Orders</h3>
            <button className={styles.textBtn} onClick={() => navigate('/admin/orders')}>View All Orders</button>
          </div>
          {loading ? (
            <div className={styles.loader}>Loading...</div>
          ) : (
            <div className={styles.tableResponsive}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Jewelry</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className={styles.bold}>#{order.id.slice(0, 8).toUpperCase()}</td>
                      <td>{order.customerName || 'Guest User'}</td>
                      <td className={styles.bold} style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {order.items?.map(i => i.name).join(', ')}
                      </td>
                      <td className={styles.bold}>${order.total?.toFixed(2)}</td>
                      <td>
                        <span className={`${styles.status} ${styles[order.status?.toLowerCase()]}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</td>
                    </tr>
                  ))}
                  {recentOrders.length === 0 && (
                    <tr>
                      <td colSpan="6" className={styles.empty}>No orders placed yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className={styles.quickActions}>
          <div className={styles.sectionHeader}>
            <h3>Quick Actions</h3>
          </div>
          <div className={styles.actionsGrid}>
            <div className={styles.actionCard} onClick={() => navigate('/admin/jewelry')}>
               <Gem size={24} color="#0984e3" />
               <p>Add Jewelry</p>
            </div>
            <div className={styles.actionCard} onClick={() => navigate('/admin/customers')}>
               <Users size={24} color="#00b894" />
               <p>Manage Customers</p>
            </div>
            <div className={styles.actionCard} onClick={() => navigate('/admin/orders')}>
               <ShoppingBag size={24} color="#fdcb6e" />
               <p>Manage Orders</p>
            </div>
            <div className={styles.actionCard} onClick={() => navigate('/admin/users')}>
               <Users size={24} color="#6c5ce7" />
               <p>Manage Users</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
