import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Signin.css';
import AppIcon from './Logo500.png';

const Signin = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginSuccess(false);

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (result.success) {
        setLoginSuccess(true);
        onLoginSuccess();  
        navigate('/Home');  
      } else {
        setLoginError(result.message);
      }
    } catch (error) {
      setLoginError('An error occurred. Please try again.');
    }
  };

  return (
    <section className="vh-100 d-flex justify-content-center align-items-center custom-bg-blue">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-6 text-center mb-4">
            <img src={AppIcon} alt="Logo" className="img-fluid" style={{ maxWidth: '100%', marginTop: '70px' }} />
          </div>
          <div className="col-12 col-md-8 col-lg-6">
            <form onSubmit={handleLogin} className="bg-white p-4 p-md-5 rounded shadow-sm">
              <h2 className="text-center mb-4">Sign In</h2>
              <div className="form-outline mb-4">
                <input
                  type="email"
                  id="form3Example3"
                  className="form-control form-control-lg"
                  placeholder="Enter a valid email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <label className="form-label" htmlFor="form3Example3">
                  Email address
                </label>
              </div>

              <div className="form-outline mb-4">
                <input
                  type="password"
                  id="form3Example4"
                  className="form-control form-control-lg"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <label className="form-label" htmlFor="form3Example4">
                  Password
                </label>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                    id="form2Example3"
                  />
                  <label className="form-check-label" htmlFor="form2Example3">
                    Remember me
                  </label>
                </div>
                <a href="#!" className="text-body">Forgot password?</a>
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}>
                  Login
                </button>
                {loginError && <p className="text-danger mt-2">{loginError}</p>}
                {loginSuccess && <p className="text-success mt-2">Login successful!</p>}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signin;
