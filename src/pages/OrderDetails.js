import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from '../components/orders/OrderDetailsPage.module.css'; 

function OrderDetailsPage() {
  const { id } = useParams(); // Get the order ID from the route
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`https://localhost:7046/api/Order/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch order');
        }
        const data = await response.json();
        setOrder(data);
      } catch (error) {
        console.error('Error fetching order:', error);
      }
    };

    fetchOrder();
  }, [id]);

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
    </div>
  );
}

export default OrderDetailsPage;
