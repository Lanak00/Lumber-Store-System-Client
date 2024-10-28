import { Route, Routes } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import './App.css';
import Layout from './components/layout/Layout';
import AllProductsPage from './pages/Products';
import ProductDetailsPage from './pages/ProductDetails';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import CartPage from './pages/Cart';
import MyOrdersPage from './pages/MyOrders';
import OrderDetailsPage from './pages/OrderDetails';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true); 
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true); 
    setKey(prevKey => prevKey + 1); 
  };

  return (
    <Layout isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} key={key}>
      <Routes>
        <Route exact path='/' element = {<AllProductsPage/>}/>
        <Route path="/product/:productId" element={<ProductDetailsPage />} />
        <Route path="/login" element={<LoginPage setIsLoggedIn={handleLoginSuccess} />}/>
        <Route path="/register" element = {<RegisterPage/>}/>
        <Route path="/cart" element={<CartPage />} /> 
        <Route path="/orders" element={<MyOrdersPage />} />
        <Route path="/order/:id" element={<OrderDetailsPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
