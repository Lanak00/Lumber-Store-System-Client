import React, { useState, useEffect } from 'react';

function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('active'); 
  const userId = getUserIdFromToken(localStorage.getItem('token')); 

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`https://localhost:7046/api/Order/byClientId/${userId}`);
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
  }, [userId]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFilteredOrders(orders.filter(order => (tab === 'active' ? order.status === 0 : order.status === 1)));
  };

  return (
    <div>
      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        <span
          onClick={() => handleTabChange('active')}
          style={{
            cursor: 'pointer',
            fontWeight: activeTab === 'active' ? 'bold' : 'normal',
            fontSize: activeTab === 'active' ? '1.2rem' : '1rem',
            marginRight: '20px'
          }}
        >
          Active
        </span>
        <span
          onClick={() => handleTabChange('history')}
          style={{
            cursor: 'pointer',
            fontWeight: activeTab === 'history' ? 'bold' : 'normal',
            fontSize: activeTab === 'history' ? '1.2rem' : '1rem'
          }}
        >
          History
        </span>
      </div>

      <ul>
        {filteredOrders.map(order => (
          <li key={order.id} style={{ marginBottom: '15px', listStyle: 'none', padding: '10px', borderBottom: '1px solid #ccc' }}>
            <p>Order ID: {order.id}</p>
            <p>Date: {new Date(order.date).toLocaleDateString()}</p>
            <p>Status: {order.status === 0 ? 'Active' : 'Completed'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

const getUserIdFromToken = (token) => {
  const tokenPayload = JSON.parse(atob(token.split('.')[1]));
  return tokenPayload.userId;
};

export default MyOrdersPage;
