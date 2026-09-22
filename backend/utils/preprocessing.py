import os
import pickle
import logging
from typing import Dict, Any
import pandas as pd

logger = logging.getLogger("loan_preprocessing")

# User-friendly alias mappings to model expected raw categories
CATEGORICAL_USER_MAPPINGS = {
    'EmploymentType': {
        'Salaried': 'Full-time',
        'Full-time': 'Full-time',
        'Self-employed': 'Self-employed',
        'Business': 'Part-time',
        'Part-time': 'Part-time',
        'Unemployed': 'Unemployed'
    },
    'Education': {
        'High School': 'High School',
        'Bachelor': "Bachelor's",
        "Bachelor's": "Bachelor's",
        'Master': "Master's",
        "Master's": "Master's",
        'PhD': 'PhD'
    },
    'MaritalStatus': {
        'Single': 'Single',
        'Married': 'Married',
        'Divorced': 'Divorced',
        'Widowed': 'Single'
    },
    'LoanPurpose': {
        'Home': 'Home',
        'Car': 'Auto',
        'Auto': 'Auto',
        'Education': 'Education',
        'Business': 'Business',
        'Personal': 'Other',
        'Medical': 'Other',
        'Other': 'Other'
    }
}

_preprocessor_cache = None

def get_preprocessor():
    """Load or return cached preprocessor artifact dictionary."""
    global _preprocessor_cache
    if _preprocessor_cache is None:
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        preprocessor_path = os.path.join(base_dir, "model", "preprocessor.pkl")
        if not os.path.exists(preprocessor_path):
            raise FileNotFoundError(f"Preprocessor asset not found at {preprocessor_path}")
        with open(preprocessor_path, "rb") as f:
            _preprocessor_cache = pickle.load(f)
        logger.info("Successfully loaded preprocessor asset.")
    return _preprocessor_cache

def normalize_binary(val: Any) -> str:
    """Normalize binary fields (HasMortgage, HasDependents, HasCoSigner) to 'Yes' / 'No'."""
    if isinstance(val, (int, float)):
        return 'Yes' if int(val) == 1 else 'No'
    if isinstance(val, str):
        v = val.strip().lower()
        if v in ('1', 'yes', 'true', 'y'):
            return 'Yes'
        return 'No'
    return 'Yes' if bool(val) else 'No'

def preprocess_input(input_dict: Dict[str, Any]) -> pd.DataFrame:
    """
    Preprocesses raw API input dictionary into a 1-row Pandas DataFrame
    matching the exact feature order, LabelEncoding, and StandardScaler
    transformations used during model training in Project EDA.ipynb.
    """
    preprocessor = get_preprocessor()
    scaler = preprocessor['scaler']
    cat_mappings = preprocessor['cat_mappings']
    num_cols = preprocessor['num_cols']
    cat_cols = preprocessor['cat_cols']
    feature_order = preprocessor['feature_order']

    # 1. Clean & normalize categorical strings
    emp = str(input_dict.get('EmploymentType', 'Full-time'))
    emp_str = CATEGORICAL_USER_MAPPINGS['EmploymentType'].get(emp, 'Full-time')

    edu = str(input_dict.get('Education', "Bachelor's"))
    edu_str = CATEGORICAL_USER_MAPPINGS['Education'].get(edu, "Bachelor's")

    marital = str(input_dict.get('MaritalStatus', 'Single'))
    marital_str = CATEGORICAL_USER_MAPPINGS['MaritalStatus'].get(marital, 'Single')

    purpose = str(input_dict.get('LoanPurpose', 'Home'))
    purpose_str = CATEGORICAL_USER_MAPPINGS['LoanPurpose'].get(purpose, 'Home')

    has_mortgage_str = normalize_binary(input_dict.get('HasMortgage', 0))
    has_dependents_str = normalize_binary(input_dict.get('HasDependents', 0))
    has_cosigner_str = normalize_binary(input_dict.get('HasCoSigner', 0))

    cat_values = {
        'Education': edu_str,
        'EmploymentType': emp_str,
        'MaritalStatus': marital_str,
        'HasMortgage': has_mortgage_str,
        'HasDependents': has_dependents_str,
        'LoanPurpose': purpose_str,
        'HasCoSigner': has_cosigner_str
    }

    # 2. Encode categorical columns using training LabelEncoder mappings
    encoded_cats = {}
    for col in cat_cols:
        val_str = cat_values[col]
        encoded_val = cat_mappings[col].get(val_str, 0)
        encoded_cats[col] = encoded_val

    # 3. Extract & scale numerical columns
    raw_nums = {}
    for col in num_cols:
        raw_nums[col] = float(input_dict[col])

    num_df = pd.DataFrame([raw_nums])[num_cols]
    scaled_nums_array = scaler.transform(num_df)
    scaled_num_df = pd.DataFrame(scaled_nums_array, columns=num_cols)

    # 4. Combine numerical & categorical features into single 1-row DataFrame
    combined_dict = {}
    for col in num_cols:
        combined_dict[col] = scaled_num_df[col].iloc[0]
    for col in cat_cols:
        combined_dict[col] = encoded_cats[col]

    final_df = pd.DataFrame([combined_dict])[feature_order]
    return final_df
