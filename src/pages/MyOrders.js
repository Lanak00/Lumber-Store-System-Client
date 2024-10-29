import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link from React Router
import OrderItem from '../components/orders/OrderItem'; 
import styles from '../components/orders/MyOrdersPage.module.css'; 

function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('active');
  
  const token = localStorage.getItem('token'); 
  const userRole = getUserRoleFromToken(token); 
  const userId = getUserIdFromToken(token); 

  const apiUrl =
    userRole === 'Client'
      ? `https://localhost:7046/api/Order/byClientId/${userId}` 
      : `https://localhost:7046/api/Order`; 

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(apiUrl, {
          headers: {
            'Content-Type': 'application/json',
             Authorization: `Bearer ${token}`,
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data = await response.json();
        setOrders(data);
        setFilteredOrders(data.filter(order => order.status === 0)); 
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [apiUrl, token]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFilteredOrders(
      orders.filter(order => (tab === 'active' ? order.status === 0 : order.status === 1))
    );
  };

  return (
    <div className={styles.ordersPage}>
      <div className={styles.tabs}>
        <span
          onClick={() => handleTabChange('active')}
          className={`${styles.tab} ${activeTab === 'active' ? styles.active : ''}`}
        >
          Active
        </span>
        <span
          onClick={() => handleTabChange('history')}
          className={`${styles.tab} ${activeTab === 'history' ? styles.active : ''}`}
        >
          History
        </span>
      </div>

      <div className={styles.ordersContainer}>
        {filteredOrders.map(order => (
          <Link 
            to={`/order/${order.id}`} 
            key={order.id} 
            className={styles.orderLink}
          >
            <OrderItem order={order} />
          </Link>
        ))}
      </div>
    </div>
  );
}

// Helper function to extract the user role from the JWT token
const getUserRoleFromToken = (token) => {
  const tokenPayload = JSON.parse(atob(token.split('.')[1]));
  return tokenPayload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
};

// Helper function to extract the user ID from the JWT token
const getUserIdFromToken = (token) => {
  const tokenPayload = JSON.parse(atob(token.split('.')[1]));
  return tokenPayload.userId;
};

export default MyOrdersPage;
