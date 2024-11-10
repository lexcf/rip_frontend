// Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './App.css'; // Импортируем стили для navbar

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-link">Главная</Link>
      <Link to="/threats" className="navbar-link">Угрозы</Link>
    </nav>
  );
};

export default Navbar;
