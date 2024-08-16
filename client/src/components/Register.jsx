// src/components/Register.js
import React, { useState } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    avatar: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users', formData);
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="username">Username:</label>
      <input name="username" placeholder="Username" onChange={handleChange} className='border border-black rounded m-1' />
      <br />
      <label htmlFor="email">Email:</label>
      <input name="email" type="email" placeholder="Email" onChange={handleChange} className='border border-black rounded m-1' />
      <br />
      <label htmlFor="password">Password:</label>
      <input name="password" type="password" placeholder="Password" onChange={handleChange} className='border border-black rounded m-1' />
      <br />
      <label htmlFor="avatar">Avatar:</label>
      <input name="avatar" placeholder="Avatar URL" onChange={handleChange} className='border border-black rounded m-1' />
      <br />
      <button type="submit" className='border-2 border-black bg-blue-500 rounded p-1.5'>Register</button>
    </form>
  );
};

export default Register;
