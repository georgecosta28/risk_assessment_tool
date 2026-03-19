// src/pages/AssessmentHistory.js
import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context';
import API from '../api';
import { useNavigate } from 'react-router-dom';

export default function AssessmentHistory() {
  const { company } = useAppContext();
  const [assessments, setAssessments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (company?.id) {
      API.get(`/assessments/${company.id}`)
        .then((res) => setAssessments(res.data))
        .catch((err) => {
          console.error("Failed to fetch assessments", err);
        });
    }
  }, [company]);

 const handleViewDetails = (a) => {
  API.get(`/assessment/${a.id}`).then((res) => {
    navigate('/results', { state: res.data });
  });
};


  return (
    <div style={{ padding: '20px' }}>
      <h2>Assessment History for {company?.name}</h2>

      {assessments.length === 0 ? (
        <p>No assessments found for this company.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Risk Score</th>
              <th style={thStyle}>Risk Level</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assessments.map((a) => (
              <tr key={a.id}>
                <td style={tdStyle}>{new Date(a.created_at).toLocaleString()}</td>
                <td style={tdStyle}>{a.risk_score.toFixed(2)}</td>
                <td style={tdStyle}>{a.risk_level}</td>
                <td style={tdStyle}>
                  <button onClick={() => handleViewDetails(a)}>
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const thStyle = {
  padding: '10px',
  borderBottom: '1px solid #ccc',
  textAlign: 'left',
};

const tdStyle = {
  padding: '10px',
  borderBottom: '1px solid #eee',
};
