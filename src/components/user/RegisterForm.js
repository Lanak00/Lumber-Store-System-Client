import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import classes from './LoginForm.module.css'; 

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
    country: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true); // State to track if passwords match

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    // Real-time password match validation
    if (formData.password && formData.repeatPassword) {
      setPasswordsMatch(formData.password === formData.repeatPassword);
    }
  }, [formData.password, formData.repeatPassword]);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
      setError('All fields are required.');
      return;
    }

    if (!passwordsMatch) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setError(''); 

      const addressData = {
        street: formData.street,
        number: formData.number,
        city: formData.town,
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

      const registrationData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        dateOfBirth: '2000-01-01', 
        phoneNumber: formData.phone,
        addressId: addressId,
        role: 1, 
      };

      const registerResponse = await fetch('https://localhost:7046/api/User', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      if (!registerResponse.ok) {
        const errorData = await registerResponse.json();
        setError(errorData.message || 'Registration failed. Please try again.');
        return;
      }

      alert('Registration successful! You can now log in.');
    } catch (error) {
      console.error('Error during registration:', error);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className={classes.loginContainer}>
      <form className={classes.loginForm} onSubmit={handleRegister}>
        <h2>Registruj se</h2>
        {error && <p className={classes.error}>{error}</p>}

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
          {!passwordsMatch && (
            <p className={classes.error}>Passwords do not match.</p>
          )}
        </div>

        <div className={classes.formGroup}>
          <label htmlFor="street">Ulica</label>
          <input
            type="text"
            id="street"
            name="street"
            value={formData.street}
            onChange={handleChange}
            required
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
            required
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
            required
          />
        </div>

        <div className={classes.formGroup}>
          <label htmlFor="country">Drzava</label>
          <input
            type="text"
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
          />
        </div>

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

        <button type="submit" className={classes.loginButton}>
          Registruj se
        </button>
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
