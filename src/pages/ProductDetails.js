import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams to get the product ID from the URL
import ProductDetailsItem from '../components/products/ProductDetailsItem';

function ProductDetailsPage() {
  const { productId } = useParams(); // Get the product ID from the URL
  const [product, setProduct] = useState(null); // State to hold the product details
  const [isLoading, setIsLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(null); // State to handle errors

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true); // Start loading
        const response = await fetch(`https://localhost:44364/api/Product/${productId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch product details.');
        }

        const data = await response.json();
        setProduct(data); // Set the product data
        setIsLoading(false); // End loading
      } catch (err) {
        setError(err.message);
        setIsLoading(false); // End loading
      }
    };

    fetchProduct(); // Call the fetch function
  }, [productId]); // Effect depends on productId

  const handleAddToCart = (name, amount) => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    // Check if the product already exists in the cart
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
    />
  );
}

export default ProductDetailsPage;
