import React from 'react';
import './Home.css'; // Import the corresponding CSS file for styling
import hero from '../hero-img.png';

const Home = () => {
  return (
    <section id="hero" className="d-flex align-items-center">
      <div className="container">
        <div className="row">
          <div
            className="col-lg-6 d-flex flex-column justify-content-center pt-4 pt-lg-0 order-2 order-lg-1"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <h1 className="hero-title">Welcome to Arthdisha Consultancy Services Pvt. Ltd.</h1>
            <h5 className="hero-subtitle">
              ASCPL is an ISO 9001-2015 certified software consulting and services company
              specializing in Reginal Cooperative Sector Automation, established in the Year 2000.
            </h5>
            <h5 className="hero-subtitle">
              ACSPL has strong experience of 20+ years in providing state-of-the-art solutions for
              our customers.
            </h5>
          </div>
          <div
            className="col-lg-6 order-1 order-lg-2 d-flex justify-content-center align-items-center"
            data-aos="fade-in" // Change animation type here
            data-aos-delay="200"
          >
            <img src={hero} className="img-fluid" alt="Hero" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Home;
