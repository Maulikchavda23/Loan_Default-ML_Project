# LoanGuard Backend - Loan Default Prediction API

FastAPI REST API server for evaluating credit default risk using an existing trained Logistic Regression machine learning model.

## Features
- **Endpoints**:
  - `GET /`: Health check.
  - `GET /model-info`: Retrieve model intelligence metadata and feature information.
  - `POST /predict`: Evaluate loan default risk given applicant financial profile.
- **Auto-generated API Docs**: Interactive Swagger UI at `http://localhost:8000/docs`.

## Quick Start

### 1. Install Dependencies
```cmd
pip install -r requirements.txt
```

### 2. Run API Server
From the project root or backend directory:
```cmd
python -m uvicorn backend.main:app --reload --port 8000
```

### 3. Test API
Open your browser or API client at:
- `http://localhost:8000/`
- `http://localhost:8000/docs`
