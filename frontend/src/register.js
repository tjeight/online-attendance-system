import React, { useState } from 'react';
import axios from 'axios';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    class: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, class: studentClass, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/register', {
        name,
        email,
        class: studentClass,
        password,
      });

      alert(response.data.message);
      // Clear the form
      setFormData({
        name: '',
        email: '',
        class: '',
        password: '',
        confirmPassword: '',
      });
    } catch (error) {
      alert('Registration failed: ' + error.response?.data?.error || 'Server error');
    }
  };

  return (
    <div className="register-form">
      <form onSubmit={handleSubmit}>
        <h2>Student Registration</h2>
        <div>
          <label>Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Class</label>
          <input type="text" name="class" value={formData.class} onChange={handleChange} required />
        </div>
        <div>
          <label>Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <div>
          <label>Confirm Password</label>
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterForm;
