import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Auditor.css';
import View from '../Component/view.png';
import Delete from '../Component/delete.png';

const Auditort = () => {
  const [auditors, setAuditors] = useState([]);
  const [filteredAuditors, setFilteredAuditors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    auditorTM: '',
    auditorTE: '',
    contact: '',
    district: '',
    designation: ''
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedAuditor, setSelectedAuditor] = useState(null);

  useEffect(() => {
    const fetchAuditors = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auditors1');
        if (response.ok) {
          const data = await response.json();
          setAuditors(data);
          setFilteredAuditors(data);
        } else {
          console.error('Error fetching auditors:', response.statusText);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchAuditors();
  }, []);

  useEffect(() => {
    // Filter auditors based on search query
    const filtered = auditors.filter(auditor =>
      auditor.AUDITORTM.toLowerCase().includes(searchQuery.toLowerCase()) ||
      auditor.CONTACT.includes(searchQuery) ||
      auditor.DISTRICT.toLowerCase().includes(searchQuery.toLowerCase()) ||
      auditor.DESIGNATION.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredAuditors(filtered);
  }, [searchQuery, auditors]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isConfirmed = window.confirm('Are you sure you want to save this data?');
    if (!isConfirmed) {
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auditors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Form data submitted:', result);

        setSuccessMessage('Data saved successfully!');
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);

        setFormData({
          auditorTM: '',
          auditorTE: '',
          contact: '',
          district: '',
          designation: ''
        });

        const updatedResponse = await fetch('http://localhost:5000/api/auditors1');
        if (updatedResponse.ok) {
          const updatedData = await updatedResponse.json();
          setAuditors(updatedData);
        } else {
          console.error('Error fetching updated auditors:', updatedResponse.statusText);
        }

        setShowForm(false);
        setSelectedAuditor(null);
      } else {
        console.error('Error submitting form:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAddNew = () => {
    setFormData({
      auditorTM: '',
      auditorTE: '',
      contact: '',
      district: '',
      designation: ''
    });
    setShowForm(true);
    setSelectedAuditor(null);
  };

  const handleExit = () => {
    setShowForm(false);
    setSelectedAuditor(null);
  };

  const handleShowMore = (auditor) => {
    setFormData({
      auditorTM: auditor.AUDITORTM,
      auditorTE: auditor.AUDITORTE,
      contact: auditor.CONTACT,
      district: auditor.DISTRICT,
      designation: auditor.DESIGNATION
    });
    setSelectedAuditor(auditor);
    setShowForm(true);
  };

  const handleDelete = async (auditorId) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this auditor?');
    if (!isConfirmed) {
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:5000/api/auditors/${auditorId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ IsDeleted: 1 })
      });
  
      if (response.ok) {
        setSuccessMessage('Auditor deleted successfully!');
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
  
        const updatedResponse = await fetch('http://localhost:5000/api/auditors1');
        if (updatedResponse.ok) {
          const updatedData = await updatedResponse.json();
          setAuditors(updatedData);
        } else {
          console.error('Error fetching updated auditors:', updatedResponse.statusText);
        }
      } else {
        setErrorMessage('Error deleting auditor.');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
        console.error('Error deleting auditor:', response.statusText);
      }
    } catch (error) {
      setErrorMessage('Error deleting auditor.');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
      console.error('Error:', error);
    }
  };

  return (
    <div className="container mt-4">
      {showForm ? (
        <>
          {successMessage && <div className="alert alert-success">{successMessage}</div>}
          {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-lg-6 col-12 mb-3">
                <div className="d-flex align-items-left flex-column flex-lg-row">
                  <label htmlFor="auditorTM" className="form-label fixed-label">ऑडिटरचे नाव मराठी:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="auditorTM"
                    value={formData.auditorTM}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="col-lg-6 col-12 mb-3">
                <div className="d-flex align-items-left flex-column flex-lg-row">
                  <label htmlFor="auditorTE" className="form-label fixed-label">ऑडिटरचे नाव इंग्रजी:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="auditorTE"
                    value={formData.auditorTE}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-lg-6 col-12 mb-3">
                <div className="d-flex align-items-left flex-column flex-lg-row">
                  <label htmlFor="contact" className="form-label fixed-label">मोबाइल:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="col-lg-6 col-12 mb-3">
                <div className="d-flex align-items-left flex-column flex-lg-row">
                  <label htmlFor="district" className="form-label fixed-label">जिल्हा :</label>
                  <input
                    type="text"
                    className="form-control"
                    id="district"
                    value={formData.district}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-lg-6 col-12 mb-3">
                <div className="d-flex align-items-left flex-column flex-lg-row">
                  <label htmlFor="designation" className="form-label fixed-label">Designation:</label>
                  <textarea
                    className="form-control w-100"
                    id="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="d-flex flex-column flex-md-row justify-content-between mt-4">
              <button type="submit" className="btn btn-primary mb-2 mb-md-0">Submit</button>
              <button type="button" className="btn btn-secondary" onClick={handleExit}>Exit</button>
            </div>
          </form>
        </>
      ) : (
        <>
          {successMessage && <div className="alert alert-success">{successMessage}</div>}
          {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
          <div className="d-flex justify-content-between mb-2">
            <h2 className='ac'>Auditor</h2>
            <div className="d-flex align-items-center">
              <input
                type="text"
                className="form-control me-2"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ maxWidth: '300px' }} // Adjust the width as needed
              />
              <button className="btn btn-primary" onClick={handleAddNew}>New</button>
            </div>
          </div>
          <div className="table-responsive mb-2">
            <table className="table table-bordered">
              <thead className="thead-dark">
                <tr>
                  <th style={{ width: '30%' }}>ऑडिटरचे नाव</th>
                  <th style={{ width: '10%' }}>मोबाइल</th>
                  <th style={{ width: '20%' }}>जिल्हा</th>
                  <th style={{ width: '30%' }}>Designation</th>
                  <th style={{ width: '10%' }} colSpan="2">
                    &#8943;
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAuditors.map((auditor) => (
                  <tr key={auditor.id}>
                    <td style={{ width: '30%' }}>{auditor.AUDITORTM}</td>
                    <td style={{ width: '10%' }}>{auditor.CONTACT}</td>
                    <td style={{ width: '20%' }}>{auditor.DISTRICT}</td>
                    <td style={{ width: '30%' }}>{auditor.DESIGNATION}</td>
                    <td className="text-center" style={{ width: '5%' }}>
                      <a href="#!" title="Show More" onClick={() => handleShowMore(auditor)}>
                        <img src={View} alt="view" className="view" style={{ width: '30px', height: '30px' }} />
                      </a>
                    </td>
                    <td className="text-center" style={{ width: '5%' }}>
                      <a href="#!" title="Delete Row" onClick={() => handleDelete(auditor.ADTAID)}>
                        <img src={Delete} alt="delete" className="delete" style={{ width: '30px', height: '30px' }} />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Auditort;
