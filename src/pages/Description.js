import React, { useState, useEffect } from 'react';
import './Description.css'; // Include your CSS file
import { useNavigate } from 'react-router-dom';

const Description = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
   
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/organizations');
        const result = await response.json();
        setData(result); // Set the fetched data
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleSave = () => {
    alert('Save button clicked');
  };

  const handleExit = () => {
    navigate('/Home');
  };

  return (
    <div className="description-container container mt-3">
      <div className="justify-content-between mb-2">
        <h2 className='ac'>Description</h2>
      </div>
      <div className="table-scroll-container">
        <table>
          <colgroup>
            <col style={{ width: '250px' }} />
            <col style={{ width: '160px' }} />
            <col style={{ width: '160px' }} />
            <col style={{ width: '250px' }} />
            <col style={{ width: '250px' }} />
            <col style={{ width: '160px' }} />
            <col style={{ width: '250px' }} />
            <col style={{ width: '250px' }} />
            <col style={{ width: '160px' }} />
            <col style={{ width: '160px' }} />
            <col style={{ width: '160px' }} />
            <col style={{ width: '160px' }} />
            <col style={{ width: '160px' }} />
            <col style={{ width: '160px' }} />
            <col style={{ width: '160px' }} />
            <col style={{ width: '160px' }} />
            <col style={{ width: '160px' }} />
          </colgroup>
          <thead>
            <tr className='af'>
              <th className='af'>संस्थेचे नाव</th>
              <th className='af'>वार्षिक सर्वसाधारण सभा दिनांक</th>
              <th className='af'>ठराव क्रमांक</th>
              <th className='af'>ठराव प्राप्त ले.प. यांचे नाव</th>
              <th className='af'>ठराव प्राप्त ले.प. यांचे पदनाम</th>
              <th className='af'>कलम 81(1) (अ) चे परंतुकान्वये आदेश दिनांक</th>
              <th className='af'>परंतुकान्वये आदेश प्राप्त ले.प.यांचे नाव</th>
              <th className='af'>परंतुकान्वये आदेश प्राप्त ले.प.यांचे पदनाम</th>
              <th className='af'>सन 2023-24 चा ले.प.अहवाल प्राप्त दिनांक</th>
              <th className='af'>सन 2023-24 चा दोषदुरुस्तीअहवाल प्राप्त दिनांक</th>
              <th className='af'>सन 2023-24 चा छाननीअहवाल प्राप्त दिनांक</th>
              <th className='af'>सन 2023-24 चा विशेष अहवाल प्राप्त दिनां</th>
              <th className='af'>सन 2023-24 चा विर्निदिष्ट अहवाल (लागू असल्यास)</th>
              <th className='af'>सन 2023-24 चा चाचणी ले.प अहवाल (लागू असल्यास)</th>
              <th className='af'>सन 2023-24 चा फेरलेखापरीक्षण अहवाल (लागू असल्यास)</th>
              <th className='af'>संबंधित निबंधकाने कार्यवाही केलेले पुर्ण अहवाल</th>
              <th className='af'>फौजदारी कार्यवाहीसाठी दाखल FIR संख्या</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className='af'>
                <td className='af'>{item.PAXTM || 'N/A'}</td>
                <td className='af'><input type="date" defaultValue={item.date1} /></td>
                <td className='af'><input type="text" defaultValue={item.text1} /></td>
                <td className='af'><input type="text" defaultValue={item.text2} /></td>
                <td className='af'><input type="text" defaultValue={item.designation} /></td>
                <td className='af'><input type="date" defaultValue={item.date2} /></td>
                <td className='af'><input type="text" defaultValue={item.text3} /></td>
                <td className='af'><input type="text" defaultValue={item.text4} /></td>
                <td className='af'><input type="date" defaultValue={item.date3} /></td>
                <td className='af'><input type="date" defaultValue={item.date4} /></td>
                <td className='af'><input type="date" defaultValue={item.date5} /></td>
                <td className='af'><input type="date" defaultValue={item.date6} /></td>
                <td className='af'>
                  <select defaultValue={item.select1}>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </td>
                <td className='af'>
                  <select defaultValue={item.select2}>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </td>
                <td className='af'>
                  <select defaultValue={item.select3}>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </td>
                <td className='af'>
                  <select defaultValue={item.select4}>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </td>
                <td className='af'><input type="text" className="aRight" defaultValue={item.firNumber} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="button-container">
        <button className="btn btn-primary" onClick={handleSave}>Save</button>
        <button className="btn btn-secondary" onClick={handleExit}>Exit</button>
      </div>
    </div>
  );
}

export default Description;
