import React, { useEffect, useState } from 'react';
import './category.css';
import axios from 'axios';
import Aos from "aos";
import 'aos/dist/aos.css';
import NavbarDashboard from '../../Components/Navdash/NavbarDashboard';

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    imageUrl: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const BASE_URL = "https://travel-journal-api-bootcamp.do.dibimbing.id";
  const apiKey = '24405e01-fbc1-45a5-9f5a-be13afcd757c';
  const token = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRoZWFuYXRhQGdtYWlsLmNvbSIsInVzZXJJZCI6ImFmMjRkZDM5LTNmNDQtNDQ2Mi05YjUxLWFlZjg0ZWJiY2Y1NyIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcyODU2MzA4MX0.kfxAPxtzhLMP_W4o7ikrnw2LfMr7qycMWpwZSkI6WQ0`;

  const headers = {
    'Authorization': token,
    'apiKey': apiKey,
  };

  const getCategories = () => {
    axios.get(`${BASE_URL}/api/v1/categories`, { headers })
      .then((res) => {
        setCategories(res.data.data);
      })
      .catch((err) => {
        console.error("Error fetching categories:", err.response);
      });
  };

  useEffect(() => {
    getCategories();
    Aos.init({ duration: 2000 });
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const handleImageUpload = async () => {
    if (!formData.imageUrl || !(formData.imageUrl instanceof File)) return formData.imageUrl;

    const imageForm = new FormData();
    imageForm.append('image', formData.imageUrl);

    try {
      const response = await axios.post(`${BASE_URL}/api/v1/upload-image`, imageForm, { headers });
      return response.data.url;
    } catch (err) {
      console.error("Error uploading image:", err.response);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = formData.imageUrl;
    if (formData.imageUrl && formData.imageUrl instanceof File) {
      imageUrl = await handleImageUpload();
      if (!imageUrl) return; // Stop if image upload failed
    }

    const data = {
      name: formData.name,
      imageUrl
    };

    console.log("Sending data:", data); // Log the data being sent

    try {
      const apiCall = isEditing
        ? await axios.post(`${BASE_URL}/api/v1/update-category/${currentId}`, data, { headers })
        : await axios.post(`${BASE_URL}/api/v1/create-category`, data, { headers });

      // If successful, refresh categories and reset form
      console.log("Response from API:", apiCall.data); // Log the response from the API
      getCategories();
      resetForm();
    } catch (err) {
      console.error("Error saving category:", err.response);
      alert('Failed to save category. Please check the console for details.'); // Show error alert
    }
  };

  const handleEdit = (category) => {
    setFormData({
      name: category.name,
      imageUrl: category.imageUrl
    });
    setIsEditing(true);
    setCurrentId(category.id);
  };

  const handleDelete = (id) => {
    axios.delete(`${BASE_URL}/api/v1/delete-category/${id}`, { headers })
      .then(() => {
        setCategories((prev) => prev.filter(category => category.id !== id));
      })
      .catch((err) => {
        console.error("Error deleting category:", err.response);
      });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      imageUrl: ''
    });
    setIsEditing(false);
    setCurrentId(null);
  };

  return (
    <section className='category container section'>
      <NavbarDashboard />
      <div className="secTitle">
        <h3 data-aos="fade-right" className="title">Category</h3>
      </div>

      <form onSubmit={handleSubmit} className="category-form">
        <input type="text" name="name" placeholder="Category Name" value={formData.name} onChange={handleChange} required />
        <input type="file" name="imageUrl" onChange={handleChange} accept="image/*" required={!isEditing} />
        <button type="submit">{isEditing ? 'Update' : 'Add'} Category</button>
        {isEditing && <button type="button" onClick={resetForm}>Cancel</button>}
      </form>

      <div className="secContent grid">
        {categories.map((category) => (
          <div key={category.id} data-aos="fade-up" className='singleCategory'>
            <div className="imageDiv">
              <img src={category.imageUrl} alt={category.name} />
            </div>
            <div className="cardInfo">
              <h4 className="categoryName">{category.name}</h4>
              <button onClick={() => handleEdit(category)}>Edit</button>
              <button onClick={() => handleDelete(category.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Category;
