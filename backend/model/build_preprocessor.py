import os
import pickle
import pandas as pd
from sklearn.preprocessing import LabelEncoder, StandardScaler

def build_preprocessor():
    # Resolve project root path
    current_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(os.path.dirname(current_dir))
    csv_path = os.path.join(project_root, "Loan_default.csv")
    output_pkl_path = os.path.join(current_dir, "preprocessor.pkl")

    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"Dataset Loan_default.csv not found at {csv_path}")

    print(f"Loading dataset from {csv_path}...")
    df = pd.read_csv(csv_path)

    if 'LoanID' in df.columns:
        df = df.drop('LoanID', axis=1)

    cat_cols = ['Education', 'EmploymentType', 'MaritalStatus', 'HasMortgage', 'HasDependents', 'LoanPurpose', 'HasCoSigner']
    num_cols = ['Age', 'Income', 'LoanAmount', 'CreditScore', 'MonthsEmployed', 'NumCreditLines', 'InterestRate', 'LoanTerm', 'DTIRatio']
    feature_order = ['Age', 'Income', 'LoanAmount', 'CreditScore', 'MonthsEmployed', 'NumCreditLines', 'InterestRate', 'LoanTerm', 'DTIRatio', 'Education', 'EmploymentType', 'MaritalStatus', 'HasMortgage', 'HasDependents', 'LoanPurpose', 'HasCoSigner']

    encoders = {}
    cat_mappings = {}

    for col in cat_cols:
        le = LabelEncoder()
        le.fit(df[col])
        encoders[col] = le
        cat_mappings[col] = {cls: int(idx) for idx, cls in enumerate(le.classes_)}
        print(f"Encoded {col}: {cat_mappings[col]}")

    scaler = StandardScaler()
    scaler.fit(df[num_cols])

    preprocessor_artifact = {
        'scaler': scaler,
        'cat_mappings': cat_mappings,
        'encoders': encoders,
        'num_cols': num_cols,
        'cat_cols': cat_cols,
        'feature_order': feature_order
    }

    with open(output_pkl_path, 'wb') as f:
        pickle.dump(preprocessor_artifact, f)

    file_size = os.path.getsize(output_pkl_path)
    print(f"Successfully generated {output_pkl_path} ({file_size} bytes).")

if __name__ == "__main__":
    build_preprocessor()
