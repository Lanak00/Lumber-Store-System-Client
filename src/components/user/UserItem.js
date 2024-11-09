import React, { useState } from 'react';
import AdminRegistrationForm from '../user/AdminRegistrationForm'; // Import the registration form
import styles from '../orders/OrderItem.module.css';
import { FaPen, FaTimes } from 'react-icons/fa'; // Import pen and times icons for the buttons

function UserItem({ user, onUserDeleted }) {
  const [isEditMode, setIsEditMode] = useState(false); // State to handle edit mode

  const handleEditClick = () => {
    setIsEditMode(true); // Open form in edit mode
  };

  const handleDeleteClick = async () => {
    const isConfirmed = window.confirm('Are you sure you want to delete this user?');
    if (isConfirmed) {
      try {
        const response = await fetch(`https://localhost:7046/api/User/${user.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          alert('User deleted successfully!');
          if (onUserDeleted) {
            onUserDeleted(user.id); // Notify the parent component that the user has been deleted
          }
        } else {
          const errorData = await response.json();
          alert(`Failed to delete user: ${errorData.message || 'Please try again.'}`);
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Something went wrong while deleting the user. Please try again.');
      }
    }
  };

  const handleCloseForm = () => {
    setIsEditMode(false); // Close form
  };

  return (
    <div className={styles.orderItem}>
      {/* Edit button in the upper right corner */}
      <button className={styles.editButton} onClick={handleEditClick}>
        <FaPen />
      </button>

      {/* Delete button in the upper right corner */}
      <button className={styles.deleteButton} onClick={handleDeleteClick}>
        <FaTimes />
      </button>

      <p><strong>Ime i prezime:</strong> {user.firstName} {user.lastName}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Datum rodjenja:</strong> {new Date(user.dateOfBirth).toLocaleDateString()}</p>
      <p><strong>Telefon:</strong> {user.phoneNumber}</p>
      <p><strong>Adresa:</strong> {user.address.street} {user.address.number}, {user.address.city}, {user.address.country}</p>

      {isEditMode && (
        <AdminRegistrationForm
          onClose={handleCloseForm}
          existingData={user}
          isEdit={true}
        />
      )}
    </div>
  );
}

export default UserItem;
