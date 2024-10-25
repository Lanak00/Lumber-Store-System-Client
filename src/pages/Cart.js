import React, { useState, useEffect } from 'react';
import CartItemList from '../components/shoppingCart/CartItemList'; // Restored the CartItemList
import classes from './../components/shoppingCart/CartItem.module.css';

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [cuttingCartItems, setCuttingCartItems] = useState([]);

  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(storedCartItems);

    const storedCuttingCartItems = JSON.parse(localStorage.getItem('cuttingCartItems')) || [];
    setCuttingCartItems(storedCuttingCartItems);
  }, []);

  const removeItem = (itemId) => {
    const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
    setCartItems(updatedCartItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
  };

  const removeCuttingListItem = (productId) => {
    const updatedCuttingCartItems = cuttingCartItems.filter((item) => item.productId !== productId);
    setCuttingCartItems(updatedCuttingCartItems);
    localStorage.setItem('cuttingCartItems', JSON.stringify(updatedCuttingCartItems));
  };

  const handleOrder = async () => {
    const token = localStorage.getItem('token');
    const clientId = getClientIdFromToken(token);
    const orderDate = new Date().toISOString().split('T')[0];

    const orderItems = cartItems.map(item => ({
      amount: item.amount,
      productId: item.id
    }));

    // Prepare cutting list items for the order
    const cuttingLists = cuttingCartItems.map(item => ({
      productId: item.productId,
      items: item.cuttingList.map(listItem => ({
        width: parseInt(listItem.dimensions.split('x')[0], 10),
        length: parseInt(listItem.dimensions.split('x')[1], 10),
        amount: parseInt(listItem.amount, 10),
      })),
    }));

    const orderData = {
      date: orderDate,
      status: 1, // Active status for the order
      clientId: clientId,
      items: orderItems,
      cuttingLists: cuttingLists, // Include the cutting lists here
    };

    try {
      const response = await fetch('https://localhost:44364/api/Order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        console.log('Order placed successfully:', data);
      } else {
        const text = await response.text();
        console.log('Order placed successfully:', text);
      }

      setCartItems([]);
      setCuttingCartItems([]);
      localStorage.removeItem('cartItems');
      localStorage.removeItem('cuttingCartItems');
      alert('Order placed successfully!');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Error placing order. Please try again.');
    }
  };

  const getClientIdFromToken = (token) => {
    const tokenPayload = JSON.parse(atob(token.split('.')[1]));
    return tokenPayload.userId;
  };

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.amount, 0) +
    cuttingCartItems.reduce((total, item) => total + item.totalPrice, 0);

  return (
    <div>
      <h2>Vasa korpa</h2>

      {/* Render regular cart items using CartItemList */}
      <CartItemList cartItems={cartItems} removeItem={removeItem} />

      {/* Render cutting cart items */}
      {cuttingCartItems.length > 0 && (
        <div className="cutting-cart-section">
          <h3>Krojne liste</h3>
          {cuttingCartItems.map((cuttingItem, index) => (
            <div className={classes.cartItem} key={index}>
              {/* Product Image */}
              <img
                src={cuttingItem.productImage}  // Assuming productImageUrl is stored in the cuttingCartItems
                alt={cuttingItem.productName}
                className={classes.cartItemImage}
              />
              <div className={classes.cartItemDetails}>
                <h3>{cuttingItem.productName}</h3>
                <ul>
                  {cuttingItem.cuttingList.map((listItem, listIndex) => (
                    <li key={listIndex}>
                      {listItem.dimensions} - {listItem.amount} kom
                    </li>
                  ))}
                </ul>
                <p>Cena: {cuttingItem.totalPrice} RSD</p>
              </div>
              <div className={classes.cartItemActions}>
                <button className={classes.removeButton} onClick={() => removeCuttingListItem(cuttingItem.productId)}>
                  Ukloni
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div>
        <h3 style={{ textAlign: 'right', fontWeight: 'bold', marginTop: '20px', fontSize: '1.2rem' }}>
          Ukupna cena: {totalPrice.toFixed(2)} RSD
        </h3>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          {(cartItems.length > 0 || cuttingCartItems.length > 0) && (
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