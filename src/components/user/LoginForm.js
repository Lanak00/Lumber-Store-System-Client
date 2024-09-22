import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classes from "./LoginForm.module.css";
import { Link } from 'react-router-dom';

const LoginForm = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError('Username and password are required.');
      return;
    }

    setError(''); // Reset any previous errors

    try {
      const response = await fetch('https://localhost:44364/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error('Invalid username or password');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token); 

      if (typeof setIsLoggedIn === 'function') {
        setIsLoggedIn(); 
      }
      
      navigate('/');

    } catch (error) {
      console.error('Error occurred during login:', error);
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className={classes.loginContainer}>
      <form className={classes.loginForm} onSubmit={handleLogin}>
        <h2>Prijavi se</h2>
        {error && <p className={classes.error}>{error}</p>}
        <div className={classes.formGroup}>
          <label htmlFor="username">Korisnicko ime</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className={classes.formGroup}>
          <label htmlFor="password">Lozinka</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className={classes.loginButton}>Prijavi se</button>
      </form>
      <div className={classes.registerPrompt}>
        <p>
          Jos uvek nemas nalog? <Link to="/register" className={classes.registerLink}>Registruj se.</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
