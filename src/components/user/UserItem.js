import React from 'react';
import styles from './UserItem.module.css';

function UserItem({ user }) {
  return (
    <div className={styles.userItem}>
      <p><strong>Ime i prezime:</strong> {user.firstName} {user.lastName}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Datum rodjenja:</strong> {new Date(user.dateOfBirth).toLocaleDateString()}</p>
      <p><strong>Telefon:</strong> {user.phoneNumber}</p>
      <p><strong>Adresa:</strong> {user.address.street} {user.address.number}, {user.address.city}, {user.address.country}</p>
    </div>
  );
}

export default UserItem;
