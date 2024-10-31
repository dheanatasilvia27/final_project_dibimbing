import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './navbardashboard.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h2>DeyTrip</h2>
      </div>
      <ul className={`navbar-links ${isOpen ? 'open' : ''}`}>
        <li><Link to="/admin-page">Dashboard</Link></li>
        <li><Link to="/banner">Banners</Link></li>
        <li><Link to="/promo">Promos</Link></li>
        <li><Link to="/category">Category</Link></li>
        <li><Link to="/activity">Activity</Link></li>
        <li><Link to="/user">User</Link></li>
      </ul>
      <button className="navbar-toggle" onClick={toggleMenu}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </button>
    </nav>
  );
};

export default Navbar;
