import React from 'react';
import classes from './SortComponent.module.css'; // Import the CSS module

function SortComponent({ sortOrder, onSortChange }) {
  return (
    <div className={classes.sortContainer}>
      <select 
        value={sortOrder} 
        onChange={(e) => onSortChange(e.target.value)} 
        className={classes.sortSelect}
      >
        <option value="" disabled hidden>Sortiraj po ceni</option> 
        <option value="asc">Rastuce</option>
        <option value="desc">Opadajuce</option>
      </select>
    </div>
  );
}

export default SortComponent;
