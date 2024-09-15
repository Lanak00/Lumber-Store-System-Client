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
        <option value="" disabled hidden>Sort by Price</option> 
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>
  );
}

export default SortComponent;
