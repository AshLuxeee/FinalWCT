import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import styles from './AdminPages.module.css';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

export default function ManageJewelry() {
  const [jewelry, setJewelry] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  
  // Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('ring');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'jewelry'), (snapshot) => {
      const items = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      setJewelry(items);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching jewelry:", error);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const openAddModal = () => {
    setEditItem(null);
    setName('');
    setPrice('');
    setCategory('ring');
    setDescription('');
    setImageUrl('');
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditItem(item);
    setName(item.name);
    setPrice(item.price);
    setCategory(item.category || 'ring');
    setDescription(item.description || '');
    setImageUrl(item.imageUrl || '');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      name,
      price: parseFloat(price),
      category,
      description,
      imageUrl: imageUrl || 'https://via.placeholder.com/150',
      updatedAt: new Date().toISOString()
    };

    try {
      if (editItem) {
        await updateDoc(doc(db, 'jewelry', editItem.id), data);
      } else {
        data.createdAt = new Date().toISOString();
        await addDoc(collection(db, 'jewelry'), data);
      }
      setShowModal(false);
    } catch (error) {
      alert("Error saving item: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this jewelry item?")) {
      try {
        await deleteDoc(doc(db, 'jewelry', id));
      } catch (error) {
        alert("Error deleting item: " + error.message);
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Jewelry Collection</h2>
        <button className={styles.addBtn} onClick={openAddModal}>
          <Plus size={18} />
          Add Jewelry
        </button>
      </div>

      {loading ? (
        <div className={styles.loader}>Loading jewelry...</div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Description</th>
                <th>Actions</th>
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
                  <td className={styles.price}>${item.price.toFixed(2)}</td>
                  <td className={styles.descCol}>{item.description}</td>
                  <td>
                    <div className={styles.actions}>
                      <button className={styles.editBtn} onClick={() => openEditModal(item)}>
                        <Edit2 size={16} />
                      </button>
                      <button className={styles.deleteBtn} onClick={() => handleDelete(item.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {jewelry.length === 0 && (
                <tr>
                  <td colSpan="6" className={styles.empty}>No jewelry items found. Click "Add Jewelry" to create one.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>{editItem ? 'Edit Jewelry' : 'Add New Jewelry'}</h3>
              <button className={styles.closeBtn} onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Jewelry Name</label>
                <input 
                  type="text" 
                  required 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="ring">Ring</option>
                    <option value="necklace">Necklace</option>
                    <option value="earring">Earring</option>
                    <option value="bangle">Bangle</option>
                    <option value="set">Set</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Price ($)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    required 
                    value={price} 
                    onChange={(e) => setPrice(e.target.value)} 
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Image URL</label>
                <input 
                  type="text" 
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl} 
                  onChange={(e) => setImageUrl(e.target.value)} 
                />
              </div>
              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea 
                  rows="4" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <button type="submit" className={styles.submitBtn}>
                {editItem ? 'Save Changes' : 'Create Item'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
