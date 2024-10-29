import React from 'react';
import classes from './ProductItem.module.css';
import Card from '../layout/Card';
import { Link } from 'react-router-dom'; 

function ProductItem(props) {
  // Conditionally set dimensions text if dimensions are available
  const dimensionsText = props.dimensions
    ? `${props.dimensions.width}x${props.dimensions.length}`
    : '';

  // Determine whether to show dimensions based on the category
  const shouldShowDimensions = props.type !== 1; 

  return (
    <li className={classes.item}>
      <Link to={`/product/${props.id}`} className={classes.cardLink}>
        <Card>
          <div className={classes.content}>
            <img src={props.image} alt={props.name} className={classes.image} />
            <div>
              <h2 className={classes.name}>{props.name}</h2>

              {/* Conditionally render dimensions only if applicable */}
              {shouldShowDimensions && (
                <h3 className={classes.dimensions}>{dimensionsText}</h3>
              )}

              <p className={classes.price}>{props.price.toFixed(2)} RSD</p>
            </div>
          </div>
        </Card>
      </Link>
    </li>
  );
}

export default ProductItem;
