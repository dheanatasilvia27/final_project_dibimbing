import React, { useEffect, useState } from 'react';
import './banner.css';
import axios from 'axios';
import Aos from "aos";
import 'aos/dist/aos.css';
import NavbarDashboard from '../../Components/Navdash/NavbarDashboard'

const Main = () => {
  const [banners, setBanners] = useState([]);
  const [formData, setFormData] = useState({ name: '', title: '', imageUrl: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const BASE_URL = "https://travel-journal-api-bootcamp.do.dibimbing.id";
  const apiKey = '24405e01-fbc1-45a5-9f5a-be13afcd757c';
  const token = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRoZWFuYXRhQGdtYWlsLmNvbSIsInVzZXJJZCI6ImFmMjRkZDM5LTNmNDQtNDQ2Mi05YjUxLWFlZjg0ZWJiY2Y1NyIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcyODU2MzA4MX0.kfxAPxtzhLMP_W4o7ikrnw2LfMr7qycMWpwZSkI6WQ0`;

  // Header untuk semua permintaan
  const headers = {
    'Authorization': token,
    'apiKey': apiKey,
  };

  // Fungsi untuk mengambil daftar banner
  const getBanners = () => {
    axios.get(`${BASE_URL}/api/v1/banners`, { headers })
      .then((res) => {
        setBanners(res.data.data);
      })
      .catch((err) => {
        console.error("Error fetching banners:", err.response);
      });
  };

  useEffect(() => {
    getBanners();
    Aos.init({ duration: 2000 });
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const handleImageUpload = async () => {
    const imageForm = new FormData();
    imageForm.append('image', formData.image);

    try {
      const response = await axios.post(`${BASE_URL}/api/v1/upload-image`, imageForm, { headers });
      return response.data.url; // Assuming API returns image URL in `url` field
    } catch (err) {
      console.error("Error uploading image:", err.response);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let imageUrl = formData.imageUrl;
    if (formData.image) {
      imageUrl = await handleImageUpload();
      if (!imageUrl) return; // Stop if image upload failed
    }

    const data = {
      name: formData.name,
      title: formData.title,
      imageUrl,
    };

    const apiCall = isEditing
      ? axios.post(`${BASE_URL}/api/v1/update-banner/${currentId}`, data, { headers })
      : axios.post(`${BASE_URL}/api/v1/create-banner`, data, { headers });
      

    apiCall
      .then(() => {
        getBanners();
        resetForm();
      })
      .catch((err) => {
        console.error("Error saving banner:", err.response);
      });
  };

  const handleEdit = (banner) => {
    setFormData({ name: banner.name, title: banner.title, imageUrl: banner.imageUrl });
    setIsEditing(true);
    setCurrentId(banner.id);
  };

  const handleDelete = (id) => {
    axios.delete(`${BASE_URL}/api/v1/delete-banner/${id}`, { headers })
      .then(() => {
        getBanners();
      })
      .catch((err) => {
        console.error("Error deleting banner:", err.response);
      });
  };

  const resetForm = () => {
    setFormData({ name: '', title: '', image: null, imageUrl: '' });
    setIsEditing(false);
    setCurrentId(null);
  };

  return (
    <section className='main container section'>
        <NavbarDashboard />
      <div className="secTitle">
        <h3 data-aos="fade-right" className="title">Banner</h3>
      </div>

      <form onSubmit={handleSubmit} className="banner-form">
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        
        <input type="file" name="image" onChange={handleChange} accept="image/*" required={!isEditing} />
        <button type="submit">{isEditing ? 'Update' : 'Add'} Banner</button>
        {isEditing && <button type="button" onClick={resetForm}>Cancel</button>}
      </form>

      <div className="secContent grid">
        {banners.map((banner) => (
          <div key={banner.id} data-aos="fade-up" className='singleDestination'>
            <div className="imageDiv" data-aos="fade-up">
              <img src={banner.imageUrl} alt={banner.name} />
            </div>
            <div className="cardInfo">
              <h4 className="destTitle">{banner.name}</h4>
              <h4 className="destTitle">{banner.title}</h4>
              <button onClick={() => handleEdit(banner)}>Edit</button>
              <button onClick={() => handleDelete(banner.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Main;
