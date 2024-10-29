import React, { useEffect, useState } from 'react';
import styles from './OrderItem.module.css';

function OrderItem({ order }) {
  const [userRole, setUserRole] = useState(null);
  const [clientName, setClientName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const tokenPayload = JSON.parse(atob(token.split('.')[1])); 
      setUserRole(tokenPayload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]);
    }
  }, []);


  useEffect(() => {
    const fetchClientName = async () => {
      try {
        const response = await fetch(`https://localhost:7046/api/Client/${order.clientId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, 
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch client details');
        }

        const data = await response.json();
        setClientName(data.firstName + " "+ data.lastName); 
      } catch (error) {
        console.error('Error fetching client name:', error);
      }
    };

    if (userRole === 'Employee' && order.clientId) {
      fetchClientName(); 
    }
  }, [userRole, order.clientId]);

  return (
    <div className={styles.orderItem}>
      <p><strong>Datum:</strong> {new Date(order.date).toLocaleDateString()}</p>
      <p><strong>Cena:</strong> {order.totalPrice} RSD</p>

      
      {userRole === 'Employee' && clientName && (
        <p><strong>Klijent:</strong> {clientName}</p>
      )}

      <div className={styles.productList}>
        <h4>Proizvodi:</h4>
        <ul>
          {order.items.map((item, index) => (
            <li key={index}>{item.productName}</li>
          ))}
        </ul>
      </div>

      {order.cuttingLists.length > 0 && (
        <div className={styles.cuttingList}>
          <h4>Krojne liste:</h4>
          <ul>
            {order.cuttingLists.map((cl, index) => (
              <li key={index}>{cl.productName}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default OrderItem;
