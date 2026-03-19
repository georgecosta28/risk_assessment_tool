import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';
import RiskBarChart from './RiskBarChart';
import CategoryBarChart from './CategoryBarChart';
import RiskMatrixChart from './RiskMatrixChart';

export default function ResultsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);

  const QUESTIONS = ['Do you have a basic firewall protecting your internet connection?',
    'Is your Wi-Fi protected with strong password?',
    'Are your devices updated regularly?',
    'Do you avoid using default passwords?',
    'Is antivirus software installed on your systems?',
    'Do you restrict access to your network?',
    'Can you detect if someone tries to hack your network?',
    'Do you use a VPN when working remotely?',
    'Is your internet router securely configured?',
    'Are unused network services disabled?','Do users have their own logins and passwords?',
    'Are passwords changed regularly?',
    'Is there a policy for strong passwords?',
    'Can only authorized staff access sensitive data?',
    'Are old user accounts removed quickly?',
    'Do only trusted staff have administrator (full control) access to systems?',
    'Do you use two-factor authentication where possible?',
    'Are shared accounts avoided?',
    'Can users access only what they need?',
    'Do you track who logs in to your systems?','Do you know what to do if there is a cyberattack?',
    'Is there a simple written plan for security incidents?',
    'Have your staff been told what to do in an emergency?',
    'Do you know how to report a cyber incident?',
    'Do you regularly back up your data?',
    'Have you practiced handling a fake cyber incident?',
    'Can you quickly disconnect affected systems?',
    'Do you know who to contact for help in a cyber event?',
    'Is there a clear person responsible for security?',
    'Can you recover files if they are lost or stolen?',
    'Do you keep a list of your computers and devices?',
    'Do you know what software is installed on your devices?',
    'Do you track who is using what device?',
    'Are old or unused devices securely removed?',
    'Is company data kept separate from personal data?',
    'Do you know where your important data is stored?',
    'Do you manage cloud storage accounts (like Google Drive)?',
    'Are USBs and portable devices controlled or blocked?',
    'Are devices protected if lost or stolen?',
    'Do you remove company data from old devices before disposal?',
    'Do you have a basic written security policy?',
    'Do employees agree to follow rules for IT use?',
    'Are staff trained in cybersecurity basics?',
    'Do you know what laws or regulations you must follow?',
    'Is someone responsible for keeping policies updated?',
    'Do you know if your data is stored securely?',
    'Do you check if security rules are being followed?',
    'Are third-party services (like IT support) reviewed for security?',
    'Are you aware of GDPR or privacy laws if handling personal data?',
    'Are policies updated when changes in the business happen?','Is sensitive data (like personal or financial info) stored securely?',
    'Is data encrypted when saved to devices or cloud storage?',
    'Is data encrypted when sent over the internet?',
    'Do you use HTTPS for websites or services?',
    'Are backups protected with encryption or passwords?',
    'Do only authorized people have access to important data?',
    'Are passwords stored securely (not in plain text)?',
    'Is data removed properly from old devices before disposal?',
    'Is there a process for deleting data when it’s no longer needed?',
    'Is there a simple policy that explains how you protect data?'
   ];
  const RECOMMENDATIONS = ['Use hardware and software firewalls to block unauthorized access.',
     'Use WPA2/WPA3 encryption and a strong password for Wi-Fi.',
     'Enable automatic updates for OS and applications.',
     'Always change default passwords on all systems/devices.',
     'Install and maintain antivirus/anti-malware tools.',
     'Use network access control and isolate guest networks.',
     'Implement intrusion detection or firewall monitoring.', 
     'Use VPNs for secure remote access.', 
     'Secure routers with strong credentials and updated firmware.', 
     'Disable unnecessary network services (e.g., Telnet, FTP).', 
     'Assign unique logins to each user for tracking and control.', 
     'Force regular password changes (e.g., every 90 days).', 
     'Create a strong password policy and enforce it.', 
     'Use role-based access control to protect sensitive data.', 
     'Immediately remove unused or inactive user accounts.', 
     'Restrict admin rights to essential personnel only.', 
     'Enable two-factor authentication for sensitive access.', 
     'Use individual accounts, avoid shared credentials.', 
     'Apply least-privilege access principles.', 
     'Log and monitor user login activities.', 
     'Develop a clear incident response plan.', 
     'Document and distribute your security incident plan.', 
     'Train staff on what to do during an incident.', 
     'Define a reporting path for security events.', 
     'Automate and test data backups regularly.', 
     'Perform tabletop exercises for cyberattack scenarios.', 
     'Ensure systems can be isolated quickly during incidents.', 
     'Maintain contact list for security service providers.', 
     'Designate a security officer or team lead.', 
     'Test data recovery procedures often.', 
     'Maintain a live IT asset inventory.', 
     'Track software installations per device.', 
     'Assign assets and monitor usage.', 
     'Wipe and dispose of unused devices securely.', 
     'Separate personal and company data on all devices.', 
     'Map data locations across your systems and cloud.', 
     'Manage access to corporate cloud platforms.', 
     'Control or encrypt USB access to prevent leaks.', 
     'Use encryption and remote wipe on mobile devices.', 
     'Wipe all storage before device disposal.', 
     'Create a security policy and distribute it.', 
     'Have employees sign an IT use agreement.', 
     'Train staff in basic cybersecurity awareness.', 
     'Ensure compliance with applicable regulations.', 
     'Assign someone to update security policies.', 
     'Audit and validate secure data storage methods.', 
     'Conduct internal audits of rule enforcement.', 
     'Vet vendors for their cybersecurity posture.', 
     'Ensure GDPR/privacy compliance if collecting data.', 
     'Review policies when your tech or team changes.', 
     'Encrypt and control access to sensitive data.', 
     'Use encryption for files at rest (AES-256).', 
     'Use SSL/TLS to encrypt data in transit.', 
     'Secure all sites with valid HTTPS certificates.', 
     'Encrypt and secure backup locations.', 
     'Limit access to data to authorized users only.', 
     'Use hashed passwords with secure algorithms.', 
     'Wipe old devices before resale or disposal.', 
     'Automate deletion of obsolete data.', 
     'Develop a simple, clear Data Protection Policy.'];

  const CATEGORIES = [
    'Network Security',
    'Access Control',
    'Incident Response',
    'Asset Management',
    'Policy & Compliance',
    'Data Protection'
  ];

  const getCategoryAverages = (details) => {
    const obj = {};
    const arr = [];
    CATEGORIES.forEach((category, i) => {
      const start = i * 10;
      const section = details.slice(start, start + 10);
      const avg = parseFloat((section.reduce((s, q) => s + q.score, 0) / section.length).toFixed(2));
      obj[category] = avg;
      arr.push({ category, average: avg });
    });
    return { object: obj, array: arr };
  };

  const getColor = (avg) => avg <= 5 ? 'green' : avg <= 10 ? 'orange' : 'red';

  const colorMap = {
    Low: 'green',
    Medium: 'orange',
    High: 'red'
  };

  useEffect(() => {
    API.get(`/assessment/${id}`).then((res) => setResult(res.data));
  }, [id]);

  if (!result) return <p>Loading...</p>;

  const { object: categoryAverages, array: categoryChartData } = getCategoryAverages(result.details);

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Assessment Results</h2>
      <p><strong>Score:</strong> {result.risk_score.toFixed(2)}</p>
      <p><strong>Date:</strong> {new Date(result.created_at).toLocaleString()}</p>

      <div style={{ marginTop: '30px' }}>
        <h3>Risk Level Distribution</h3>
        <RiskBarChart details={result.details} />
      </div>

      <div style={{ marginTop: '40px' }}>
        <h3>Risk Matrix</h3>
        <RiskMatrixChart details={result.details} />
      </div>

      <div style={{ marginTop: '40px' }}>
        <h3>Average Scores per Category</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {categoryChartData.map(item => (
            <div key={item.category} style={{ width: '260px', padding: '10px', border: '1px solid #ddd' }}>
              <h4 style={{ textAlign: 'center' }}>{item.category}</h4>
              <CategoryBarChart average={item.average} color={getColor(item.average)} />
              <p style={{ textAlign: 'center' }}>Average Score: {item.average}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '50px' }}>
        <h3>Detailed Question Results & Recommendations</h3>
        <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: '10px' }}>
          <thead>
            <tr style={{ backgroundColor: '#e0e0e0' }}>
              <th style={thStyle}>#</th>
              <th style={thStyle}>Question</th>
              <th style={thStyle}>Impact</th>
              <th style={thStyle}>Likelihood</th>
              <th style={thStyle}>Score</th>
              <th style={thStyle}>Risk Level</th>
              <th style={thStyle}>Recommendation</th>
            </tr>
          </thead>
          <tbody>
            {result.details.map((item, idx) => (
              <tr key={idx}>
                <td style={tdStyle}>{item.question}</td>
                <td style={{ ...tdStyle, whiteSpace: 'normal' }}>{QUESTIONS[item.question - 1]}</td>
                <td style={tdStyle}>{item.impact}</td>
                <td style={tdStyle}>{item.likelihood}</td>
                <td style={tdStyle}>{item.score}</td>
                <td style={{ ...tdStyle, fontWeight: 'bold', color: colorMap[item.level] }}>{item.level}</td>
                <td style={{ ...tdStyle, fontStyle: 'italic', color: '#555' }}>
                  {RECOMMENDATIONS[item.question - 1]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button onClick={() => navigate('/dashboard')}
        style={{
          marginTop: '40px',
          padding: '10px 20px',
          backgroundColor: '#0074cc',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}>
        Back to Dashboard
      </button>
    </div>
  );
}

const thStyle = {
  padding: '10px',
  border: '1px solid #ccc',
  textAlign: 'left',
  fontWeight: 'bold'
};

const tdStyle = {
  padding: '10px',
  border: '1px solid #ccc',
  textAlign: 'left',
  verticalAlign: 'top'
};