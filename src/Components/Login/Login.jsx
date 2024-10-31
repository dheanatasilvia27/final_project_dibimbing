import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import './login.css'


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Permintaan API untuk login
    axios.post('https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/login', {
      email: email,
      password: password
    }, {
      headers: {
        'apiKey': '24405e01-fbc1-45a5-9f5a-be13afcd757c', // Gantilah dengan API key yang benar jika diperlukan
      }
    })
    .then((response) => {
      // Simpan token yang diterima di localStorage
      localStorage.setItem('token', response.data.token);
      
      // Redirect ke dashboard setelah login sukses
      navigate('/admin-page');
    })
    .catch((error) => {
      // Jika login gagal, tampilkan pesan error
      setError('Invalid email or password');
      console.error('Login error:', error);
    });
  };

  return (
    
    <div className="body-login">
<div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />
        <button type="submit">Login</button>

        <p>
          <span>Don't have an account? <Link to="/register"><span>Register</span></Link>
          </span>
        </p>
      </form>
      {error && <p className="error">{error}</p>}
    </div>

    </div>
    
  );
};

export default Login;
