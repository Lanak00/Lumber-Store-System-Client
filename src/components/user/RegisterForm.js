import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import classes from './LoginForm.module.css'; // Reuse the same styles for consistency

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    repeatPassword: '',
    street: '',
    town: '',
    number: '',
    phone: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = (e) => {
    e.preventDefault();

    // Basic validation for required fields
    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
      setError('All fields are required.');
      return;
    }
    if (formData.password !== formData.repeatPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError('');
    console.log('Registration submitted:', formData);
    // Add logic for actual registration here
  };

  return (
    <div className={classes.loginContainer}>
      <form className={classes.loginForm} onSubmit={handleRegister}>
        <h2>Registruj se</h2>
        {error && <p className={classes.error}>{error}</p>}
        
        {/* First Name Field */}
        <div className={classes.formGroup}>
          <label htmlFor="firstName">Ime</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        
        {/* Last Name Field */}
        <div className={classes.formGroup}>
          <label htmlFor="lastName">Prezime</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        
        {/* Email Field */}
        <div className={classes.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        {/* Password Field */}
        <div className={classes.formGroup}>
          <label htmlFor="password">Lozinka</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        
        {/* Repeat Password Field */}
        <div className={classes.formGroup}>
          <label htmlFor="repeatPassword">Ponovite lozinku</label>
          <input
            type="password"
            id="repeatPassword"
            name="repeatPassword"
            value={formData.repeatPassword}
            onChange={handleChange}
            required
          />
        </div>
        
        {/* Address Fields */}
        <div className={classes.formGroup}>
          <label htmlFor="street">Ulica</label>
          <input
            type="text"
            id="street"
            name="street"
            value={formData.street}
            onChange={handleChange}
          />
        </div>
        <div className={classes.formGroup}>
          <label htmlFor="town">Grad</label>
          <input
            type="text"
            id="town"
            name="town"
            value={formData.town}
            onChange={handleChange}
          />
        </div>
        <div className={classes.formGroup}>
          <label htmlFor="number">Broj</label>
          <input
            type="text"
            id="number"
            name="number"
            value={formData.number}
            onChange={handleChange}
          />
        </div>
        
        {/* Telephone Number Field */}
        <div className={classes.formGroup}>
          <label htmlFor="phone">Broj telefona</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        {/* Register Button */}
        <button type="submit" className={classes.loginButton}>Registruj se</button>
      </form>
      <div className={classes.registerPrompt}>
        <p>
          Vec imas nalog? <Link to="/login" className={classes.registerLink}>Prijavi se ovde.</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
