import React, { useState } from 'react';
import classes from './CuttingList.module.css';

function CuttingList({ hideCuttingList, handleAddCuttingListToCart, productPrice }) {
  const [cuttingList, setCuttingList] = useState([]);
  const [currentEntry, setCurrentEntry] = useState({ width: '', height: '', amount: '' });
  const [numberOfBoards, setNumberOfBoards] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false); // New loading state

  // Define board width and height here
  const boardWidth = 275;
  const boardHeight = 208;

  const isFormValid = currentEntry.width && currentEntry.height && currentEntry.amount && 
                      parseInt(currentEntry.width) <= boardWidth && 
                      parseInt(currentEntry.height) <= boardHeight;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentEntry({ ...currentEntry, [name]: value });
  };

  const calculateBoards = async (cuttingList) => {
    setIsLoading(true); 
    try {
      const response = await fetch('https://localhost:7046/api/Cutting/CalculateBoards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          boardWidth,
          boardHeight,
          cuttingList: cuttingList.map(item => ({
            width: parseInt(item.width, 10),
            length: parseInt(item.height, 10),
            amount: parseInt(item.amount, 10),
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Error calculating boards');
      }

      const data = await response.json();
      const numberOfBoards = data.numberOfBoards;
      setNumberOfBoards(numberOfBoards);

      // Calculate the total price based on the product price and number of boards
      const calculatedPrice = numberOfBoards * productPrice;
      setTotalPrice(calculatedPrice);
    } catch (error) {
      console.error('Error calculating boards:', error);
      setNumberOfBoards(0);
      setTotalPrice(0);
    } finally {
      setIsLoading(false);
    }
  };

  // Add an item to the cutting list and calculate the number of boards
  const addCuttingListItem = () => {
    if (!isFormValid) return;

    const updatedCuttingList = [...cuttingList, currentEntry];
    setCuttingList(updatedCuttingList);
    localStorage.setItem('cuttingList', JSON.stringify(updatedCuttingList));

    // Clear the input fields
    setCurrentEntry({ width: '', height: '', amount: '' });

    // Call the API to calculate the number of boards and update the price
    calculateBoards(updatedCuttingList);
  };

  // Clear the cutting list and hide it
  const clearCuttingList = () => {
    setCuttingList([]);
    localStorage.removeItem('cuttingList');
    hideCuttingList();
  };

  // Handle adding the cutting list to the cart
  const handleAddToCart = () => {
    handleAddCuttingListToCart(cuttingList, numberOfBoards, totalPrice);
    clearCuttingList();
  };

  return (
    <div className={classes.cuttingListContainer}>
      <div className={classes.inputRow}>
        <input
          type="number"
          name="width"
          placeholder="Sirina"
          value={currentEntry.width}
          onChange={handleInputChange}
          className={classes.cuttingListInput}
          min="1"
          max={boardWidth} // Adding max validation in input element
        />
        <input
          type="number"
          name="height"
          placeholder="Visina"
          value={currentEntry.height}
          onChange={handleInputChange}
          className={classes.cuttingListInput}
          min="1"
          max={boardHeight} // Adding max validation in input element
        />
        <input
          type="number"
          name="amount"
          placeholder="Kolicina"
          value={currentEntry.amount}
          onChange={handleInputChange}
          className={classes.cuttingListInput}
          min="1"
        />
        <button
          onClick={addCuttingListItem}
          className={classes.addCuttingListItemButton}
          disabled={!isFormValid || isLoading} // Disable button while loading
        >
          +
        </button>
      </div>

      <ul className={classes.cuttingListItems}>
        {cuttingList.map((item, index) => (
          <li key={index} className={classes.cuttingListItem}>
            <span>{item.width} x {item.height} - {item.amount} kom</span>
            <button
              className={classes.removeCuttingListItemButton}
              onClick={() => {
                const updatedList = cuttingList.filter((_, i) => i !== index);
                setCuttingList(updatedList);
                localStorage.setItem('cuttingList', JSON.stringify(updatedList));

                // Recalculate the boards and price after removing an item
                calculateBoards(updatedList);
              }}
            >
              Ukloni
            </button>
          </li>
        ))}
      </ul>

      {cuttingList.length > 0 && (
        <div className={classes.totalPriceContainer}>
          <span>Broj ploca: {isLoading ? 'Loading...' : numberOfBoards}</span> {/* Loader here */}
          <span>Cena: {totalPrice.toLocaleString()} RSD</span>
        </div>
      )}

      <div className={classes.buttonsContainer}>
        <button className={classes.cancelButton} onClick={clearCuttingList}>Odustani</button>
        <button className={classes.addToCartButton} onClick={handleAddToCart}>Dodaj u korpu</button>
      </div>
    </div>
  );
}

export default CuttingList;
