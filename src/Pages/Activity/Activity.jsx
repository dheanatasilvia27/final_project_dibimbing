import React, { useEffect, useState } from 'react';
import './activity.css'; // Ensure this file has modern and responsive styles
import axios from 'axios';
import Aos from 'aos';
import 'aos/dist/aos.css';
import NavbarDashboard from '../../Components/Navdash/NavbarDashboard';

const Activity = () => {
  const [activities, setActivities] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    description: '',
    imageUrls: [],
    price: '',
    price_discount: '',
    rating: '',
    total_reviews: '',
    facilities: '',
    address: '',
    province: '',
    city: '',
    location_maps: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const BASE_URL = "https://travel-journal-api-bootcamp.do.dibimbing.id";
  const apiKey = '24405e01-fbc1-45a5-9f5a-be13afcd757c';
  const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRoZWFuYXRhQGdtYWlsLmNvbSIsInVzZXJJZCI6ImFmMjRkZDM5LTNmNDQtNDQ2Mi05YjUxLWFlZjg0ZWJiY2Y1NyIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcyODU2MzA4MX0.kfxAPxtzhLMP_W4o7ikrnw2LfMr7qycMWpwZSkI6WQ0';

  const headers = {
    'Authorization': token,
    'apiKey': apiKey,
  };

  const getActivities = () => {
    axios.get(`${BASE_URL}/api/v1/activities`, { headers })
      .then((res) => {
        setActivities(res.data.data);
      })
      .catch((err) => {
        console.error("Error fetching activities:", err.response);
      });
  };

  useEffect(() => {
    getActivities();
    Aos.init({ duration: 2000 });
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'imageUrls') {
      setFormData({ ...formData, imageUrls: Array.from(files) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageUpload = async () => {
    const uploadedUrls = [];
    for (const file of formData.imageUrls) {
      const imageForm = new FormData();
      imageForm.append('image', file);
      try {
        const response = await axios.post(`${BASE_URL}/api/v1/upload-image`, imageForm, { headers });
        uploadedUrls.push(response.data.url);
      } catch (err) {
        console.error("Error uploading image:", err.response);
      }
    }
    return uploadedUrls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const imageUrls = formData.imageUrls.length > 0 ? await handleImageUpload() : [];

    const data = {
      ...formData,
      imageUrls,
      price: parseFloat(formData.price),
      price_discount: parseFloat(formData.price_discount),
      rating: parseFloat(formData.rating),
      total_reviews: parseInt(formData.total_reviews, 10)
    };

    try {
      const apiCall = isEditing
        ? await axios.post(`${BASE_URL}/api/v1/update-activity/${currentId}`, data, { headers })
        : await axios.post(`${BASE_URL}/api/v1/create-activity`, data, { headers });

      getActivities();
      resetForm();
    } catch (err) {
      console.error("Error saving activity:", err.response);
    }
  };

  const handleEdit = (activity) => {
    setFormData({
      name: activity.name,
      title: activity.title,
      description: activity.description,
      imageUrls: activity.imageUrls,
      price: activity.price,
      price_discount: activity.price_discount,
      rating: activity.rating,
      total_reviews: activity.total_reviews,
      facilities: activity.facilities,
      address: activity.address,
      province: activity.province,
      city: activity.city,
      location_maps: activity.location_maps
    });
    setIsEditing(true);
    setCurrentId(activity.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/v1/delete-activity/${id}`, { headers });
      setActivities((prev) => prev.filter(activity => activity.id !== id));
    } catch (err) {
      console.error("Error deleting activity:", err.response);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      title: '',
      description: '',
      imageUrls: [],
      price: '',
      price_discount: '',
      rating: '',
      total_reviews: '',
      facilities: '',
      address: '',
      province: '',
      city: '',
      location_maps: ''
    });
    setIsEditing(false);
    setCurrentId(null);
  };

  return (
    <section className='activity container section'>
      <NavbarDashboard />
      <div className="secTitle">
        <h3 data-aos="fade-right" className="title">Activities</h3>
      </div>

      <form onSubmit={handleSubmit} className="activity-form">
        <input type="text" name="name" placeholder="Activity Name" value={formData.name} onChange={handleChange} required />
        <input type="text" name="title" placeholder="Activity Title" value={formData.title} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required></textarea>
        <input type="file" name="imageUrls" onChange={handleChange} accept="image/*" multiple required />
        <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} required />
        <input type="number" name="price_discount" placeholder="Discount Price" value={formData.price_discount} onChange={handleChange} required />
        <input type="number" name="rating" placeholder="Rating" value={formData.rating} onChange={handleChange} required />
        <input type="number" name="total_reviews" placeholder="Total Reviews" value={formData.total_reviews} onChange={handleChange} required />
        <input type="text" name="facilities" placeholder="Facilities" value={formData.facilities} onChange={handleChange} required />
        <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
        <input type="text" name="province" placeholder="Province" value={formData.province} onChange={handleChange} required />
        <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} required />
        <input type="text" name="location_maps" placeholder="Location Maps URL" value={formData.location_maps} onChange={handleChange} required />

        <button type="submit">{isEditing ? 'Update' : 'Add'} Activity</button>
        {isEditing && <button type="button" onClick={resetForm}>Cancel</button>}
      </form>

      <div className="secContent grid">
        {activities.map((activity) => (
          <div key={activity.id} data-aos="fade-up" className='singleActivity'>
            <div className="imageDiv">
              {activity.imageUrls.map((url, index) => (
                <img key={index} src={url} alt={activity.title} />
              ))}
            </div>
            <div className="cardInfo">
              <h4 className="activityTitle">{activity.title}</h4>
              <p className="activityDesc">{activity.description}</p>
              <button onClick={() => handleEdit(activity)}>Edit</button>
              <button onClick={() => handleDelete(activity.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Activity;
