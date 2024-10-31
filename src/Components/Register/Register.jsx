import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    passwordRepeat: '',
    role: 'user',
    profilePicture: null,
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, profilePicture: e.target.files[0] });
  };

  const uploadImage = async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const response = await axios.post('https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/upload-image', formData, {
        headers: {
          'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1pZnRhaGZhcmhhbkBnbWFpbC5jb20iLCJ1c2VySWQiOiI4M2QxZTliZC1mODJiLTRiMzktYmY4Yy1mM2FjZWY0ZGYwMzAiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3Mjg1NjE2ODF9.ojVNuApB-Utm91pHaROpOaHyluz6YJqqSlnMI3izdQE',
          'apiKey': '24405e01-fbc1-45a5-9f5a-be13afcd757c',
        },
      });
      return response.data; 
    } catch (error) {
      console.error("Image upload error:", error);
      throw error; 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.passwordRepeat) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const imageResponse = await uploadImage(formData.profilePicture);
      const profilePictureUrl = imageResponse.url;

      const registrationData = new FormData();
      registrationData.append('email', formData.email);
      registrationData.append('name', formData.name);
      registrationData.append('password', formData.password);
      registrationData.append('role', formData.role);
      registrationData.append('profilePictureUrl', profilePictureUrl);

      const response = await axios.post('https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/register', registrationData, {
        headers: {
          'apiKey': '24405e01-fbc1-45a5-9f5a-be13afcd757c',
        },
      });

      if (response.status === 200) {
        alert("Registration successful!");
      } else {
        setErrorMessage("Registration failed!");
      }
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.message || "Unknown error");
      } else if (error.request) {
        setErrorMessage("No response received from the server.");
      } else {
        setErrorMessage(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Repeat Password:</label>
        <input
          type="password"
          name="passwordRepeat"
          value={formData.passwordRepeat}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Role:</label>
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div>
        <label>Profile Picture:</label>
        <input
          type="file"
          name="profilePicture"
          onChange={handleFileChange}
          accept="image/*"
          required
        />
      </div>
      <button type="submit" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
    </form>
  );
};

export default Register;
