import React, { useState } from 'react';
import classes from './ProductDetailsItem.module.css';

function ProductDetailsItem({ image, name, type, manufacturer, description, price, dimensions, priceUnit, onAddToCart }) {
  const [amount, setAmount] = useState(1);

  const increaseAmount = () => setAmount((prevAmount) => prevAmount + 1);
  const decreaseAmount = () => setAmount((prevAmount) => (prevAmount > 1 ? prevAmount - 1 : 1));
  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (categoryName === 'Drvo') {
      // Validate input to ensure it's not zero or negative
      if (value === '' || parseFloat(value) <= 0) {
        setAmount('1'); // Reset to 1 if value is zero or negative
      } else {
        setAmount(value);
      }
    }
  };

// Function to map the type to the appropriate product category
const getCategoryName = (type) => {
  switch (type) {
    case 0:
      return 'Plocasti materijali'; 
    case 1:
      return 'Drvo';  
    default:
      return 'Unknown'; 
  }
};

// Get the mapped category name
const categoryName = getCategoryName(type);

// Determine the unit based on the category
const unit = categoryName === 'Plocasti materijali' ? 'kom' : categoryName === 'Drvo' ? 'm³' : '';

  return (
    <div className={classes.productDetails}>
      {/* Left Column: Product Image */}
      <img src={image} alt={name} className={classes.productImage} />
      
      {/* Right Column: Product Details */}
      <div className={classes.productDetailsContent}>
        <h2 className={classes.productName}>{name}</h2>
        <p className={classes.productDescription}>{description}</p>
        <p className={classes.productType}>Tip: {categoryName}</p>
        <p className={classes.productManufacturer}>Proizvodjac: {manufacturer}</p>
        {type === 0 && (
          <p className={classes.productDimensions}>{dimensions}</p>
        )}
        <p className={classes.productPrice}>{price.toFixed(2)} RSD / {unit}</p>

        <div className={classes.actions}>
          <div className={classes.amountControl}>
            {categoryName === 'Plocasti materijali' ? (
              // Input field with buttons for 'Plocasti materijali'
              <>
                <button onClick={decreaseAmount} className={classes.decreaseButton}>-</button>
                <input type="text" value={amount} readOnly className={classes.amountInput} />
                <button onClick={increaseAmount} className={classes.increaseButton}>+</button>
              </>
            ) : (
              // Input field for 'Drvo' to enter cubic meters
              <div className={classes.cubicMeterControl}>
              <input
                type="number"
                min="1"
                step="0.01"
                value={amount}
                onChange={handleAmountChange}
                className={classes.amountInput}
                inputMode="decimal"
              />
              <span className={classes.cubicMeterLabel}>m³</span>
            </div>
            )}
          </div>
          <button onClick={() => onAddToCart(name, amount)} className={classes.addToCartButton}>
            Dodaj u korpu
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailsItem;
