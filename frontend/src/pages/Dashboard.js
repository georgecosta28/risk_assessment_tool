// src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context';
import API from '../api';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, company } = useAppContext();
  const [assessments, setAssessments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (company) {
      API.get(`/assessments/${company.id}`).then((res) => {
        setAssessments(res.data);
      });
    }
  }, [company]);

  const handleStartAssessment = () => {
    navigate('/assessment');
  };

  const handleViewAllHistory = () => {
    navigate('/history');
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Dashboard</h2>
        <p><strong>Welcome:</strong> {user?.username}</p>
        <p><strong>Company:</strong> {company?.name}</p>

        <div style={{ marginTop: '20px' }}>
          <button onClick={handleStartAssessment} style={{ marginRight: '10px' }}>
            Start New Assessment
          </button>

          <button onClick={handleViewAllHistory}>
            View All Past Assessments
          </button>
        </div>
      </div>

      <div className="card">
        <h3>Recent Assessments</h3>
        {assessments.length === 0 ? (
          <p>No assessments submitted yet.</p>
        ) : (
          assessments.slice(0, 3).map((a) => (
            <div key={a.id} style={{ marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid #ddd' }}>
              <p>
                🗓️ <strong>Date:</strong> {new Date(a.created_at).toLocaleString()}<br />
                📊 <strong>Score:</strong> {a.risk_score.toFixed(2)} — {a.risk_level}
              </p>
              <button
                onClick={() => navigate(`/results/${a.id}`)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#003366',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                View Results
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
