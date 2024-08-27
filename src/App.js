import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './Component/Navbar';
import Description from './pages/Description';
import Signin from './Component/Signin';
import DescriptionT from './pages/DescriptionT';
import Implication from './pages/Implication';
import ImplicationT from './pages/ImplicationT';
import Auditor from './pages/Auditor';
import Home from './pages/Home';
import backgroundImage from '../src/sign.jpg';
import './App.css'; // Make sure to import your CSS file

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <div className="app-container" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      <Router>
        <div className="main-content">
          {isAuthenticated && (
            <div className="navbar-container">
              <Navbar />
            </div>
          )}
          <div className="scrollable-content">
            <Routes>
              <Route path="/" element={isAuthenticated ? <Navigate to="/Home" /> : <Navigate to="/signin" />} />
              <Route path="/Home" element={isAuthenticated ? <Home /> : <Navigate to="/signin" />} />
              <Route path="/ImplicationT" element={isAuthenticated ? <ImplicationT /> : <Navigate to="/signin" />} />
              <Route path="/Auditor" element={isAuthenticated ? <Auditor /> : <Navigate to="/signin" />} />
              <Route path="/Description" element={isAuthenticated ? <Description /> : <Navigate to="/signin" />} />
              <Route path="/descriptiont" element={isAuthenticated ? <DescriptionT /> : <Navigate to="/signin" />} />
              <Route path="/signin" element={<Signin onLoginSuccess={handleLoginSuccess} />} />
            </Routes>
          </div>
        </div>
      </Router>
    </div>
  );
};

export default App;
