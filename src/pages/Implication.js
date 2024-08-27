import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Implication.css'

const Implication = () => {
  const [implicationAutoID, setImplicationAutoID] = useState('');
  const [implicationTitle, setImplicationTitle] = useState('');
  const [implicationValue, setImplicationValue] = useState('');
  const [implicationOrder, setImplicationOrder] = useState('');
  const [implicationGroup, setImplicationGroup] = useState('');
  const [isSystemDefined, setIsSystemDefined] = useState(false);
  const [isIgnored, setIsIgnored] = useState(false);
  const [serverResponse, setServerResponse] = useState('');
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/implications/groups');
        setGroups(response.data);
        if (response.data.length > 0) {
          setImplicationGroup(response.data[0]); 
        }
      } catch (error) {
        console.error('Error fetching groups:', error);
        setServerResponse('Error fetching groups.');
      }
    };

    fetchGroups();
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
        implicationGroup,
        isSystemDefined,
        isIgnored
      });
      setServerResponse('Data saved successfully: ' + response.data);
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
    if (!newGroup || groups.includes(newGroup)) {
      alert(`Implication Group "${newGroup}" Already Exists!`);
      return;
    }
    setGroups((prevGroups) => [...prevGroups, newGroup]);
    setImplicationGroup(newGroup);
  };

  return (
    <div className="container mt-4">
      <form onSubmit={handleSave}>
        <div className="mb-2 row">
          <label htmlFor="implicationTitle" className="col-sm-2 col-form-label">Title</label>
          <div className="col-sm-8">
            <input
              type="text"
              className="form-control custom-input-height"
              id="implicationTitle"
              maxLength="50"
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
            <select
              className="form-control custom-input-height"
              id="implicationGroup"
              value={implicationGroup}
              onChange={(e) => setImplicationGroup(e.target.value)}
              required
            >
              {groups.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="d-flex justify-content-between mt-4">
          <button type="submit" className="btn btn-primary">Submit</button>
          <button type="button" className="btn btn-secondary" onClick={handleExit}>Exit</button>
        </div>
      </form>
      <div>{serverResponse}</div>
    </div>
  );
};

export default Implication;
