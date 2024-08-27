import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import AppIcon from './Logo500.png';

const Navbar = () => {
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState('');

  const getPathname = (path) => {
    switch (path) {
      case "/ImplicationT":
        return "ImplicationT";
      case "/Home":
        return "Home";
      case "/Description":
        return "Description";
      case "/DescriptionT":
        return "DescriptionT";
      case "/Auditor":
        return "Auditor";
      default:
        return "";
    }
  };

  useEffect(() => {
    setActiveMenu(getPathname(location.pathname));
  }, [location]);

  return (
    <div className='bg'>
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/Home">
            <img src={AppIcon} style={{ height: '55px' }} alt="Logo" className="logo" />
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className={`nav-link ${activeMenu === "Home" ? "active" : ""}`} to="/Home">Home</Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${activeMenu === "ImplicationT" ? "active" : ""}`} to="/ImplicationT">Implication</Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${activeMenu === "Description" ? "active" : ""}`} to="/Description">Description</Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${activeMenu === "DescriptionT" ? "active" : ""}`} to="/DescriptionT">Organization</Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${activeMenu === "Auditor" ? "active" : ""}`} to="/Auditor">Auditor</Link>
              </li>
              <li className="nav-item">
                <Link className="btn btn-outline-light ms-3" to="/signin">Sign In</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
