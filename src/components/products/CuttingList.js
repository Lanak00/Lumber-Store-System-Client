import React, { useState } from 'react';
import classes from './CuttingList.module.css';

function CuttingList() {
  const [cuttingList, setCuttingList] = useState([]);
  const [currentEntry, setCurrentEntry] = useState({ width: '', height: '', amount: '' });

  const isFormValid = currentEntry.width && currentEntry.height && currentEntry.amount;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentEntry({ ...currentEntry, [name]: value });
  };

  const addCuttingListItem = () => {
    const updatedCuttingList = [...cuttingList, currentEntry];
    setCuttingList(updatedCuttingList);
    localStorage.setItem('cuttingList', JSON.stringify(updatedCuttingList));
    setCurrentEntry({ width: '', height: '', amount: '' });
  };

  return (
    <div className={classes.cuttingListContainer}>
      <div className={classes.inputRow}>
        <input
          type="number"
          name="width"
          placeholder="Width"
          value={currentEntry.width}
          onChange={handleInputChange}
          className={classes.cuttingListInput}
        />
        <input
          type="number"
          name="height"
          placeholder="Height"
          value={currentEntry.height}
          onChange={handleInputChange}
          className={classes.cuttingListInput}
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount"
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
              }}
            >
              Ukloni
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CuttingList;
