import React, { useState } from 'react';
import styles from './AdminRegistrationForm.module.css';

function AdminRegistrationForm({ onClose }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    dateOfBirth: '',
    phoneNumber: '',
    street: '',
    number: '',
    city: '',
    country: '',
    role: 1, // Default to Employee
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'role' ? Number(value) : value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      setError('');

      // Address data
      const addressData = {
        street: formData.street,
        number: formData.number,
        city: formData.city,
        country: formData.country,
      };

      const addressResponse = await fetch('https://localhost:7046/api/Address/getOrCreate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addressData),
      });

      if (!addressResponse.ok) {
        const errorData = await addressResponse.json();
        setError(errorData.message || 'Failed to fetch or create address.');
        return;
      }

      const addressId = await addressResponse.json();

      // User data
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        dateOfBirth: formData.dateOfBirth,
        phoneNumber: formData.phoneNumber,
        addressId: addressId,
        role: formData.role,
      };

      const userResponse = await fetch('https://localhost:7046/api/User', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!userResponse.ok) {
        const errorData = await userResponse.json();
        setError(errorData.message || 'User registration failed. Please try again.');
        return;
      }

      alert('User added successfully!');
      onClose(); // Close the form after successful registration
    } catch (error) {
      console.error('Error during registration:', error);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.formContainer} onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleRegister}>
          <h2>Register New User</h2>
          {error && <p className={styles.error}>{error}</p>}
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" required />
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" required />
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
          <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
          <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
          <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Phone Number" required />

          <h3>Address</h3>
          <input type="text" name="street" value={formData.street} onChange={handleChange} placeholder="Street" required />
          <input type="text" name="number" value={formData.number} onChange={handleChange} placeholder="Number" required />
          <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" required />
          <input type="text" name="country" value={formData.country} onChange={handleChange} placeholder="Country" required />

          <h3>Role</h3>
          <label>
            <input
              type="radio"
              name="role"
              value={0}
              checked={formData.role === 0}
              onChange={handleChange}
            />
            Zaposleni
          </label>
          <label>
            <input
              type="radio"
              name="role"
              value={2}
              checked={formData.role === 2}
              onChange={handleChange}
            />
            Administrator
          </label>

          <button type="submit">Registruj korisnika</button>
          <button type="button" onClick={onClose}>Zatvori</button>
        </form>
      </div>
    </div>
  );
}

export default AdminRegistrationForm;
