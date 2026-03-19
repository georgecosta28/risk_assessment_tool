// src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { useAppContext } from '../context';
import { Link } from 'react-router-dom';


export default function Login() {
  const { setUser } = useAppContext();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/login', form);
      setUser({ id: res.data.user_id, username: form.username });
      navigate('/company'); // redirect to company setup
    } catch (err) {
      setError('Login failed');
    }
  };

 return (
  <div>
    <h2>Login</h2>
    <form onSubmit={handleLogin}>
      <input
        type="text"
        placeholder="Username"
        onChange={(e) => setForm({ ...form, username: e.target.value })}
      /><br />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      /><br />
      <button type="submit">Login</button>
    </form>

    {error && <p style={{ color: 'red' }}>{error}</p>}

    <p>
      Don’t have an account? <Link to="/register">Register here</Link>
    </p>
  </div>
);
}
