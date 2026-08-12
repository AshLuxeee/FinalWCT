import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, onSnapshot, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import styles from './AdminPages.module.css';
import { Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const items = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      setUsers(items);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching users:", error);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleRoleToggle = async (userItem) => {
    // Prevent self-role modification (cannot revoke own admin privilege)
    if (userItem.id === currentUser?.uid) {
      alert("You cannot modify your own role.");
      return;
    }

    const newRole = userItem.role === 'admin' ? 'user' : 'admin';
    try {
      await updateDoc(doc(db, 'users', userItem.id), {
        role: newRole,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      alert("Error updating user role: " + error.message);
    }
  };

  const handleDeleteUser = async (userItem) => {
    if (userItem.id === currentUser?.uid) {
      alert("You cannot delete your own account.");
      return;
    }

    if (window.confirm(`Are you sure you want to delete user "${userItem.name}"?`)) {
      try {
        await deleteDoc(doc(db, 'users', userItem.id));
      } catch (error) {
        alert("Error deleting user: " + error.message);
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Platform Users</h2>
      </div>

      {loading ? (
        <div className={styles.loader}>Loading users...</div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((userItem) => (
                <tr key={userItem.id}>
                  <td className={styles.bold}>{userItem.name}</td>
                  <td>{userItem.email}</td>
                  <td className={styles.capitalize}>
                    <button 
                      onClick={() => handleRoleToggle(userItem)}
                      className={`${styles.status} ${userItem.role === 'admin' ? styles.completed : styles.pending}`}
                      style={{ border: 'none', cursor: 'pointer' }}
                    >
                      {userItem.role || 'user'}
                    </button>
                  </td>
                  <td>{userItem.createdAt ? new Date(userItem.createdAt).toLocaleDateString() : 'N/A'}</td>
                  <td>
                    <button 
                      className={styles.deleteBtn} 
                      onClick={() => handleDeleteUser(userItem)}
                      disabled={userItem.id === currentUser?.uid}
                      style={{ opacity: userItem.id === currentUser?.uid ? 0.5 : 1 }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="5" className={styles.empty}>No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
