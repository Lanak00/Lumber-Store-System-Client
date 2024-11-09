import React, { useState, useEffect } from 'react';
import styles from '../products/NewProductForm.module.css'; // Import styles from NewProductForm.module.css

function AdminRegistrationForm({ onClose, existingData, isEdit }) {
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
    role: 0, 
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit && existingData) {
      setFormData({
        firstName: existingData.firstName || '',
        lastName: existingData.lastName || '',
        email: existingData.email || '',
        password: '', 
        dateOfBirth: existingData.dateOfBirth || '',
        phoneNumber: existingData.phoneNumber || '',
        street: existingData.address?.street || '',
        number: existingData.address?.number || '',
        city: existingData.address?.city || '',
        country: existingData.address?.country || '',
        role: existingData.role || 1,
      });
    }
  }, [isEdit, existingData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === 'role' ? Number(value) : value }));
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
        method: isEdit ? 'PUT' : 'POST', // Use PUT for editing existing user, POST for new user
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

      alert(isEdit ? 'Uspesno izmenjeni podaci o korisniku' : 'Uspesno registrovan novi korisnik');
      onClose(); // Close the form after successful registration/update
    } catch (error) {
      console.error('Error during registration:', error);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.formContainer} onClick={(e) => e.stopPropagation()}>
        {/* Close button in the upper right corner */}
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>

        <form onSubmit={handleRegister}>
          <h2>{isEdit ? 'Izmeni podatke o korisniku' : 'Registruj novog korisnika'}</h2>
          {error && <p className={styles.error}>{error}</p>}
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Ime" required />
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Prezime" required />
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
          {!isEdit && <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Lozinka" required />}
          <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
          <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Telefon" required />

          <h3>Adresa</h3>
          <input type="text" name="Ulica" value={formData.street} onChange={handleChange} placeholder="Street" required />
          <input type="text" name="Broj" value={formData.number} onChange={handleChange} placeholder="Number" required />
          <input type="text" name="Grad" value={formData.city} onChange={handleChange} placeholder="City" required />
          <input type="text" name="Drzava" value={formData.country} onChange={handleChange} placeholder="Country" required />

          {!isEdit && (
            <>
              <h3>Uloga</h3>
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
            </>
          )}

          <button type="submit" className={styles.submitButton}>{isEdit ? 'Update User' : 'Registruj korisnika'}</button>
        </form>
      </div>
    </div>
  );
}

export default AdminRegistrationForm;
