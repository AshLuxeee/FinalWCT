import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, onSnapshot } from 'firebase/firestore';
import styles from './UserPages.module.css';
import { ShoppingCart, Eye } from 'lucide-react';

export default function BrowseJewelry() {
  const [jewelry, setJewelry] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);

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

  const handleAddToCart = (item) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingIndex = cart.findIndex((cartItem) => cartItem.id === item.id);
    if (existingIndex > -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${item.name} added to cart!`);
    window.dispatchEvent(new Event('cartUpdate')); // trigger topbar badge update
  };

  const filteredJewelry = filter === 'all' 
    ? jewelry 
    : jewelry.filter(item => item.category === filter);

  return (
    <div className={styles.container}>
      <div className={styles.filterBar}>
        {[
          { id: 'all', label: 'All' },
          { id: 'ring', label: 'Rings' },
          { id: 'necklace', label: 'Necklaces' },
          { id: 'earring', label: 'Earrings' },
          { id: 'bangle', label: 'Bangles' },
          { id: 'set', label: 'Sets' }
        ].map((cat) => (
          <button 
            key={cat.id} 
            className={filter === cat.id ? `${styles.filterBtn} ${styles.active}` : styles.filterBtn}
            onClick={() => setFilter(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className={styles.loader}>Loading items...</div>
      ) : (
        <div className={styles.grid}>
          {filteredJewelry.map((item) => (
            <div key={item.id} className={styles.card}>
              <img 
                src={item.imageUrl} 
                alt={item.name} 
                className={styles.image}
                onError={(e) => { e.target.src = 'https://via.placeholder.com/150' }}
              />
              <div className={styles.cardBody}>
                <h3>{item.name}</h3>
                <p className={styles.price}>${item.price.toFixed(2)}</p>
                <div className={styles.actions}>
                  <button className={styles.viewBtn} onClick={() => setSelectedItem(item)}>
                    <Eye size={16} /> Details
                  </button>
                  <button className={styles.cartBtn} onClick={() => handleAddToCart(item)}>
                    <ShoppingCart size={16} /> Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredJewelry.length === 0 && (
            <div className={styles.empty}>No jewelry found in this category.</div>
          )}
        </div>
      )}

      {selectedItem && (
        <div className={styles.modalOverlay} onClick={() => setSelectedItem(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <img 
              src={selectedItem.imageUrl} 
              alt={selectedItem.name} 
              className={styles.modalImage}
              onError={(e) => { e.target.src = 'https://via.placeholder.com/150' }}
            />
            <div className={styles.modalBody}>
              <h2>{selectedItem.name}</h2>
              <p className={styles.modalCategory}>Category: {selectedItem.category}</p>
              <p className={styles.modalPrice}>${selectedItem.price.toFixed(2)}</p>
              <p className={styles.modalDesc}>{selectedItem.description || 'No description available.'}</p>
              <div className={styles.modalActions}>
                <button className={styles.modalCartBtn} onClick={() => { handleAddToCart(selectedItem); setSelectedItem(null); }}>
                  Add to Cart
                </button>
                <button className={styles.modalCloseBtn} onClick={() => setSelectedItem(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
