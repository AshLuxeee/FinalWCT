import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, onSnapshot, updateDoc, deleteDoc, doc, orderBy, query } from 'firebase/firestore';
import styles from './AdminPages.module.css';
import { Trash2 } from 'lucide-react';

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
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
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateDoc(doc(db, 'orders', id), {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      alert("Error updating order status: " + error.message);
    }
  };

  const handleDeleteOrder = async (id) => {
    if (window.confirm("Are you sure you want to delete this order record?")) {
      try {
        await deleteDoc(doc(db, 'orders', id));
      } catch (error) {
        alert("Error deleting order: " + error.message);
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Manage Orders</h2>
      </div>

      {loading ? (
        <div className={styles.loader}>Loading orders...</div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total Price</th>
                <th>Status</th>
                <th>Order Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className={styles.bold}>#{order.id.slice(0, 8)}</td>
                  <td>
                    <div>{order.customerName}</div>
                    <div style={{ fontSize: '0.8rem', color: '#636e72' }}>{order.customerEmail}</div>
                  </td>
                  <td>
                    <ul style={{ paddingLeft: '20px', margin: 0 }}>
                      {order.items?.map((item, i) => (
                        <li key={i}>
                          {item.name} (x{item.quantity})
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className={styles.bold}>${order.total?.toFixed(2)}</td>
                  <td>
                    <select 
                      value={order.status} 
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={`${styles.status} ${styles[order.status?.toLowerCase()]}`}
                      style={{ border: 'none', cursor: 'pointer', padding: '6px 10px' }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</td>
                  <td>
                    <button className={styles.deleteBtn} onClick={() => handleDeleteOrder(order.id)}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan="7" className={styles.empty}>No orders placed yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
