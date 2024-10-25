import React, { useState, useEffect } from 'react';
import CartItemList from '../components/shoppingCart/CartItemList';

function CartPage() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(storedCartItems);
  }, []);

  // Function to remove an item from the cart
  const removeItem = (itemId) => {
    const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
    setCartItems(updatedCartItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
  };

  const handleOrder = async () => {
    const token = localStorage.getItem('token'); 
    const clientId = getClientIdFromToken(token); 
    const orderDate = new Date().toISOString().split('T')[0];
    const orderItems = cartItems.map(item => ({
      amount: item.amount,
      productId: item.id 
    }));
  
    const orderData = {
      date: orderDate,
      status: 1, 
      clientId: clientId, 
      items: orderItems
    };
  
    try {
      const response = await fetch('https://localhost:7046/api/Order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          /*'Authorization': `Bearer ${token}`*/
        },
        body: JSON.stringify(orderData)
      });
  
      console.log(JSON.stringify(orderData))

      // Handle non-JSON response
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();  // Parse as JSON
      console.log('Order placed successfully:', data);
    } else {
      const text = await response.text();  // Parse as plain text
      console.log('Order placed successfully:', text);
    }

      setCartItems([]);
      localStorage.removeItem('cartItems'); 
      alert('Order placed successfully!');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Error placing order. Please try again.');
    }
  };
  
  // Helper function to extract clientId from the token
  const getClientIdFromToken = (token) => {
    const tokenPayload = JSON.parse(atob(token.split('.')[1]));
    return tokenPayload.userId; 
  };

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.amount, 0);

  return (
    <div>
      <h2>Vasa korpa</h2>
      <CartItemList cartItems={cartItems} removeItem={removeItem} />
      <div>
        <h3 style={{ textAlign: 'right', fontWeight: 'bold', marginTop: '20px', fontSize: '1.2rem' }}>Ukupna cena: {totalPrice.toFixed(2)} RSD</h3>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            {cartItems.length > 0 && (
                <button 
                style={{
                    backgroundColor: '#5abb5f', 
                    color: '#fff', 
                    padding: '10px 20px', 
                    fontSize: '1rem', 
                    border: 'none', 
                    borderRadius: '5px', 
                    cursor: 'pointer'
                }}
                onClick={handleOrder}
                >
                Poruči
                </button>
            )}
        </div>
      </div>
    </div>
  );
}

export default CartPage;
