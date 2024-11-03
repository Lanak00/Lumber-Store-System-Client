import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import classes from './ProductDetailsItem.module.css';
import NewProductForm from './NewProductForm';

function ProductDetailsItem({ image, name, type, manufacturer, description, price, dimensions, priceUnit, onAddToCart, onShowCuttingList }) {
  const [amount, setAmount] = useState(1); 
  const [userRole, setUserRole] = useState(null);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false); // Control for edit form
  const [productData, setProductData] = useState(null); // State to store fetched product data
  const id = useParams();
  const navigate = useNavigate();

  console.log(id);

  // Fetch the user role from the token if available
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      setUserRole(tokenPayload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]);
      console.log(userRole)
    }
  }, [userRole]);

  const increaseAmount = () => setAmount((prevAmount) => prevAmount + 1);
  const decreaseAmount = () => setAmount((prevAmount) => (prevAmount > 1 ? prevAmount - 1 : 1));

  const handleAmountChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (isNaN(value)) {
      setAmount('');
    } else if (value >= 1) {
      setAmount(value);
    }
  };

  const handleDeleteProduct = async () => {
    const confirmDelete = window.confirm(`Are you sure you want to delete the product: ${name}?`);
    if (!confirmDelete) return;

    try {
      const response = await fetch(`https://localhost:7046/api/Product/${id.productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete product');
      alert('Product deleted successfully');
      navigate('/');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  const openEditForm = async () => {
    try {
      const response = await fetch(`https://localhost:7046/api/Product/${id.productId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch product data');

      const data = await response.json();
      setProductData(data); // Set fetched product data in state
      setIsEditFormOpen(true); // Open the form after data is fetched
    } catch (error) {
      console.error('Error fetching product data:', error);
      alert('Failed to load product data for editing');
    }
  };

  const closeEditForm = () => {
    setIsEditFormOpen(false);
    setProductData(null); // Clear fetched data when form is closed
  };

  const getCategoryName = (type) => {
    switch (type) {
      case 0: return 'Plocasti materijali';
      case 1: return 'Drvo';
      default: return 'Unknown';
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
                  <input type="number" min="1" value={amount} onChange={handleAmountChange} className={classes.amountInput} />
                  <button onClick={increaseAmount} className={classes.increaseButton}>+</button>
                </>
              ) : (
                <div className={classes.cubicMeterControl}>
                  <input type="number" min="0" step="0.01" value={amount} onChange={handleAmountChange} className={classes.amountInput} inputMode="decimal" />
                  <span className={classes.cubicMeterLabel}>m³</span>
                </div>
              )}
            </div>
            <button onClick={() => onAddToCart(name, amount)} className={classes.addToCartButton}>Dodaj u korpu</button>
            {type === 0 && <button onClick={onShowCuttingList} className={classes.addCuttingListButton}>Napravi krojnu listu</button>}
          </div>
        )}

        {(userRole === 'Employee' || userRole === 'Administrator') && (
          <div className={classes.buttonGroup}>
            <button onClick={handleDeleteProduct} className={classes.deleteButton}>Obrisi</button>
            <button onClick={openEditForm} className={classes.editButton}>Izmeni</button>
          </div>
        )}
      </div>

      {isEditFormOpen && productData && (
        <NewProductForm
          onClose={closeEditForm}
          isEdit={true}
          existingProduct={{
            code: productData.id,
            name: productData.name,
            description: productData.description,
            manufacturer: productData.manufacturer,
            price: productData.price,
            category: productData.category,
            dimensionsId: productData.dimensions.id,
            unit: productData.unit,
            image: productData.image
          }}
        />
      )}
    </div>
  );
}

export default ProductDetailsItem;
