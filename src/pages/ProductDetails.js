import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; 
import ProductDetailsItem from '../components/products/ProductDetailsItem';
import CuttingList from '../components/products/CuttingList';

function ProductDetailsPage() {
  const { productId } = useParams(); 
  const [product, setProduct] = useState(null); 
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [showCuttingList, setShowCuttingList] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true); 
        const response = await fetch(`https://localhost:44364/api/Product/${productId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch product details.');
        }

        const data = await response.json();
        setProduct(data); 
        setIsLoading(false); 
      } catch (err) {
        setError(err.message);
        setIsLoading(false); 
      }
    };

    fetchProduct(); 
  }, [productId]); 

  const handleAddToCart = (name, amount) => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
   
    const existingItemIndex = cartItems.findIndex(item => item.id === productId);

    if (existingItemIndex !== -1) {
      // If it exists, update the quantity
      cartItems[existingItemIndex].amount += amount;
    } else {
      // If it doesn't exist, add the product to the cart
      cartItems.push({
        id: productId,
        name,
        image: product.image,
        manufacturer: product.manufacturer,
        dimensions: product.dimensions,
        price: product.price,
        amount,
      });
    }

     // Save the updated cart to localStorage
     localStorage.setItem('cartItems', JSON.stringify(cartItems));

     alert(`Added ${amount} of ${name} to cart!`);
  }
  const handleShowCuttingList = () => {
    setShowCuttingList(true); // Show the cutting list component
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!product) {
    return <p>Product not found!</p>;
  }

  // Format the dimensions into a string
  const dimensionsText = `${product.dimensions.length}x${product.dimensions.width}`;

  return (
    <div>
      <ProductDetailsItem
      image={product.image}
      name={product.name}
      type={product.category}
      manufacturer={product.manufacturer}
      description={product.description}
      price={product.price}
      dimensions={dimensionsText} // Pass the formatted dimensions
      priceUnit={product.priceUnit}
      onAddToCart={handleAddToCart}
      onShowCuttingList={handleShowCuttingList}
    />
    {showCuttingList && <CuttingList />}
    </div>
  );
}

export default ProductDetailsPage;
