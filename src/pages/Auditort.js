import React, { useState, useEffect } from 'react';
import View from '../Component/view.png';
import Delete from '../Component/delete.png';

function Auditort() {
  const [auditors, setAuditors] = useState([]);

  useEffect(() => {
    // Fetch data from the API when the component mounts
    const fetchAuditors = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auditors1');
        if (response.ok) {
          const data = await response.json();
          setAuditors(data);
        } else {
          console.error('Error fetching auditors:', response.statusText);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchAuditors();
  }, []);

  return (
    <div className="container mt-4">
      <div className="table-responsive">
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
            {auditors.map((auditor) => (
                <tr key={auditor.id}>
                    <td style={{ width: '30%' }}>{auditor.AUDITORTM}</td>
                    <td style={{ width: '10%' }}>{auditor.CONTACT}</td>
                    <td style={{ width: '20%' }}>{auditor.DISTRICT}</td>
                    <td style={{ width: '30%' }}>{auditor.DESIGNATION}</td>
                    <td className="text-center" style={{ width: '5%' }}>
                        <a href="#!" title="Show More" >
                            <img src={View} alt="view" className="view" style={{ width: '30px', height: '30px' }} />
                        </a>
                    </td>
                    <td className="text-center" style={{ width: '5%' }}>
                        <a href="#!" title="Delete Row">
                            <img src={Delete} alt="delete" className="delete" style={{ width: '30px', height: '30px' }} />
                        </a>
                    </td>
                </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Auditort;
