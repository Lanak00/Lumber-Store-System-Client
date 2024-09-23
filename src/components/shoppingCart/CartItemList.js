import React from 'react';
import CartItem from './CartItem';
import classes from './CartItemList.module.css';

function CartItemList({ cartItems, removeItem }) {
  if (cartItems.length === 0) {
    return <p className={classes.emptyCart}>Korpa je prazna</p>;
  }

  return (
    <ul className={classes.cartItemList}>
      {cartItems.map((item) => (
        <CartItem key={item.id} item={item} removeItem={removeItem} />
      ))}
    </ul>
  );
}

export default CartItemList;
