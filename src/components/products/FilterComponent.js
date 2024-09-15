import React, { useState } from 'react';
import { FaFilter } from 'react-icons/fa';
import classes from './FilterComponent.module.css'; // Importing the CSS module correctly

function FilterComponent({ typeFilter, onTypeChange, minPrice, maxPrice, onMinPriceChange, onMaxPriceChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div style={{ position: 'relative' }}>
      {/* Filter Icon Button */}
      <button onClick={toggleDropdown} className={classes['filter-button']}>
        <FaFilter size={16} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={classes['filter-dropdown']}
          style={{
            position: 'absolute',
            top: '40px',
            right: '0',
            border: '1px solid #ddd',
            padding: '10px',
            backgroundColor: '#fff',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            borderRadius: '4px',
            zIndex: '100',
            width: '200px',
          }}
        >
          <div className={classes['filter-section']}>
            <label className={classes['filter-label']}>Type: </label>
            <div className={classes['filter-checkbox-group']}>
              <label className={classes['filter-checkbox-label']}>
                <input
                  type="checkbox"
                  value="1"
                  checked={typeFilter.includes(1)}
                  onChange={onTypeChange}
                  className={classes['filter-checkbox']}
                />
                Wood
              </label>
              <label className={classes['filter-checkbox-label']}>
                <input
                  type="checkbox"
                  value="0"
                  checked={typeFilter.includes(0)}
                  onChange={onTypeChange}
                  className={classes['filter-checkbox']}
                />
                Panel
              </label>
            </div>
          </div>

          <div className={classes['filter-section']}>
            <label className={classes['filter-label']}>Min Price: </label>
            <input
              type="number"
              value={minPrice === 0 ? '' : minPrice}
              onChange={(e) => onMinPriceChange(e)}
              className={classes['filter-input']}
              placeholder="0"
            />
          </div>

          <div className={classes['filter-section']}>
            <label className={classes['filter-label']}>Max Price: </label>
            <input
              type="number"
              value={maxPrice === 0 ? '' : maxPrice}
              onChange={(e) => onMaxPriceChange(e)}
              className={classes['filter-input']}
              placeholder="0"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default FilterComponent;
