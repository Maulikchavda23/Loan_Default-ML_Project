from pydantic import BaseModel, Field
from typing import Union, Optional, List

class PredictionRequest(BaseModel):
    Age: int = Field(..., ge=18, le=100, description="Applicant age in years (18-100)", json_schema_extra={"example": 35})
    Income: float = Field(..., gt=0, description="Annual income in USD", json_schema_extra={"example": 50000})
    LoanAmount: float = Field(..., gt=0, description="Requested loan amount in USD", json_schema_extra={"example": 20000})
    CreditScore: int = Field(..., ge=300, le=850, description="Credit score (300-850)", json_schema_extra={"example": 700})
    MonthsEmployed: int = Field(..., ge=0, description="Number of months employed", json_schema_extra={"example": 60})
    NumCreditLines: int = Field(..., ge=0, description="Number of existing credit lines", json_schema_extra={"example": 3})
    InterestRate: float = Field(..., ge=0.0, le=100.0, description="Interest rate percentage", json_schema_extra={"example": 8.5})
    LoanTerm: int = Field(..., gt=0, description="Loan term in months", json_schema_extra={"example": 36})
    DTIRatio: float = Field(..., ge=0.0, le=1.0, description="Debt-to-Income ratio (0.0 to 1.0)", json_schema_extra={"example": 0.25})
    Education: str = Field(..., description="Education level", json_schema_extra={"example": "Bachelor's"})
    EmploymentType: str = Field(..., description="Employment type", json_schema_extra={"example": "Full-time"})
    MaritalStatus: str = Field(..., description="Marital status", json_schema_extra={"example": "Single"})
    HasMortgage: Union[int, str] = Field(..., description="1/'Yes' or 0/'No'", json_schema_extra={"example": 1})
    HasDependents: Union[int, str] = Field(..., description="1/'Yes' or 0/'No'", json_schema_extra={"example": 0})
    LoanPurpose: str = Field(..., description="Purpose of the loan", json_schema_extra={"example": "Home"})
    HasCoSigner: Union[int, str] = Field(..., description="1/'Yes' or 0/'No'", json_schema_extra={"example": 1})

class PredictionResponse(BaseModel):
    prediction: int = Field(..., description="Target prediction: 0 (No Default) or 1 (Default)")
    prediction_label: str = Field(..., description="Readable label: 'No Default' or 'Default'")
    default_probability: float = Field(..., description="Predicted probability of loan default (0.0 to 1.0)")
    risk_level: str = Field(..., description="Risk tier: 'Low Risk', 'Medium Risk', or 'High Risk'")
    recommendation: Optional[str] = Field(None, description="Contextual guidance note for credit review")
    risk_factors: Optional[List[str]] = Field(default_factory=list, description="Key applicant risk indicators")

class ModelInfoResponse(BaseModel):
    algorithm: str = Field(default="Logistic Regression", description="Machine learning algorithm name")
    accuracy: float = Field(..., description="Model accuracy score")
    roc_auc: Optional[float] = Field(None, description="ROC-AUC metric score")
    num_features: int = Field(..., description="Total input features expected")
    num_cols: List[str] = Field(..., description="Numerical feature column names")
    cat_cols: List[str] = Field(..., description="Categorical feature column names")
