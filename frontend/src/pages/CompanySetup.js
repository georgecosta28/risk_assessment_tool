// src/pages/CompanySetup.js
import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context';
import API from '../api';
import { useNavigate } from 'react-router-dom';

export default function CompanySetup() {
  const { user, setCompany } = useAppContext();
  const [companies, setCompanies] = useState([]);
  const [form, setForm] = useState({ name: '', industry: '', size: '' });
  const navigate = useNavigate();

  // Fetch companies for this user
  useEffect(() => {
    if (user) {
      API.get(`/companies/${user.id}`).then((res) => {
        setCompanies(res.data);
      });
    }
  }, [user]);

  const handleCreate = async (e) => {
    e.preventDefault();
    const newCompany = { ...form, user_id: user.id };
    await API.post('/companies', newCompany);
    alert('✅ Company created!');
    const updated = await API.get(`/companies/${user.id}`);
    setCompanies(updated.data);
  };

  const handleSelect = (c) => {
    setCompany(c);
    navigate('/dashboard');
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Company Setup</h2>

        <form onSubmit={handleCreate}>
          <div style={{ marginBottom: '10px' }}>
            <label>Company Name</label><br />
            <input
              type="text"
              placeholder="e.g. CyberSecure Ltd"
              required
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={{ width: '100%', padding: '8px', borderRadius: '5px' }}
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label>Industry</label><br />
            <select
              value={form.industry}
              onChange={(e) => setForm({ ...form, industry: e.target.value })}
              required
              style={{ width: '100%', padding: '8px', borderRadius: '5px' }}
            >
              <option value="">-- Select Industry --</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Finance">Finance</option>
              <option value="Education">Education</option>
              <option value="Hospitality">Hospitality</option>
              <option value="Energy">Energy</option>
              <option value="Industrial">Industrial</option>
              <option value="Technology">Technology</option>
            </select>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label>Company Size</label><br />
            <input
              type="text"
              placeholder="e.g. 50-100"
              required
              onChange={(e) => setForm({ ...form, size: e.target.value })}
              style={{ width: '100%', padding: '8px', borderRadius: '5px' }}
            />
          </div>

          <button type="submit">
            ➕ Add Company
          </button>
        </form>
      </div>

      <div className="card">
        <h3>Your Companies</h3>
        {companies.length === 0 ? (
          <p>No companies yet.</p>
        ) : (
          companies.map((c) => (
            <div key={c.id} style={{ marginBottom: '10px', paddingBottom: '5px', borderBottom: '1px solid #ddd' }}>
              <strong>{c.name}</strong> ({c.industry}, {c.size})
              <br />
              <button
                onClick={() => handleSelect(c)}
                style={{ marginTop: '5px' }}
              >
                ✅ Select Company
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
