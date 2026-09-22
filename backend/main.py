import os
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes.prediction import router as prediction_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("main")

app = FastAPI(
    title="LoanGuard - Loan Default Prediction API",
    description="Enterprise REST API for evaluating credit default risk using Logistic Regression machine learning model.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS for local development and production Vercel domains
allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "")
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

if allowed_origins_env:
    for origin in allowed_origins_env.split(","):
        cleaned = origin.strip()
        if cleaned and cleaned not in origins:
            origins.append(cleaned)

allow_all = "*" in origins or allowed_origins_env.strip() == "*"

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if allow_all else origins,
    allow_credentials=not allow_all,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register prediction router under /api
app.include_router(
    prediction_router,
    prefix="/api",
    tags=["Loan Default Prediction"]
)

@app.get("/", summary="Root Status")
def read_index():
    """Root endpoint for Vercel deployment health check."""
    return {
        "status": "online",
        "message": "Loan Default Prediction API is running",
        "endpoints": {
            "health": "/api",
            "model_info": "/api/model-info",
            "predict": "/api/predict",
            "docs": "/docs"
        }
    }

@app.get("/api", summary="Health Check")
def read_root():
    """Root health check endpoint."""
    return {"message": "Loan Default Prediction API is running"}