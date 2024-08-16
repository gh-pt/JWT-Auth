// src/components/Login.js
import React, { useState } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await api.post('/users/login', formData);
      setTimeout(()=>{
        navigate('/dashboard');
      },500);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Email:</label>
      <input name="email" type="email" placeholder="Email" onChange={handleChange} className='border border-black rounded m-1' />
      <br />
      <label htmlFor="password">Password:</label>
      <input name="password" type="password" placeholder="Password" onChange={handleChange}  className='border border-black rounded m-1'/>
      <br />
      <button type="submit" className='border-2 border-black p-1.5 rounded bg-green-400'>Login</button>
    </form>
  );
};

export default Login;
