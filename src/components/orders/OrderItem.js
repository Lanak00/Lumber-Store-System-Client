import React from 'react';
import styles from './OrderItem.module.css';

function OrderItem({ order }) {
  return (
    <div className={styles.orderItem}>
      <p><strong>Datum:</strong> {new Date(order.date).toLocaleDateString()}</p>
      <p><strong>Cena:</strong> {order.totalPrice} RSD</p>

      <div className={styles.productList}>
        <h4>Proizvodi:</h4>
        <ul>
          {order.items.map((item, index) => (
            <li key={index}>{item.productName}</li>
          ))}
        </ul>
      </div>

      {order.cuttingLists.length > 0 && (
        <div className={styles.cuttingList}>
          <h4>Krojne liste:</h4>
          <ul>
            {order.cuttingLists.map((cl, index) => (
              <li key={index}>{cl.productName}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default OrderItem;
