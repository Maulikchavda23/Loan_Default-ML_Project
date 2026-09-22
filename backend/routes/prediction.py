import logging
from fastapi import APIRouter, HTTPException, status
from backend.schemas.prediction_schema import PredictionRequest, PredictionResponse, ModelInfoResponse
from backend.services.prediction_service import prediction_service

logger = logging.getLogger("loan_routes")
router = APIRouter()

@router.post(
    "/predict",
    response_model=PredictionResponse,
    status_code=status.HTTP_200_OK,
    summary="Evaluate Loan Default Risk",
    description="Accepts applicant financial parameters and returns model prediction (0: No Default, 1: Default), default probability, and risk tier."
)
def predict_loan_default(request: PredictionRequest):
    try:
        input_data = request.model_dump()
        prediction, prediction_label, default_probability, risk_level, recommendation, risk_factors = (
            prediction_service.predict(input_data)
        )

        return PredictionResponse(
            prediction=prediction,
            prediction_label=prediction_label,
            default_probability=round(default_probability, 4),
            risk_level=risk_level,
            recommendation=recommendation,
            risk_factors=risk_factors
        )
    except Exception as e:
        logger.error(f"Error during loan default prediction: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to generate prediction. Please check the entered information and try again."
        )

@router.get(
    "/model-info",
    response_model=ModelInfoResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Model Intelligence Metadata",
    description="Returns metadata about the loaded Logistic Regression model including accuracy score and feature details."
)
def get_model_information():
    try:
        info = prediction_service.get_model_info()
        return ModelInfoResponse(**info)
    except Exception as e:
        logger.error(f"Error retrieving model metadata: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve model metadata."
        )
