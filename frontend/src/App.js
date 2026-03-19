// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import CompanySetup from './pages/CompanySetup';
import Dashboard from './pages/Dashboard';
import Assessment from './pages/Assessment';
import Results from './pages/Results';
import AssessmentHistory from './pages/AssessmentHistory';
import ResultsPage from './pages/ResultsPage';
import './styles.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/company" element={<CompanySetup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/assessment" element={<Assessment />} />
        <Route path="/results" element={<Results />} />
        <Route path="/history" element={<AssessmentHistory />} />
        <Route path="/results/:id" element={<ResultsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
