import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import styles from './AdminPages.module.css';

export default function ManageCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Customers are users whose role is 'user'
    const q = query(collection(db, 'users'), where('role', '==', 'user'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      setCustomers(items);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching customers:", error);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Customers List</h2>
      </div>

      {loading ? (
        <div className={styles.loader}>Loading customers...</div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Joined Date</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id}>
                  <td className={styles.bold}>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : 'N/A'}</td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr>
                  <td colSpan="3" className={styles.empty}>No registered customers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
