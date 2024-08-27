import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './DescriptionT.css';
import OrganizationForm from './Organization';
import View from '../Component/view.png';
import Delete from '../Component/delete.png';

const DescriptionT = () => {
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrganizations();
  }, []);

  useEffect(() => {
    let timeout;
    if (successMessage) {
      timeout = setTimeout(() => setSuccessMessage(''), 3000);
    }
    return () => clearTimeout(timeout);
  }, [successMessage]);

  const fetchOrganizations = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/organizations');
      setOrganizations(response.data);
    } catch (error) {
      console.error('There was an error fetching the data!', error);
    }
  };

  const handleShowMore = async (organization) => {
    await fetchOrganizations();
    setSelectedOrganization(organization);
    setShowForm(true);
  };

  const handleAddNew = async () => {
    await fetchOrganizations();
    setSelectedOrganization(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleSave = async (newOrganization) => {
    setOrganizations(prevOrganizations => [newOrganization, ...prevOrganizations]);
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    if (!id) {
      console.error('Organization ID is missing');
      return;
    }

    try {
      console.log('Deleting organization with ID:', id);
      const response = await axios.patch(`http://localhost:5000/api/organizations/${id}`, { IsDeleted: 1 });
      
      if (response.status === 200) {
        setSuccessMessage('Organization deleted successfully!');
        await fetchOrganizations();
      } else {
        console.error('Failed to delete organization:', response);
      }
    } catch (error) {
      console.error('There was an error deleting the organization!', error);
    }
  };

  const formatDate = (datetime) => {
    if (!datetime) return '';
    const date = new Date(datetime);
    return date.toISOString().split('T')[0];
  };

  const normalizeText = (text) => {
    // Normalize text to handle different encodings
    return text.normalize('NFKC').toLowerCase();
  };

  const filteredOrganizations = organizations.filter((org) => {
    const searchTermNormalized = normalizeText(searchTerm);
    return (
      normalizeText(org.PAXTM).includes(searchTermNormalized) ||
      normalizeText(org.ORGCODE).includes(searchTermNormalized) ||
      normalizeText(org.PAXTYPE).includes(searchTermNormalized) ||
      normalizeText(org.ORGID).includes(searchTermNormalized) ||
      normalizeText(formatDate(org.ORDDT)).includes(searchTermNormalized)
    );
  });

  return (
    <div className="container mt-4">
      {!showForm ? (
        <>
          <div className="d-flex justify-content-between mb-2 align-items-center">
            <h3 className='ac'>Organization List</h3>
            <div className="d-flex align-items-center">
              <input
                type="text"
                className="form-control  me-5 ac"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ maxWidth: '200px' }}
              />
              <button className="btn btn-primary me-2" onClick={handleAddNew}>Add New</button>
            </div>
          </div>

          {successMessage && (
            <div className="alert alert-success" role="alert">
              {successMessage}
            </div>
          )}

          <div className="table-wrapper">
            <div className="table-scrollable">
              <table className="table table-striped table-bordered">
                <thead className="thead-dark">
                  <tr>
                    <th style={{ width: '35%' }} title="संस्थेचे नाव">
                      संस्थेचे नाव
                    </th>
                    <th style={{ width: '10%' }} title="संस्थेचे कोड">
                      संस्थेचे कोड
                    </th>
                    <th style={{ width: '25%' }} title="संस्थेचे प्रकार">
                      संस्थेचे प्रकार
                    </th>
                    <th style={{ width: '10%' }} title="नोंदणी क्रमांक">
                      नोंदणी क्रमांक
                    </th>
                    <th style={{ width: '10%' }} title="नोंदणी दिनांक">
                      नोंदणी दिनांक
                    </th>
                    <th style={{ width: '10%' }} colSpan="2">
                      &#8943;
                    </th>
                  </tr>
                </thead>
                <tbody style={{ backgroundColor: 'lightblue' }}>
                  {filteredOrganizations.length > 0 ? (
                    filteredOrganizations.map((org, index) => (
                      <tr key={index}>
                        <td style={{ width: '35%' }}>
                          {org.PAXTM}
                        </td>
                        <td style={{ width: '10%' }}>
                          {org.ORGCODE}
                        </td>
                        <td style={{ width: '25%' }}>
                          {org.PAXTYPE}
                        </td>
                        <td style={{ width: '10%' }}>
                          {org.ORGID}
                        </td>
                        <td style={{ width: '10%' }}>
                          {formatDate(org.ORDDT)}
                        </td>
                        <td className="text-center" style={{ width: '5%' }}>
                          <a href="#!" title="Show More" onClick={() => handleShowMore(org)}>
                            <img src={View} alt="view" className="view" style={{ width: '30px', height: '30px' }} />
                          </a>
                        </td>
                        <td className="text-center" style={{ width: '5%' }}>
                          <a href="#!" title="Delete Row" onClick={() => handleDelete(org.ORGAID)}>
                            <img src={Delete} alt="delete" className="delete" style={{ width: '30px', height: '30px' }} />
                          </a>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">
                        <p>No Data Available</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="modal-footer">
            {/* <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancel</button> */}
          </div>
        </>
      ) : (
        <OrganizationForm 
          organization={selectedOrganization} 
          onClose={handleCloseForm} 
          onSave={handleSave} 
        />
      )}
    </div>
  );
};

export default DescriptionT;
