import React from 'react';
import classes from './ProductItem.module.css';
import Card from '../layout/Card';

function ProductItem(props) {
const dimensionsText = `${props.dimensions.length}x${props.dimensions.width}`;
  return (
    <li className={classes.item}>
      <Card>
        <div className={classes.content}>
          <img src={props.image} alt={props.name} className={classes.image} />
          <div>
            <h2 className={classes.name}>{props.name}</h2>
            <h3 className={classes.dimensions}>{dimensionsText}</h3>
            <p className={classes.price}>{props.price.toFixed(2)} RSD</p>
          </div>
        </div>
      </Card>
    </li>
  );
}

export default ProductItem;
