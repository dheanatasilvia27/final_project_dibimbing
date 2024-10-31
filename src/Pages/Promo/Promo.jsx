import React, { useEffect, useState } from 'react';
import './promo.css';
import axios from 'axios';
import Aos from 'aos';
import 'aos/dist/aos.css';
import NavbarDashboard from '../../Components/Navdash/NavbarDashboard';

const Promo = () => {
  const [promos, setPromos] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: null,
    promo_discount_price: '',
    minimum_claim_price: '',
    terms_condition: '', // New field
    promo_code: '', // New field
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const BASE_URL = 'https://travel-journal-api-bootcamp.do.dibimbing.id';
  const apiKey = '24405e01-fbc1-45a5-9f5a-be13afcd757c';
  const token = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRoZWFuYXRhQGdtYWlsLmNvbSIsInVzZXJJZCI6ImFmMjRkZDM5LTNmNDQtNDQ2Mi05YjUxLWFlZjg0ZWJiY2Y1NyIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcyODU2MzA4MX0.kfxAPxtzhLMP_W4o7ikrnw2LfMr7qycMWpwZSkI6WQ0`;

  const headers = {
    Authorization: token,
    apiKey: apiKey,
  };

  const getPromos = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/v1/promos`, { headers });
      setPromos(res.data.data);
    } catch (err) {
      console.error('Error fetching promos:', err.response);
    }
  };

  useEffect(() => {
    getPromos();
    Aos.init({ duration: 2000 });
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const handleImageUpload = async () => {
    if (!formData.imageUrl || !(formData.imageUrl instanceof File)) {
      return formData.imageUrl; // Return current imageUrl if not a file
    }

    const imageForm = new FormData();
    imageForm.append('image', formData.imageUrl);

    try {
      const response = await axios.post(`${BASE_URL}/api/v1/upload-image`, imageForm, { headers });
      return response.data.url; // Assuming the API returns the image URL
    } catch (err) {
      console.error('Error uploading image:', err.response);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = await handleImageUpload();
    if (imageUrl === null && formData.imageUrl instanceof File) {
      alert('Image upload failed. Please try again.');
      return;
    }

    const data = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      imageUrl: imageUrl || '', // Ensure imageUrl is defined
      promo_discount_price: parseFloat(formData.promo_discount_price) || 0,
      minimum_claim_price: parseFloat(formData.minimum_claim_price) || 0,
      terms_condition: formData.terms_condition.trim(), // New field
      promo_code: formData.promo_code.trim(), // New field
    };

    console.log('Sending data:', JSON.stringify(data, null, 2));

    try {
      if (isEditing) {
        await axios.post(`${BASE_URL}/api/v1/update-promo/${currentId}`, data, { headers });
      } else {
        await axios.post(`${BASE_URL}/api/v1/create-promo`, data, { headers });
      }

      getPromos(); // Refresh the promos list
      resetForm();
    } catch (err) {
      console.error('Error saving promo:', err.response.data);
      alert(`Failed to save promo: ${JSON.stringify(err.response.data)}`);
    }
  };

  const handleEdit = (promo) => {
    setFormData({
      title: promo.title,
      description: promo.description,
      imageUrl: promo.imageUrl,
      promo_discount_price: promo.promo_discount_price.toString(),
      minimum_claim_price: promo.minimum_claim_price.toString(),
      terms_condition: promo.terms_condition || '', // New field
      promo_code: promo.promo_code || '', // New field
    });
    setIsEditing(true);
    setCurrentId(promo.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/v1/delete-promo/${id}`, { headers });
      setPromos((prev) => prev.filter((promo) => promo.id !== id));
    } catch (err) {
      console.error('Error deleting promo:', err.response);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      imageUrl: null,
      promo_discount_price: '',
      minimum_claim_price: '',
      terms_condition: '', // New field
      promo_code: '', // New field
    });
    setIsEditing(false);
    setCurrentId(null);
  };

  return (
    <section className='promo container section'>
      <NavbarDashboard />
      <div className="secTitle">
        <h3 data-aos="fade-right" className="title">Promo</h3>
      </div>

      <form onSubmit={handleSubmit} className="promo-form">
        <input type="text" name="title" placeholder="Promo Title" value={formData.title} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required></textarea>
        <input type="file" name="imageUrl" onChange={handleChange} accept="image/*" required={!isEditing} />
        <input type="number" name="promo_discount_price" placeholder="Discount Price" value={formData.promo_discount_price} onChange={handleChange} required />
        <input type="number" name="minimum_claim_price" placeholder="Minimum Claim Price" value={formData.minimum_claim_price} onChange={handleChange} required />
        <input type="text" name="terms_condition" placeholder="Terms and Conditions" value={formData.terms_condition} onChange={handleChange} required />
        <input type="text" name="promo_code" placeholder="Promo Code" value={formData.promo_code} onChange={handleChange} required />

        <button type="submit">{isEditing ? 'Update' : 'Add'} Promo</button>
        {isEditing && <button type="button" onClick={resetForm}>Cancel</button>}
      </form>

      <div className="secContent grid">
        {promos.map((promo) => (
          <div key={promo.id} data-aos="fade-up" className='singlePromo'>
            <div className="imageDiv" data-aos="fade-up">
              <img src={promo.imageUrl} alt={promo.title} />
            </div>
            <div className="cardInfo">
              <h4 className="promoTitle">{promo.title}</h4>
              <p className="promoDesc">{promo.description}</p>
              <p className="promoDiscount">Discount Price: ${promo.promo_discount_price}</p>
              <p className="promoMinClaim">Min. Claim Price: ${promo.minimum_claim_price}</p>
              <p className="promoTerms">Terms: {promo.terms_condition}</p>
              <p className="promoCode">Promo Code: {promo.promo_code}</p>
              <button onClick={() => handleEdit(promo)}>Edit</button>
              <button onClick={() => handleDelete(promo.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Promo;
