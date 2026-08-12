import React, { useState, useEffect } from 'react';
import { db, auth } from '../../firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { useAuth } from '../../contexts/AuthContext';
import styles from './UserPages.module.css';

export default function Profile() {
  const { currentUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [joinedDate, setJoinedDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    
    setEmail(currentUser.email);
    setName(currentUser.displayName || '');

    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setName(data.name || '');
          setPhone(data.phone || '');
          setAddress(data.address || '');
          setJoinedDate(data.createdAt ? new Date(data.createdAt).toLocaleDateString() : 'N/A');
        }
      } catch (error) {
        console.error("Error fetching user document:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    setSaving(true);
    try {
      // 1. Update Auth Profile
      await updateProfile(auth.currentUser, {
        displayName: name
      });

      // 2. Update Firestore Document
      await updateDoc(doc(db, 'users', currentUser.uid), {
        name,
        phone,
        address,
        updatedAt: new Date().toISOString()
      });

      alert("Profile updated successfully!");
    } catch (error) {
      alert("Error updating profile: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className={styles.loader}>Loading profile...</div>;

  return (
    <div className={styles.container}>
      <h2>Update Profile</h2>
      <div className={styles.profileCard} style={{ maxWidth: '600px' }}>
        <form onSubmit={handleSave}>
          <div className={styles.formGroup}>
            <label>Email Address</label>
            <input type="email" value={email} disabled style={{ backgroundColor: '#f5f5f5', color: '#888', cursor: 'not-allowed' }} />
          </div>
          <div className={styles.formGroup}>
            <label>Full Name</label>
            <input 
              type="text" 
              required 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
            />
          </div>
          <div className={styles.formGroup}>
            <label>Phone Number</label>
            <input 
              type="tel" 
              placeholder="+855 12 345 678"
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
            />
          </div>
          <div className={styles.formGroup}>
            <label>Shipping Address</label>
            <input 
              type="text" 
              placeholder="House#, Street, Sangkat, Khan, Phnom Penh"
              value={address} 
              onChange={(e) => setAddress(e.target.value)} 
            />
          </div>
          <div className={styles.formGroup}>
            <label>Member Since</label>
            <input type="text" value={joinedDate} disabled style={{ backgroundColor: '#f5f5f5', color: '#888', cursor: 'not-allowed' }} />
          </div>
          <button type="submit" className={styles.saveBtn} disabled={saving} style={{ marginTop: '10px' }}>
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}
