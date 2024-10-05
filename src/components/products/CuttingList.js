import React, { useState} from 'react';
import classes from './CuttingList.module.css';

function CuttingList({ hideCuttingList, handleAddCuttingListToCart, productPrice }) {
  const [cuttingList, setCuttingList] = useState([]);
  const [currentEntry, setCurrentEntry] = useState({ width: '', height: '', amount: '' });
  const [numberOfBoards, setNumberOfBoards] = useState(0); // State to store the number of boards
  const [totalPrice, setTotalPrice] = useState(0); // State to store the total price

  const isFormValid = currentEntry.width && currentEntry.height && currentEntry.amount;

  // Function to handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentEntry({ ...currentEntry, [name]: value });
  };

  // Function to call API and calculate number of boards
  const calculateBoards = async (cuttingList) => {
    try {
      const response = await fetch('https://localhost:44364/api/Cutting/calculate-boards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          boardWidth: 200, // Example width, adjust based on your app logic
          boardHeight: 100, // Example height
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
      setNumberOfBoards(0); // Reset if API call fails
      setTotalPrice(0);
    }
  };

  // Add an item to the cutting list and calculate the number of boards
  const addCuttingListItem = () => {
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
    hideCuttingList(); // Hides the cutting list UI
  };

  // Handle adding the cutting list to the cart
  const handleAddToCart = () => {
    handleAddCuttingListToCart(cuttingList, numberOfBoards, totalPrice); // Adds the cutting list to the cart
    clearCuttingList(); // Clears the cutting list after adding to cart
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
        />
        <input
          type="number"
          name="height"
          placeholder="Visina"
          value={currentEntry.height}
          onChange={handleInputChange}
          className={classes.cuttingListInput}
        />
        <input
          type="number"
          name="amount"
          placeholder="Kolicina"
          value={currentEntry.amount}
          onChange={handleInputChange}
          className={classes.cuttingListInput}
        />
        <button 
          onClick={addCuttingListItem} 
          className={classes.addCuttingListItemButton}
          disabled={!isFormValid} 
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
          <span>Broj ploca: {numberOfBoards} </span>
          <span>Cena: {totalPrice.toLocaleString()} RSD</span> {/* Format the price */}
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
