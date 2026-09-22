# LoanGuard - Loan Default Prediction System

Production-style credit risk assessment web application built with **React.js**, **Material UI (MUI)**, **FastAPI**, and an existing trained **Logistic Regression** machine learning pipeline.

---

## 🏛️ System Architecture

```
React Frontend (Vite + MUI)
         │  (HTTP POST /predict on port 5173 -> 8000)
         ▼
FastAPI REST API Server (Port 8000)
         │  (Preprocess & Feature Alignment)
         ▼
Logistic Regression ML Pipeline (loan_model_assets.pkl)
         │  (Inference & Probability Estimation)
         ▼
Prediction Response + Risk Tier + Underwriting Guidance
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Python 3.10+ installed
- Node.js 18+ and npm installed

---

### 1. Backend Setup (FastAPI)

1. Open a terminal and navigate to the project directory:
   ```cmd
   cd "d:\Users\Maulik Chavda\Sem-5\ML Project"
   ```

2. Install Python dependencies:
   ```cmd
   py -m pip install -r backend/requirements.txt
   ```

3. Start the FastAPI backend server:
   ```cmd
   py -m uvicorn backend.main:app --reload --port 8000
   ```

   The backend will start at:
   - **API Root**: `http://localhost:8000/`
   - **Interactive API Docs (Swagger UI)**: `http://localhost:8000/docs`
   - **Model Information Endpoint**: `http://localhost:8000/model-info`

---

### 2. Frontend Setup (React + Vite + MUI)

1. Open a new terminal and navigate to the `frontend` directory:
   ```cmd
   cd "d:\Users\Maulik Chavda\Sem-5\ML Project\frontend"
   ```

2. Install Node dependencies:
   ```cmd
   npm install
   ```

3. Launch the React development server:
   ```cmd
   npm run dev
   ```

   The web application will open at:
   - **Frontend UI**: `http://localhost:5173/`

---

## 📋 Features & Inputs

The application prediction form captures 16 applicant parameters across 3 logical sections:

1. **Applicant Information**:
   - `Age`, `Income`, `Education`, `EmploymentType`, `MaritalStatus`, `MonthsEmployed`, `HasDependents`
2. **Credit Information**:
   - `CreditScore`, `NumCreditLines`, `DTIRatio`, `HasMortgage`, `HasCoSigner`
3. **Loan Information**:
   - `LoanAmount`, `InterestRate`, `LoanTerm`, `LoanPurpose`

---

## 🛡️ Model Intelligence & Safety

- **Algorithm**: Logistic Regression
- **Verified Accuracy**: ~88.5%
- **Output Metrics**:
  - `prediction`: `0` (No Default) or `1` (Default)
  - `default_probability`: Calculated continuous probability percentage (`0.0%` to `100.0%`)
  - `risk_level`: Categorized tier (`Low Risk`, `Medium Risk`, or `High Risk`)
  - `recommendation`: Underwriting guidance clarifying that predictions support, rather than replace, institutional credit review.
