// src/pages/Assessment.js
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context';
import API from '../api';
import { useNavigate } from 'react-router-dom';

const SECTIONS = [
  'Network Security',
  'Access Control',
  'Incident Response',
  'Asset Management',
  'Policy & Compliance',
  'Data Protection'
];

const QUESTIONS = {
  'Network Security': [
    'Do you have a basic firewall protecting your internet connection?',
    'Is your Wi-Fi protected with strong password?',
    'Are your devices updated regularly?',
    'Do you avoid using default passwords?',
    'Is antivirus software installed on your systems?',
    'Do you restrict access to your network?',
    'Can you detect if someone tries to hack your network?',
    'Do you use a VPN when working remotely?',
    'Is your internet router securely configured?',
    'Are unused network services disabled?'
  ],
  'Access Control': [
    'Do users have their own logins and passwords?',
    'Are passwords changed regularly?',
    'Is there a policy for strong passwords?',
    'Can only authorized staff access sensitive data?',
    'Are old user accounts removed quickly?',
    'Do only trusted staff have administrator (full control) access to systems?',
    'Do you use two-factor authentication where possible?',
    'Are shared accounts avoided?',
    'Can users access only what they need?',
    'Do you track who logs in to your systems?'
  ],
  'Incident Response': [
    'Do you know what to do if there is a cyberattack?',
    'Is there a simple written plan for security incidents?',
    'Have your staff been told what to do in an emergency?',
    'Do you know how to report a cyber incident?',
    'Do you regularly back up your data?',
    'Have you practiced handling a fake cyber incident?',
    'Can you quickly disconnect affected systems?',
    'Do you know who to contact for help in a cyber event?',
    'Is there a clear person responsible for security?',
    'Can you recover files if they are lost or stolen?'
  ],
  'Asset Management': [
    'Do you keep a list of your computers and devices?',
    'Do you know what software is installed on your devices?',
    'Do you track who is using what device?',
    'Are old or unused devices securely removed?',
    'Is company data kept separate from personal data?',
    'Do you know where your important data is stored?',
    'Do you manage cloud storage accounts (like Google Drive)?',
    'Are USBs and portable devices controlled or blocked?',
    'Are devices protected if lost or stolen?',
    'Do you remove company data from old devices before disposal?'
  ],
  'Policy & Compliance': [
    'Do you have a basic written security policy?',
    'Do employees agree to follow rules for IT use?',
    'Are staff trained in cybersecurity basics?',
    'Do you know what laws or regulations you must follow?',
    'Is someone responsible for keeping policies updated?',
    'Do you know if your data is stored securely?',
    'Do you check if security rules are being followed?',
    'Are third-party services (like IT support) reviewed for security?',
    'Are you aware of GDPR or privacy laws if handling personal data?',
    'Are policies updated when changes in the business happen?'
  ],
  'Data Protection': [
    'Is sensitive data (like personal or financial info) stored securely?',
    'Is data encrypted when saved to devices or cloud storage?',
    'Is data encrypted when sent over the internet?',
    'Do you use HTTPS for websites or services?',
    'Are backups protected with encryption or passwords?',
    'Do only authorized people have access to important data?',
    'Are passwords stored securely (not in plain text)?',
    'Is data removed properly from old devices before disposal?',
    'Is there a process for deleting data when it’s no longer needed?',
    'Is there a simple policy that explains how you protect data?'
  ]
};


export default function Assessment() {
  const { user, company } = useAppContext();
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState('');
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    if (!company) {
      alert('Please select a company before starting the assessment.');
      navigate('/company');
    }
  }, [company, navigate]);

  if (!company) return null;

  const totalQuestions = SECTIONS.length * 10;

  const handleAnswer = (section, index, value) => {
    const updated = { ...answers };
    if (!updated[section]) updated[section] = Array(10).fill(null);
    updated[section][index] = value;
    setAnswers(updated);
  };

  const handleSubmit = async () => {
    const allAnswers = [];

    for (let section of SECTIONS) {
      if (!answers[section]) return alert(`Please complete: ${section}`);
      for (let value of answers[section]) {
        if (value === null) return alert(`Incomplete answers in ${section}`);
        allAnswers.push({ impact: value }); // Likelihood handled in backend
      }
    }

    try {
      const res = await API.post('/submit-assessment', {
        user_id: user.id,
        company_id: company.id,
        answers: allAnswers
      });

      navigate('/results', {
        state: {
          risk_score: res.data.risk_score,
          risk_level: res.data.risk_level,
          details: res.data.details
        }
      });

    } catch (err) {
      console.error(err);
      alert('Submission failed. Check console for details.');
    }
  };

  const completed = Object.values(answers).flat().filter((v) => v !== null).length;
  const progress = Math.round((completed / totalQuestions) * 100);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>Cyber Risk Assessment</h2>
      <p>Company: {company?.name}</p>
      <p>Progress: {completed} / {totalQuestions} ({progress}%)</p>
      <progress value={progress} max="100" style={{ width: '100%' }} />

      <div style={{ marginTop: '20px' }}>
        <h3>Select a Section</h3>
        {SECTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setCurrentSection(s)}
            style={{
              marginRight: '10px',
              padding: '8px 14px',
              backgroundColor: currentSection === s ? '#005999' : '#0077cc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {currentSection && (
        <div style={{ marginTop: '30px' }}>
          <h3>{currentSection}</h3>
          {QUESTIONS[currentSection]?.map((q, i) => (
            <div key={i} style={{ marginBottom: '25px' }}>
              <p style={{ fontWeight: 'bold' }}>{q}</p>
              <div style={{ display: 'flex', gap: '30px', marginTop: '6px' }}>
                {['Yes', 'Not Sure', 'No'].map((label, idx) => {
                  const value = idx + 1;
                  return (
                    <label key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <input
                        type="radio"
                        name={`${currentSection}-${i}`}
                        value={value}
                        checked={answers[currentSection]?.[i] === value}
                        onChange={() => handleAnswer(currentSection, i, value)}
                      />
                      {label}
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {completed === totalQuestions && (
        <button
          onClick={handleSubmit}
          style={{
            marginTop: 30,
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Submit Assessment
        </button>
      )}
    </div>
  );
}