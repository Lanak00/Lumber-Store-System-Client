import React from 'react';
import classes from './CartItem.module.css';

function CartItem({ item, removeItem }) {
    const dimensionsText = `${item.dimensions.length}x${item.dimensions.width}x${item.dimensions.height}`;
    
    return (
        <li className={classes.cartItem}>
            <img src={item.image} alt={item.name} className={classes.cartItemImage} />
            <div className={classes.cartItemDetails}>
                <h3>{item.name}</h3>
                <p>Proizvodjac: {item.manufacturer}</p>
                <p>Dimenzije: {dimensionsText}</p>
                <p>Cena: {item.price.toFixed(2)} RSD</p>
                <p>Kolicina: {item.amount}</p>
            </div>
            <div className={classes.cartItemActions}>
                <button onClick={() => removeItem(item.id)} className={classes.removeButton}>
                    Ukloni
                </button>
            </div>
        </li>
    );
}

export default CartItem;
