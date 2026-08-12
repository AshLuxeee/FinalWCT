import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import styles from './UserPages.module.css';
import { Trash2 } from 'lucide-react';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(items);
  }, []);

  const updateQuantity = (id, delta) => {
    const updated = cartItems.map((item) => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return { ...item, quantity: Math.max(1, newQty) };
      }
      return item;
    });
    setCartItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('cartUpdate'));
  };

  const removeItem = (id) => {
    const updated = cartItems.filter((item) => item.id !== id);
    setCartItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('cartUpdate'));
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    const orderData = {
      userId: currentUser?.uid || 'guest',
      customerName: currentUser?.displayName || 'Guest User',
      customerEmail: currentUser?.email || 'guest@example.com',
      items: cartItems.map(item => ({
        jewelryId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      total: calculateTotal(),
      status: 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      await addDoc(collection(db, 'orders'), orderData);
      localStorage.removeItem('cart');
      setCartItems([]);
      window.dispatchEvent(new Event('cartUpdate'));
      alert("Order placed successfully!");
      navigate('/user/orders');
    } catch (error) {
      alert("Error placing order: " + error.message);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <div className={styles.empty}>Your cart is empty. Browse jewelry to add items!</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          <div className={styles.cartList}>
            {cartItems.map((item) => (
              <div key={item.id} className={styles.cartItem}>
                <div className={styles.cartItemInfo}>
                  <img 
                    src={item.imageUrl} 
                    alt={item.name} 
                    className={styles.cartItemThumb} 
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/150' }}
                  />
                  <div className={styles.cartItemMeta}>
                    <h4>{item.name}</h4>
                    <p>${item.price.toFixed(2)}</p>
                  </div>
                </div>

                <div className={styles.quantityControl}>
                  <button className={styles.qtyBtn} onClick={() => updateQuantity(item.id, -1)}>-</button>
                  <span className={styles.qtyVal}>{item.quantity}</span>
                  <button className={styles.qtyBtn} onClick={() => updateQuantity(item.id, 1)}>+</button>
                </div>

                <button className={styles.deleteBtn} onClick={() => removeItem(item.id)}>
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          <div className={styles.cartSummary}>
            <h3>Summary</h3>
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Delivery</span>
              <span style={{ color: '#00b894', fontWeight: 600 }}>Free</span>
            </div>
            <div className={`${styles.summaryRow} ${styles.total}`}>
              <span>Total</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
            <button className={styles.checkoutBtn} onClick={handleCheckout}>
              Place Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
