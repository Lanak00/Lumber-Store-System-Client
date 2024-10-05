import React from 'react';
import classes from './ProductItem.module.css';
import Card from '../layout/Card';
import { Link } from 'react-router-dom'; 

function ProductItem(props) {
const dimensionsText = `${props.dimensions.width}x${props.dimensions.length}`;
return (
  <li className={classes.item}>
    {/* Wrap Card component with Link to enable navigation to the product details page */}
    <Link to={`/product/${props.id}`} className={classes.cardLink}>
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
    </Link>
  </li>
);
}

export default ProductItem;
