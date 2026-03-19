# Cybersecurity Risk Assessment Tool for SMEs

## Overview

This project presents a lightweight cybersecurity risk assessment tool designed specifically for Small and Medium-sized Enterprises (SMEs).

The tool simplifies the risk assessment process by providing:
- A structured questionnaire-based assessment
- Automated risk scoring
- Clear risk prioritization
- Actionable mitigation recommendations
- Historical tracking of assessments

The system addresses the limitations of traditional frameworks such as ISO/IEC 27005, NIST SP 800-30, OCTAVE, and FAIR, which are often too complex, resource-intensive, and difficult to implement in SME environments.

---

## System Architecture

The application follows a **client-server architecture**:

- **Frontend**: React-based user interface
- **Backend**: Flask REST API
- **Database**: SQLite (lightweight deployment)
- **Communication**: RESTful API using JSON
- **Frontend API calls**: Axios

---

## Repository Structure
risk_assessment_tool/
backend/ # Flask API, business logic, and database handling
frontend/ # React user interface
README.md


---

## Technologies Used

### Backend
- Python
- Flask
- SQLite

### Frontend
- React
- Axios
- Chart.js
- CSS

---

## Features

- User registration and authentication
- Company profile management
- Risk assessment across six cybersecurity domains:
  - Network Security
  - Access Control
  - Asset Management
  - Data Protection
  - Incident Response
  - Policies & Compliance
- Automated risk scoring (Likelihood × Impact)
- Risk categorization (Low / Medium / High)
- Visualization using charts and risk matrices
- Historical assessment tracking

---

## Setup Instructions

### Prerequisites
Make sure you have installed:
- Python 3.x
- Node.js
- npm

---

###  Clone the Repository

git clone https://github.com/georgecosta28/risk_assessment_tool.git
cd risk_assessment_tool

### Backend 
cd backend

pip install -r requirements.txt

python init_db.py

python app.py

### The backend will run on:

http://localhost:5000

### Frontend 

Open a new terminal:

cd frontend

npm install

Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process

npm start

### The frontend will run on:

http://localhost:3000


Author

George Costa
