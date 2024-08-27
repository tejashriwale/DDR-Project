import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min'; 
import './Organization.css';
import Select from 'react-select'; 

const Organization = ({ organization, onClose, onSave }) => {
  const formRef = useRef(null);
  const zoneIdRef = useRef(null);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [paxTypes, setPaxTypes] = useState([]);
  const [selectedPaxType, setSelectedPaxType] = useState(null);

  useEffect(() => {
    const fetchPaxTypes = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/implications/paxtype');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPaxTypes(data);
      } catch (error) {
        console.error('Error fetching PAXTYPE values:', error);
      }
    };

    fetchPaxTypes();
  }, []);

  useEffect(() => {
    if (organization) {
      Object.keys(organization).forEach(key => {
        if (formRef.current && formRef.current[key]) {
          formRef.current[key].value = organization[key];
        }
      });
      setSelectedPaxType();
    } else {
      if (formRef.current) {
        formRef.current.reset();
      }
      if (zoneIdRef.current) {
        zoneIdRef.current.focus();
      }
      setSelectedPaxType();
    }
  }, [organization, paxTypes]);

  const handleExit = () => {
    onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setShowModal(true);
  };

  const handleConfirm = async () => {
    const formData = {
      ORGAID: organization ? organization.ORGAID : '',
      ZoneID: formRef.current.ZoneID.value,
      DIST: formRef.current.DIST.value,
      TALUKA: formRef.current.TALUKA.value,
      WATahasil: 'test',
      VILLAGE: formRef.current.VILLAGE.value,
      PAXTYPE: selectedPaxType,
      ORGCODE: formRef.current.ORGCODE.value,
      ORGID: formRef.current.ORGID.value,
      PAXTM: formRef.current.PAXTM.value,
      PAXTE: formRef.current.PAXTE.value,
      PAXADD: formRef.current.PAXADD.value,
      PAXPIN: formRef.current.PAXPIN.value,
      ORDDT: formRef.current.ORDDT.value,
      PAXLOC: "a",
      ASID: '1',
      IsDeleted: '0'
    };

    try {
      const method = organization ? 'PUT' : 'POST';
      const url = organization ? `http://localhost:5000/api/organizationupdate/${organization.ORGAID}` : 'http://localhost:5000/api/organization';

      const response = await fetch(url, {  
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      alert('Data saved successfully');
      console.log('Data saved successfully:', result);
      if (formRef.current) {
        formRef.current.reset();
      }
      if (zoneIdRef.current) {
        zoneIdRef.current.focus();
      }
      if (onSave) onSave(result);
    } catch (error) {
      alert('Error saving data');
    } finally {
      setShowModal(false);
      onClose();
    }
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const handlePaxTypeChange = (selectedOption) => {
    setSelectedPaxType(selectedOption ? selectedOption.value : null);
  };

  const options = paxTypes.map(pax => ({
    value: pax.ImplicationValue,
    label: pax.ImplicationTitle
  }));

  return (
    <div className="container mt-4">
      <form onSubmit={handleSubmit} ref={formRef}>
		    <div className="mb-3 row">
          <div className="col-sm-6 d-flex align-items-left">
            <label htmlFor="ZoneID" className="col-sm-3 col-form-label">विभाग :</label>
            <input type="text" className="form-control" id="ZoneID" name="ZoneID" required ref={zoneIdRef} />
          </div>
          <div className="col-sm-6 d-flex align-items-left">
            <label htmlFor="DIST" className="col-sm-3 col-form-label">जिल्हा :</label>
            <input type="text" className="form-control" id="DIST" name="DIST" required />
          </div>
        </div>
		<div className="mb-3 row">
        <div className="col-sm-6 d-flex align-items-left">
            <label htmlFor="TALUKA" className="col-sm-3 col-form-label">तालुका :</label>
            <input type="text" className="form-control" id="TALUKA" name="TALUKA" required />
          </div>
        </div>
      <div className="mb-3 row">
			<div className="col-sm-6 d-flex align-items-left">
				<label htmlFor="VILLAGE" className="col-sm-3 col-form-label">गाव :</label>
				<input type="text" className="form-control" id="VILLAGE" name="VILLAGE" required />
			</div>
          <div className="col-sm-6 d-flex align-items-left">
            <label htmlFor="PAXTYPE" className="col-sm-3 col-form-label">संस्थेचा प्रकार :</label>
            <div className="col-sm-9">
              <Select
                id="PAXTYPE"
                value={options.find(option => option.value === selectedPaxType)}
                onChange={handlePaxTypeChange}
                options={options}
                placeholder="Select Type"
                isSearchable
              />
            </div>
          </div>
        </div>
       <div className="mb-3 row">
          <div className="col-sm-6 d-flex align-items-left">
            <label htmlFor="ORGCODE" className="col-sm-3 col-form-label">संस्थेचा कोड :</label>
            <input type="text" className="form-control" id="ORGCODE" name="ORGCODE" required />
          </div>
          <div className="col-sm-6 d-flex align-items-left">
            <label htmlFor="ORGID" className="col-sm-3 col-form-label">संस्थेचा नोंदणी क्र. :</label>
            <input type="text" className="form-control" id="ORGID" name="ORGID" required />
          </div>
        </div>
        <div className="mb-3 row">
          <div className="col-sm-6 d-flex align-items-left">
            <label htmlFor="PAXTM" className="col-sm-3 col-form-label">संस्थेचे नाव (मराठी) :</label>
            <input type="text" className="form-control" id="PAXTM" name="PAXTM" required />
          </div>
          <div className="col-sm-6 d-flex align-items-left">
            <label htmlFor="PAXTE" className="col-sm-3 col-form-label">संस्थेचे नाव (इंग्रजी) :</label>
            <input type="text" className="form-control" id="PAXTE" name="PAXTE" required />
          </div>
        </div>
        <div className="mb-3 row">
          <div className="col-sm-6 d-flex align-items-left">
            <label htmlFor="PAXADD" className="col-sm-3 col-form-label">संस्थेचा पत्ता :</label>
            <textarea className="form-control" id="PAXADD" name="PAXADD" required />
          </div>
        </div>
        <div className="mb-3 row">
          <div className="col-sm-6 d-flex align-items-left">
            <label htmlFor="PAXPIN" className="col-sm-3 col-form-label">संस्थेचा पिन-कोड :</label>
            <input type="text" className="form-control small-input1" id="PAXPIN" name="PAXPIN" required />
          </div>
          <div className="col-sm-6 d-flex align-items-left">
            <label htmlFor="ORDDT" className="col-sm-3 col-form-label">संस्था नोंदणी दिनांक:</label>
            <input type="date" className="form-control small-input" id="ORDDT" name="ORDDT" required />
          </div>
        </div>
        <div className="d-flex justify-content-between mt-4">
          <button type="submit" className="btn btn-primary">Submit</button>
          <button type="button" className="btn btn-secondary" onClick={handleExit}>Exit</button>
        </div>
      </form>

      <div className={`modal fade ${showModal ? 'show d-block' : ''}`} tabIndex="-1" role="dialog" style={{ display: showModal ? 'block' : 'none' }}>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Confirm</h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={handleCancel}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <p>Do you want to save the data?</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
              <button type="button" className="btn btn-primary" onClick={handleConfirm}>Save</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Organization;
