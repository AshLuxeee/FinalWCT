import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, query, where, orderBy, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import styles from './UserPages.module.css';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, 'orders'),
      where('customerEmail', '==', currentUser.email),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      setOrders(items);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching orders:", error);
      setLoading(false);
    });

    return unsubscribe;
  }, [currentUser]);

  const handleCancelOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        await updateDoc(doc(db, 'orders', orderId), {
          status: 'Cancelled',
          updatedAt: new Date().toISOString()
        });
        alert("Order cancelled successfully.");
      } catch (error) {
        alert("Error cancelling order: " + error.message);
      }
    }
  };

  return (
    <div className={styles.container}>
      <h2>My Orders</h2>

      {loading ? (
        <div className={styles.loader}>Loading your orders...</div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Items Ordered</th>
                <th>Total Price</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td style={{ fontWeight: 600 }}>#{order.id.slice(0, 8)}</td>
                  <td>
                    <ul style={{ paddingLeft: '20px', margin: 0 }}>
                      {order.items?.map((item, i) => (
                        <li key={i}>
                          {item.name} (x{item.quantity})
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td style={{ fontWeight: 600 }}>${order.total?.toFixed(2)}</td>
                  <td>
                    <span className={`${styles.status} ${styles[order.status?.toLowerCase()]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</td>
                  <td>
                    {order.status === 'Pending' && (
                      <button 
                        className={styles.cancelBtn} 
                        onClick={() => handleCancelOrder(order.id)}
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan="6" className={styles.empty}>You haven't placed any orders yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
