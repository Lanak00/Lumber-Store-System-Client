import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from '../components/orders/OrderDetailsPage.module.css';

function OrderDetailsPage() {
  const { id } = useParams(); 
  const [order, setOrder] = useState(null);
  const [showModal, setShowModal] = useState(false); 
  const token = localStorage.getItem('token');
  const userRole = getUserRoleFromToken(token);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`https://localhost:7046/api/Order/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch order');
        }
        const data = await response.json();
        setOrder(data);
        console.log(data);
      } catch (error) {
        console.error('Error fetching order:', error);
      }
    };

    fetchOrder();
  }, [id]);

  const markAsFinished = async () => {
    try {
      const response = await fetch(`https://localhost:7046/api/Order`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...order, status: 1 }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      alert('Order marked as finished!');
      setOrder({ ...order, status: 1 }); 
      setShowModal(false); 
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to mark order as finished.');
    }
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  if (!order) return <p>Loading...</p>;

  return (
    <div className={styles.orderContainer}>
      <h1>Porudzbina #{order.id}</h1>
      <p><strong>Datum:</strong> {new Date(order.date).toLocaleDateString()}</p>
      <p><strong>Cena:</strong> {order.totalPrice} RSD</p>

      <div className={styles.productList}>
        <h4>Proizvodi:</h4>
        <ul>
          {order.items.map((item, index) => (
            <li key={index} className={styles.productItem}>
              <img src={item.productImage} alt={item.productName} className={styles.productImage} />
              <div>
                <p><strong>{item.productName}</strong></p>
                <p>Kolicina: {item.quantity}</p>
                <p>Cena: {item.price} RSD</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {order.cuttingLists.length > 0 && (
        <div className={styles.cuttingList}>
          <h4>Krojne liste:</h4>
          {order.cuttingLists.map((cl, index) => (
            <div key={index} className={styles.cuttingListItem}>
              <img 
                src={cl.image} 
                alt={cl.productName} 
                className={styles.cuttingListImage} 
              />
              <div className={styles.cuttingListDetails}>
                <p><strong>{cl.productName}</strong></p>
                <p>Cena: {cl.price} RSD</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {userRole === 'Employee' && order.status === 0 && (
        <div className={styles.buttonContainer}>
          <button 
            className={styles.finishButton} 
            onClick={openModal}
          >
            Oznaci kao zavrseno
          </button>
          <button className={styles.generatePdfButton}>
            Generisi Krojnu listu
          </button>
        </div>
      )}

      {/* Modal Popup */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <p>Jeste li sigurni da zelite da zavrsite porudzbinu?</p>
            <div className={styles.modalButtons}>
              <button onClick={markAsFinished} className={styles.confirmButton}>
                Potvrdi
              </button>
              <button onClick={closeModal} className={styles.cancelButton}>
                Otkazi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to extract the user role from the JWT token
const getUserRoleFromToken = (token) => {
  const tokenPayload = JSON.parse(atob(token.split('.')[1]));
  return tokenPayload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
};

export default OrderDetailsPage;
