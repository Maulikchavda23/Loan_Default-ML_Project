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

# Configure CORS to allow React development server
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(
    prediction_router,
    prefix="/api",
    tags=["Loan Default Prediction"]
)

@app.get("/api", summary="Health Check")
def read_root():
    """Root health check endpoint."""
    return {"message": "Loan Default Prediction API is running"}

@app.get("/api/routes")
def show_routes():
    return {
        "routes": [
            {
                "path": route.path,
                "methods": list(route.methods or [])
            }
            for route in app.routes
        ]
    }
