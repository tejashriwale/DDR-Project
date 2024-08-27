import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ImplicationT.css';
import View from '../Component/view.png';
import Delete from '../Component/delete.png';
import Select from 'react-select';

const ImplicationT = () => {
  const [implications, setImplications] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [implicationAutoID, setImplicationAutoID] = useState('');
  const [implicationTitle, setImplicationTitle] = useState('');
  const [implicationValue, setImplicationValue] = useState('');
  const [implicationOrder, setImplicationOrder] = useState('');
  const [implicationGroup, setImplicationGroup] = useState('');
  const [isSystemDefined, setIsSystemDefined] = useState(false);
  const [isIgnored, setIsIgnored] = useState(false);
  const [serverResponse, setServerResponse] = useState('');
  const [groups, setGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchGroups = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/implications/groups');
      setGroups(response.data.map(group => ({ value: group, label: group })));
      if (response.data.length > 0) {
        setImplicationGroup({ value: response.data[0], label: response.data[0] });
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
      setServerResponse('Error fetching groups.');
    }
  };

  const fetchImplications = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/implications');
      setImplications(response.data);
    } catch (error) {
      console.error('Error fetching implications:', error);
    }
  };

  useEffect(() => {
    fetchGroups();
    fetchImplications();
  }, []);

  useEffect(() => {
    localStorage.setItem('implicationGroups', JSON.stringify(groups));
  }, [groups]);

  const handleSave = async (e) => {
    e.preventDefault();

    if (!implicationTitle || !implicationValue || !implicationOrder) {
      alert('Please fill in all required fields!');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/implications', {
        ImplicationAutoID: implicationAutoID,
        implicationTitle,
        implicationValue,
        implicationOrder,
        implicationGroup: implicationGroup.value,
        isSystemDefined,
        isIgnored
      });
      setServerResponse('Data saved successfully: ' + response.data);
      setShowForm(false);
      fetchImplications();
    } catch (error) {
      setServerResponse('Error: ' + error.message);
    }
  };

  const navigate = useNavigate();
  const handleExit = () => navigate(-1);

  const handleNewImplicationValue = () => {
    const newValue = Math.floor(Math.random() * 1000);
    setImplicationValue(newValue.toString());
  };

  const handleAddGroup = () => {
    const newGroup = prompt('Please enter new Implication Group', '').trim().toUpperCase();
    if (!newGroup || groups.find(group => group.value === newGroup)) {
      alert(`Implication Group "${newGroup}" Already Exists!`);
      return;
    }
    const newGroupOption = { value: newGroup, label: newGroup };
    setGroups((prevGroups) => [...prevGroups, newGroupOption]);
    setImplicationGroup(newGroupOption);
  };

  const handleAddNew = () => {
    setImplicationAutoID('');
    setImplicationTitle('');
    setImplicationValue('');
    setImplicationOrder('');
    setImplicationGroup();
    setIsSystemDefined(false);
    setIsIgnored(false);
    setShowForm(true);
  };

  const handleShowMore = (implication) => {
    setImplicationAutoID(implication.ImplicationAutoID);
    setImplicationTitle(implication.ImplicationTitle);
    setImplicationValue(implication.ImplicationValue);
    setImplicationOrder(implication.ImplicationOrder);
    setImplicationGroup({ value: implication.ImplicationGroup, label: implication.ImplicationGroup });
    setIsSystemDefined(implication.isSystemDefined);
    setIsIgnored(implication.isIgnored);
    setShowForm(true);
  };

  const handleDelete = async (implicationId) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this implication?');
    if (!isConfirmed) {
      return;
    }

    try {
      const response = await axios.patch(`http://localhost:5000/api/implications/${implicationId}`, {
        IsDeleted: 1
      });

      if (response.status === 200) {
        setServerResponse('Implication deleted successfully!');
        fetchImplications();
      } else {
        setServerResponse('Error deleting implication.');
      }
    } catch (error) {
      setServerResponse('Error: ' + error.message);
    }
  };

  const convertMarathiToArabic = (text) => {
    if (typeof text !== 'string') {
      text = String(text);
    }
    const marathiNumbers = '०१२३४५६७८९';
    const arabicNumbers = '0123456789';
    return text.split('').map(char => {
      const index = marathiNumbers.indexOf(char);
      return index !== -1 ? arabicNumbers[index] : char;
    }).join('');
  };

  const filteredImplications = implications.filter((implication) => {
    const searchTermArabic = convertMarathiToArabic(searchTerm.toLowerCase());
    return (
      implication.ImplicationTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      implication.ImplicationValue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      convertMarathiToArabic(implication.ImplicationValue).includes(searchTermArabic) ||
      String(implication.ImplicationOrder).toLowerCase().includes(searchTerm.toLowerCase()) ||
      convertMarathiToArabic(String(implication.ImplicationOrder)).includes(searchTermArabic) ||
      implication.ImplicationGroup.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="container mt-4">
      {!showForm ? (
        <>
          <div className="d-flex justify-content-between mb-2 align-items-center">
            <h3 className='ac'>Implication</h3>
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
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="thead-dark">
                <tr>
                  <th style={{ width: '50%' }}>Title</th>
                  <th style={{ width: '10%' }}>Value</th>
                  <th style={{ width: '10%' }}>Order</th>
                  <th style={{ width: '20%' }}>Group</th>
                  <th style={{ width: '5%' }}>&#8943;</th>
                  <th style={{ width: '5%' }}>&#8943;</th>
                </tr>
              </thead>
              <tbody>
                {filteredImplications.map((implication) => (
                  <tr key={implication.ImplicationAutoID}>
                    <td style={{ width: '50%' }} title={implication.ImplicationTitle}>
                      {implication.ImplicationTitle}
                    </td>
                    <td style={{ width: '10%' }}>{implication.ImplicationValue}</td>
                    <td style={{ width: '10%' }} className="text-center">
                      {implication.ImplicationOrder}
                    </td>
                    <td style={{ width: '20%' }}>{implication.ImplicationGroup}</td>
                    <td style={{ width: '5%' }} className="text-center">
                      <a href="#!" title="Show More" onClick={() => handleShowMore(implication)}>
                        <img src={View} alt="view" className="view" style={{ width: '30px', height: '30px' }} />
                      </a>
                    </td>
                    <td style={{ width: '5%' }} className="text-center">
                      <a href="#!" title="Delete Row" onClick={() => handleDelete(implication.ImplicationAutoID)}>
                        <img src={Delete} alt="delete" className="delete" style={{ width: '30px', height: '30px' }} />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="container mt-3">
          <form onSubmit={handleSave}>
            <div className="mb-3 row">
              <label htmlFor="implicationTitle" className="col-sm-2 col-form-label">Title</label>
              <div className="col-sm-10">
                <input
                  type="text"
                  className="form-control custom-input-height"
                  id="implicationTitle"
                  placeholder="Title…"
                  value={implicationTitle}
                  onChange={(e) => setImplicationTitle(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-3 row">
              <label htmlFor="implicationValue" className="col-sm-2 col-form-label">Value (Code)</label>
              <div className="col-sm-2">
                <input
                  type="text"
                  className="form-control custom-input-height"
                  id="implicationValue"
                  maxLength="10"
                  placeholder="Code…"
                  value={implicationValue}
                  onChange={(e) => setImplicationValue(e.target.value)}
                  required
                />
              </div>
              <div className="col-sm-2">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleNewImplicationValue}
                  title="Get New Implication Value"
                >
                  &#x21bb;
                </button>
              </div>
            </div>

            <div className="mb-3 row">
              <label htmlFor="implicationOrder" className="col-sm-2 col-form-label">Order</label>
              <div className="col-sm-2">
                <input
                  type="text"
                  className="form-control custom-input-height"
                  id="implicationOrder"
                  placeholder="Sorting Order…"
                  value={implicationOrder}
                  onChange={(e) => setImplicationOrder(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-3 row">
              <label htmlFor="implicationGroup" className="col-sm-2 col-form-label">
                <button type="button" className="btn btn-link p-0" onClick={handleAddGroup}>
                  Group
                </button>
              </label>
              <div className="col-sm-5">
                <Select
                  id="implicationGroup"
                  value={implicationGroup}
                  onChange={setImplicationGroup}
                  options={groups}
                  isSearchable
                  placeholder="Select or search a group..."
                  required
                />
              </div>
            </div>

            <div className="d-flex justify-content-between mt-4">
              <button type="submit" className="btn btn-primary">Submit</button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Exit</button>
            </div>
          </form>
          <div>{serverResponse}</div>
        </div>
      )}
      
    </div>
  );
};

export default ImplicationT;
