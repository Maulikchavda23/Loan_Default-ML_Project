# Vercel Dual Project Deployment Guide

This repository contains both the **FastAPI Backend** and the **Vite React Frontend** for the Loan Default Prediction System. They are designed to be deployed as **two separate projects on Vercel** using the same GitHub repository.

---

## 1. BACKEND VERCEL PROJECT (FastAPI)

### Vercel Project Settings
- **GitHub Repository**: Select your repository (`Loan_Default-ML_Project`)
- **Root Directory**: `.` (Root)
- **Framework Preset**: `Other` (or auto-detected Python)
- **Build Command**: *(Leave empty / default)*
- **Install Command**: `pip install -r requirements.txt` *(Default handled by Vercel)*
- **Output Directory**: *(Leave empty / default)*

### Environment Variables
Configure in Vercel Project Settings > Environment Variables:
| Key | Example Value | Description |
| :--- | :--- | :--- |
| `ALLOWED_ORIGINS` | `https://your-frontend-project.vercel.app` | Comma-separated list of allowed frontend domains for CORS |

### Deployed Backend Endpoints
Once deployed, your FastAPI backend will serve the following endpoints:
- `GET /` — Service Status & Route Map
- `GET /api` — Health Check (`{"message": "Loan Default Prediction API is running"}`)
- `GET /api/model-info` — Model Metadata (Algorithm, accuracy, ROC-AUC, feature list)
- `POST /api/predict` — Loan Default Assessment (Inference endpoint)
- `GET /docs` — Interactive OpenAPI / Swagger Documentation

---

## 2. FRONTEND VERCEL PROJECT (React / Vite)

### Vercel Project Settings
- **GitHub Repository**: Select the same repository (`Loan_Default-ML_Project`)
- **Root Directory**: `frontend`
- **Framework Preset**: `Vite`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Environment Variables
Configure in Vercel Project Settings > Environment Variables:
| Key | Value Example | Description |
| :--- | :--- | :--- |
| `VITE_API_URL` | `https://your-backend-project.vercel.app/api` | Full URL of your deployed backend Vercel project |

---

## 3. Local Development Setup

### Running Backend Locally
```bash
# From project root
uvicorn api.index:app --reload --port 8000
```
Backend will run at `http://localhost:8000` with Swagger docs at `http://localhost:8000/docs`.

### Running Frontend Locally
```bash
cd frontend
npm run dev
```
Frontend will run at `http://localhost:5173`.
