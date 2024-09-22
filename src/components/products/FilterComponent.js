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
            <label className={classes['filter-label']}>Tip: </label>
            <div className={classes['filter-checkbox-group']}>
              <label className={classes['filter-checkbox-label']}>
                <input
                  type="checkbox"
                  value="1"
                  checked={typeFilter.includes(1)}
                  onChange={onTypeChange}
                  className={classes['filter-checkbox']}
                />
                Drvo
              </label>
              <label className={classes['filter-checkbox-label']}>
                <input
                  type="checkbox"
                  value="0"
                  checked={typeFilter.includes(0)}
                  onChange={onTypeChange}
                  className={classes['filter-checkbox']}
                />
                Plocasti materijali
              </label>
            </div>
          </div>

          <div className={classes['filter-section']}>
            <label className={classes['filter-label']}>Minimalna cena: </label>
            <input
              type="number"
              value={minPrice === 0 ? '' : minPrice}
              onChange={(e) => onMinPriceChange(e)}
              className={classes['filter-input']}
              placeholder="0"
            />
          </div>

          <div className={classes['filter-section']}>
            <label className={classes['filter-label']}>Maksimalna cena: </label>
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
