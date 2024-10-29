import React, { useState, useEffect } from 'react';
import classes from './ProductDetailsItem.module.css';

function ProductDetailsItem({ 
  image, name, type, manufacturer, description, 
  price, dimensions, priceUnit, onAddToCart, onShowCuttingList 
}) {
  const [amount, setAmount] = useState(''); // Initialize as an empty string
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const tokenPayload = JSON.parse(atob(token.split('.')[1])); // Decode the token
      setUserRole(tokenPayload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]);
    }
  }, []);

  const increaseAmount = () => setAmount((prevAmount) => (prevAmount ? parseFloat(prevAmount) + 1 : 1));
  const decreaseAmount = () => setAmount((prevAmount) => (prevAmount > 1 ? parseFloat(prevAmount) - 1 : 1));

  const handleAmountChange = (e) => {
    const value = e.target.value;

    // Allow empty input, but validate only when it's not empty
    if (value === '' || parseFloat(value) >= 0) {
      setAmount(value); // Update the state to allow user input
    }
  };

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

  const categoryName = getCategoryName(type);
  const unit = categoryName === 'Plocasti materijali' ? 'kom' : categoryName === 'Drvo' ? 'm³' : '';

  return (
    <div className={classes.productDetails}>
      <img src={image} alt={name} className={classes.productImage} />

      <div className={classes.productDetailsContent}>
        <h2 className={classes.productName}>{name}</h2>
        <p className={classes.productDescription}>{description}</p>
        <p className={classes.productType}>Tip: {categoryName}</p>
        <p className={classes.productManufacturer}>Proizvodjac: {manufacturer}</p>
        {type === 0 && <p className={classes.productDimensions}>{dimensions}</p>}
        <p className={classes.productPrice}>{price.toFixed(2)} RSD / {unit}</p>

        {userRole === 'Client' && (
          <div className={classes.actions}>
            <div className={classes.amountControl}>
              {categoryName === 'Plocasti materijali' ? (
                <>
                  <button onClick={decreaseAmount} className={classes.decreaseButton}>-</button>
                  <input
                    type="text"
                    value={amount}
                    onChange={handleAmountChange}
                    className={classes.amountInput}
                  />
                  <button onClick={increaseAmount} className={classes.increaseButton}>+</button>
                </>
              ) : (
                <div className={classes.cubicMeterControl}>
                  <input
                    type="number"
                    min="0"
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

            {type === 0 && (
              <button onClick={onShowCuttingList} className={classes.addCuttingListButton}>
                Napravi krojnu listu
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetailsItem;
