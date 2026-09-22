import os
import logging
from typing import Dict, Any, Tuple, List
import joblib
import pandas as pd
from backend.utils.preprocessing import preprocess_input

logger = logging.getLogger("loan_prediction_service")

class PredictionService:
    def __init__(self, model_path: str = None):
        if model_path is None:
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            project_root = os.path.dirname(base_dir)
            
            # Check root directory first, then backend/model/
            root_model = os.path.join(project_root, "loan_default_model.pkl")
            backend_model = os.path.join(base_dir, "model", "loan_default_model.pkl")
            
            if os.path.exists(root_model):
                model_path = root_model
            elif os.path.exists(backend_model):
                model_path = backend_model
            else:
                model_path = root_model

        self.model_path = model_path
        self.model = None
        self.load_model()

    def load_model(self):
        """Loads LogisticRegression model from disk using joblib."""
        if not os.path.exists(self.model_path):
            logger.error(f"Model file not found at {self.model_path}")
            raise FileNotFoundError(f"Model file not found at {self.model_path}")

        try:
            self.model = joblib.load(self.model_path)
            logger.info("Successfully loaded Logistic Regression model (loan_default_model.pkl).")
        except Exception as e:
            logger.error(f"Error loading model with joblib: {str(e)}")
            raise e

    def get_model_info(self) -> Dict[str, Any]:
        """Returns metadata about the loaded Logistic Regression model."""
        num_cols = ['Age', 'Income', 'LoanAmount', 'CreditScore', 'MonthsEmployed', 'NumCreditLines', 'InterestRate', 'LoanTerm', 'DTIRatio']
        cat_cols = ['Education', 'EmploymentType', 'MaritalStatus', 'HasMortgage', 'HasDependents', 'LoanPurpose', 'HasCoSigner']
        
        return {
            "algorithm": "Logistic Regression",
            "accuracy": 0.8852,
            "roc_auc": 0.7289,
            "num_features": len(num_cols) + len(cat_cols),
            "num_cols": num_cols,
            "cat_cols": cat_cols
        }

    def evaluate_risk_factors(self, input_dict: Dict[str, Any]) -> List[str]:
        """Generate human-readable risk indicators based on input values."""
        factors = []
        dti = float(input_dict.get('DTIRatio', 0))
        credit_score = int(input_dict.get('CreditScore', 700))
        interest_rate = float(input_dict.get('InterestRate', 0))
        months_emp = int(input_dict.get('MonthsEmployed', 0))
        income = float(input_dict.get('Income', 0))
        loan_amount = float(input_dict.get('LoanAmount', 0))

        if dti > 0.45:
            factors.append(f"High Debt-to-Income (DTI) ratio of {dti*100:.1f}% (Above recommended 45% limit)")
        if credit_score < 620:
            factors.append(f"Subprime Credit Score of {credit_score} points (Below standard 620 benchmark)")
        if interest_rate > 15.0:
            factors.append(f"High loan interest rate of {interest_rate}% increases debt burden")
        if months_emp < 12:
            factors.append(f"Short employment history ({months_emp} months)")
        if income > 0 and loan_amount > (income * 2.5):
            factors.append(f"Elevated Loan-to-Income ratio (${loan_amount:,.0f} requested vs ${income:,.0f} income)")
        
        if not factors:
            factors.append("Nominal financial profile with parameters within standard underwriting guidelines.")
        
        return factors

    def predict(self, input_data: Dict[str, Any]) -> Tuple[int, str, float, str, str, List[str]]:
        """
        Executes preprocessing and Logistic Regression model prediction on input dictionary.
        Returns (prediction, prediction_label, default_probability, risk_level, recommendation, risk_factors).
        """
        if self.model is None:
            raise RuntimeError("Logistic Regression model is not loaded.")

        # 1. Preprocess raw input into 1-row DataFrame matching model expected feature order & scaling
        input_df = preprocess_input(input_data)

        # 2. Model inference
        prediction = int(self.model.predict(input_df)[0])
        probabilities = self.model.predict_proba(input_df)[0]
        proba = float(probabilities[1])  # Probability of Default (class 1)

        # 3. Label & Risk Level Assignment
        prediction_label = "Default" if prediction == 1 else "No Default"

        if proba >= 0.50:
            risk_level = "High Risk"
            recommendation = "High risk of default detected. Recommend secondary manual review or additional collateral."
        elif proba >= 0.25:
            risk_level = "Medium Risk"
            recommendation = "Moderate risk footprint. Standard underwriting review recommended."
        else:
            risk_level = "Low Risk"
            recommendation = "Low risk footprint. Profile meets standard approval criteria."

        risk_factors = self.evaluate_risk_factors(input_data)

        return prediction, prediction_label, proba, risk_level, recommendation, risk_factors

# Global singleton instance
prediction_service = PredictionService()
