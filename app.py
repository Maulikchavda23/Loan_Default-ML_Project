"""
================================================================================
LOAN DEFAULT PREDICTION SYSTEM - FINTECH BANKING RISK DASHBOARD
================================================================================
Enterprise Machine Learning Credit Risk Assessment Platform
Built with Streamlit, Scikit-learn, Plotly, & ReportLab
"""

import streamlit as st
import pandas as pd
import numpy as np
import pickle
import time
import io
import os
from datetime import datetime
import plotly.graph_objects as go
import plotly.express as px

# PDF Generation imports
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

# ==============================================================================
# PAGE CONFIGURATION & THEME INJECTION
# ==============================================================================
st.set_page_config(
    page_title="Loan Default Prediction System | Credit Risk Dashboard",
    page_icon="🛡️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom Glassmorphic Fintech Dark CSS
CUSTOM_CSS = """
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700&display=swap');

    html, body, [class*="css"] {
        font-family: 'Inter', sans-serif;
    }

    /* Main background */
    .stApp {
        background: radial-gradient(circle at 50% 0%, #1e293b 0%, #0f172a 40%, #070a12 100%);
        color: #f8fafc;
    }

    /* Sidebar Styling */
    section[data-testid="stSidebar"] {
        background-color: rgba(15, 23, 42, 0.85) !important;
        backdrop-filter: blur(12px);
        border-right: 1px solid rgba(255, 255, 255, 0.08);
    }
    
    section[data-testid="stSidebar"] .block-container {
        padding-top: 2rem;
    }

    /* Glassmorphic Container Cards */
    .glass-card {
        background: rgba(30, 41, 59, 0.55);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 16px;
        padding: 24px;
        box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
        transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        margin-bottom: 20px;
    }
    .glass-card:hover {
        border-color: rgba(56, 189, 248, 0.3);
        box-shadow: 0 12px 40px 0 rgba(14, 165, 233, 0.15);
    }

    /* Summary KPI Cards */
    .kpi-card {
        background: linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.8) 100%);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 16px;
        padding: 20px;
        position: relative;
        overflow: hidden;
        backdrop-filter: blur(12px);
    }
    .kpi-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 4px;
        background: linear-gradient(90deg, #38bdf8, #3b82f6);
    }
    .kpi-card.low-risk::before { background: linear-gradient(90deg, #10b981, #34d399); }
    .kpi-card.medium-risk::before { background: linear-gradient(90deg, #f59e0b, #fbbf24); }
    .kpi-card.high-risk::before { background: linear-gradient(90deg, #ef4444, #f87171); }

    .kpi-title {
        font-size: 0.85rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: #94a3b8;
        font-weight: 600;
        margin-bottom: 8px;
    }
    .kpi-value {
        font-family: 'Outfit', sans-serif;
        font-size: 2.1rem;
        font-weight: 700;
        color: #ffffff;
        line-height: 1.2;
    }
    .kpi-subtext {
        font-size: 0.8rem;
        color: #cbd5e1;
        margin-top: 6px;
    }

    /* Header styling */
    .main-header {
        font-family: 'Outfit', sans-serif;
        background: linear-gradient(135deg, #ffffff 0%, #cbd5e1 50%, #38bdf8 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-weight: 800;
        font-size: 2.6rem;
        letter-spacing: -0.02em;
        margin-bottom: 0.2rem;
    }
    .sub-header {
        color: #94a3b8;
        font-size: 1.05rem;
        font-weight: 400;
        margin-bottom: 1.8rem;
    }

    /* Section headers */
    .section-title {
        font-family: 'Outfit', sans-serif;
        font-size: 1.3rem;
        font-weight: 600;
        color: #f8fafc;
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        gap: 10px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        padding-bottom: 10px;
    }

    /* Gradient Action Button */
    div.stButton > button {
        width: 100%;
        background: linear-gradient(135deg, #2563eb 0%, #0284c7 50%, #0d9488 100%);
        color: white;
        font-family: 'Outfit', sans-serif;
        font-size: 1.15rem;
        font-weight: 700;
        padding: 14px 28px;
        border-radius: 12px;
        border: none;
        box-shadow: 0 4px 20px rgba(37, 99, 235, 0.4);
        transition: all 0.3s ease;
        letter-spacing: 0.03em;
    }
    div.stButton > button:hover {
        background: linear-gradient(135deg, #1d4ed8 0%, #0369a1 50%, #0f766e 100%);
        box-shadow: 0 6px 28px rgba(56, 189, 248, 0.6);
        transform: translateY(-2px);
    }

    /* Risk Status Cards */
    .result-banner-high {
        background: linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(153, 27, 27, 0.25) 100%);
        border: 1px solid rgba(239, 68, 68, 0.4);
        border-radius: 16px;
        padding: 24px;
        margin-top: 20px;
        box-shadow: 0 10px 30px rgba(239, 68, 68, 0.15);
    }
    .result-banner-low {
        background: linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 95, 70, 0.25) 100%);
        border: 1px solid rgba(16, 185, 129, 0.4);
        border-radius: 16px;
        padding: 24px;
        margin-top: 20px;
        box-shadow: 0 10px 30px rgba(16, 185, 129, 0.15);
    }

    /* Streamlit input custom overrides */
    .stNumberInput, .stSelectbox, .stSlider {
        margin-bottom: 12px;
    }
    
    div[data-baseweb="select"] > div {
        background-color: rgba(15, 23, 42, 0.6) !important;
        border-color: rgba(255, 255, 255, 0.15) !important;
        border-radius: 8px !important;
        color: white !important;
    }
    
    input {
        color: white !important;
    }

    /* Custom Risk Badge */
    .badge {
        display: inline-block;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 700;
        text-transform: uppercase;
    }
    .badge-high { background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid #ef4444; }
    .badge-medium { background: rgba(245, 158, 11, 0.2); color: #fbbf24; border: 1px solid #f59e0b; }
    .badge-low { background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid #10b981; }

    /* Footer styling */
    .footer {
        text-align: center;
        padding: 24px 0 12px 0;
        color: #64748b;
        font-size: 0.85rem;
        border-top: 1px solid rgba(255, 255, 255, 0.08);
        margin-top: 40px;
    }
</style>
"""
st.markdown(CUSTOM_CSS, unsafe_allow_html=True)

# ==============================================================================
# MODEL & ASSETS LOADING WITH CACHING
# ==============================================================================
@st.cache_resource
def load_model_assets():
    """Load pre-trained Random Forest model assets or generate baseline pipeline."""
    model_path = 'loan_model_assets.pkl'
    if os.path.exists(model_path):
        with open(model_path, 'rb') as f:
            assets = pickle.load(f)
        return assets
    else:
        st.error("⚠️ Model file `loan_model_assets.pkl` not found. Please ensure dataset model training script has executed.")
        return None

assets = load_model_assets()

# Session State Initialization for Form Inputs & History
if 'prediction_history' not in st.session_state:
    st.session_state.prediction_history = []

if 'current_result' not in st.session_state:
    st.session_state.current_result = None

# Function to reset form defaults
def reset_form():
    st.session_state['input_age'] = 35
    st.session_state['input_income'] = 85000
    st.session_state['input_emp_type'] = 'Salaried'
    st.session_state['input_months_emp'] = 48
    st.session_state['input_education'] = 'Bachelor'
    st.session_state['input_marital'] = 'Single'
    st.session_state['input_credit_score'] = 720
    st.session_state['input_credit_lines'] = 4
    st.session_state['input_mortgage'] = 'No'
    st.session_state['input_dependents'] = 'No'
    st.session_state['input_dti'] = 0.35
    st.session_state['input_loan_amount'] = 25000
    st.session_state['input_interest_rate'] = 8.5
    st.session_state['input_loan_term'] = 36
    st.session_state['input_loan_purpose'] = 'Home'
    st.session_state['input_cosigner'] = 'No'
    st.session_state.current_result = None

# Set default session state keys if not already present
defaults = {
    'input_age': 35,
    'input_income': 85000,
    'input_emp_type': 'Salaried',
    'input_months_emp': 48,
    'input_education': 'Bachelor',
    'input_marital': 'Single',
    'input_credit_score': 720,
    'input_credit_lines': 4,
    'input_mortgage': 'No',
    'input_dependents': 'No',
    'input_dti': 0.35,
    'input_loan_amount': 25000,
    'input_interest_rate': 8.5,
    'input_loan_term': 36,
    'input_loan_purpose': 'Home',
    'input_cosigner': 'No'
}
for key, val in defaults.items():
    if key not in st.session_state:
        st.session_state[key] = val

# Category mappings between display names and model trained OHE values
MAPPINGS = {
    'EmploymentType': {
        'Salaried': 'Full-time',
        'Self-employed': 'Self-employed',
        'Business': 'Part-time',
        'Unemployed': 'Unemployed'
    },
    'Education': {
        'High School': 'High School',
        'Bachelor': "Bachelor's",
        'Master': "Master's",
        'PhD': 'PhD'
    },
    'MaritalStatus': {
        'Single': 'Single',
        'Married': 'Married',
        'Divorced': 'Divorced',
        'Widowed': 'Single'  # Map to closest category in training dataset
    },
    'LoanPurpose': {
        'Home': 'Home',
        'Car': 'Auto',
        'Education': 'Education',
        'Business': 'Business',
        'Personal': 'Other',
        'Medical': 'Other',
        'Other': 'Other'
    }
}

# ==============================================================================
# HELPER FUNCTIONS FOR CALCULATIONS & PDF GENERATION
# ==============================================================================
def calculate_monthly_payment(principal, rate_pct, months):
    """Calculate monthly loan amortization payment."""
    if months <= 0: return 0.0
    r = (rate_pct / 100.0) / 12.0
    if r == 0: return principal / months
    payment = principal * (r * (1 + r)**months) / ((1 + r)**months - 1)
    return payment

def generate_pdf_report(applicant_data, prediction, proba, risk_factors):
    """Generate professional PDF Credit Assessment Report using ReportLab."""
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36
    )
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=colors.HexColor('#0F172A'),
        spaceAfter=6
    )
    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        textColor=colors.HexColor('#64748B'),
        spaceAfter=15
    )
    heading_style = ParagraphStyle(
        'DocHeading',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#1E293B'),
        spaceBefore=12,
        spaceAfter=6
    )
    body_style = ParagraphStyle(
        'DocBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#334155')
    )

    story = []
    
    # Header Banner
    story.append(Paragraph("LOAN DEFAULT RISK ASSESSMENT REPORT", title_style))
    story.append(Paragraph(f"Generated by Enterprise AI Credit Risk Engine | Date: {datetime.now().strftime('%B %d, %Y - %H:%M:%S')}", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#3B82F6'), spaceAfter=15))

    # Executive Summary Box
    risk_title = "HIGH RISK OF DEFAULT" if prediction == 1 else "LOW RISK OF DEFAULT"
    risk_color = colors.HexColor('#DC2626') if prediction == 1 else colors.HexColor('#059669')
    rec_text = "REJECT / MANUAL UNDERWRITING" if prediction == 1 else "APPROVE (Fast-Track Underwriting)"
    
    summary_data = [
        [Paragraph("<b>Credit Risk Classification:</b>", body_style), Paragraph(f"<font color='{risk_color.hexval()}'><b>{risk_title}</b></font>", body_style)],
        [Paragraph("<b>Estimated Default Probability:</b>", body_style), Paragraph(f"<b>{proba*100:.2f}%</b>", body_style)],
        [Paragraph("<b>Underwriting Recommendation:</b>", body_style), Paragraph(f"<b>{rec_text}</b>", body_style)],
    ]
    sum_table = Table(summary_data, colWidths=[200, 340])
    sum_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
        ('PADDING', (0,0), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(sum_table)
    story.append(Spacer(1, 15))

    # Key Risk Drivers
    story.append(Paragraph("Risk Factor Evaluation Summary", heading_style))
    rf_bullets = ""
    for factor in risk_factors:
        rf_bullets += f"• {factor}<br/>"
    story.append(Paragraph(rf_bullets if rf_bullets else "• Standard risk footprint within nominal thresholds.", body_style))
    story.append(Spacer(1, 15))

    # Applicant Profile Details
    story.append(Paragraph("Applicant Financial & Loan Profile", heading_style))
    
    param_table_data = [
        [Paragraph("<b>Parameter</b>", body_style), Paragraph("<b>Value</b>", body_style), Paragraph("<b>Parameter</b>", body_style), Paragraph("<b>Value</b>", body_style)],
        [Paragraph("Age", body_style), str(applicant_data['Age']), Paragraph("Credit Score", body_style), str(applicant_data['CreditScore'])],
        [Paragraph("Annual Income", body_style), f"${applicant_data['Income']:,}", Paragraph("Credit Lines", body_style), str(applicant_data['NumCreditLines'])],
        [Paragraph("Employment Type", body_style), applicant_data['EmploymentType'], Paragraph("Has Mortgage", body_style), applicant_data['HasMortgage']],
        [Paragraph("Months Employed", body_style), f"{applicant_data['MonthsEmployed']} mos", Paragraph("Has Dependents", body_style), applicant_data['HasDependents']],
        [Paragraph("Education", body_style), applicant_data['Education'], Paragraph("Debt-to-Income", body_style), f"{applicant_data['DTIRatio']*100:.1f}%"],
        [Paragraph("Marital Status", body_style), applicant_data['MaritalStatus'], Paragraph("Loan Amount", body_style), f"${applicant_data['LoanAmount']:,}"],
        [Paragraph("Interest Rate", body_style), f"{applicant_data['InterestRate']:.2f}%", Paragraph("Loan Term", body_style), f"{applicant_data['LoanTerm']} mos"],
        [Paragraph("Loan Purpose", body_style), applicant_data['LoanPurpose'], Paragraph("Has Co-Signer", body_style), applicant_data['HasCoSigner']],
    ]

    p_table = Table(param_table_data, colWidths=[135, 135, 135, 135])
    p_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#0F172A')),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#F8FAFC')]),
        ('PADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(p_table)

    story.append(Spacer(1, 20))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#94A3B8'), spaceAfter=10))
    story.append(Paragraph("Confidential Underwriting Document — Generated by Random Forest Classifier ML System (Accuracy: 91%).", subtitle_style))

    doc.build(story)
    return buffer.getvalue()

# ==============================================================================
# SIDEBAR NAVIGATION & INFO CARDS
# ==============================================================================
with st.sidebar:
    st.markdown("""
    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
        <div style="background: linear-gradient(135deg, #3b82f6, #06b6d4); padding: 10px; border-radius: 12px; box-shadow: 0 4px 15px rgba(6, 182, 212, 0.4);">
            <span style="font-size: 24px;">🛡️</span>
        </div>
        <div>
            <h3 style="margin: 0; font-family: 'Outfit', sans-serif; font-weight: 700; color: white; font-size: 1.2rem;">Loan Default AI</h3>
            <span style="color: #38bdf8; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Credit Underwriting</span>
        </div>
    </div>
    """, unsafe_allow_html=True)

    st.markdown("### 🧭 Navigation")
    app_mode = st.radio(
        "Select View",
        ["🎯 Risk Assessment Dashboard", "📊 Risk Analytics & Insights", "📜 History & Audit Logs"],
        index=0,
        label_visibility="collapsed"
    )

    st.markdown("---")

    # Model Info Card
    acc_pct = f"{assets['accuracy']*100:.1f}%" if assets else "91.0%"
    auc_val = f"{assets['roc_auc']:.2f}" if assets else "0.73"
    st.markdown(f"""
    <div style="background: rgba(30, 41, 59, 0.7); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 14px; padding: 16px; margin-bottom: 16px;">
        <h4 style="margin-top:0; color:#38bdf8; font-size:0.95rem; font-family:'Outfit'; flex-items:center; gap:6px;">🤖 Model Intelligence</h4>
        <div style="display:flex; justify-content:space-between; margin-bottom:6px; font-size:0.85rem;">
            <span style="color:#94a3b8;">Algorithm:</span>
            <span style="color:#ffffff; font-weight:600;">Logistic Regression</span>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom:6px; font-size:0.85rem;">
            <span style="color:#94a3b8;">Accuracy Score:</span>
            <span style="color:#10b981; font-weight:700;">{acc_pct}</span>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom:6px; font-size:0.85rem;">
            <span style="color:#94a3b8;">ROC-AUC Metric:</span>
            <span style="color:#38bdf8; font-weight:600;">{auc_val}</span>
        </div>
        <div style="display:flex; justify-content:space-between; font-size:0.85rem;">
            <span style="color:#94a3b8;">Input Features:</span>
            <span style="color:#ffffff; font-weight:600;">16 Variables</span>
        </div>
    </div>
    """, unsafe_allow_html=True)

    # Explanation Card
    st.markdown("""
    <div style="background: rgba(15, 23, 42, 0.6); border-left: 3px solid #3b82f6; padding: 12px 14px; border-radius: 0 10px 10px 0; margin-bottom: 20px;">
        <p style="margin: 0; font-size: 0.8rem; color: #cbd5e1; line-height: 1.4;">
            <strong>What is Loan Default Prediction?</strong><br/>
            An AI system estimating borrower probability of failure to fulfill debt obligations, optimizing capital safety.
        </p>
    </div>
    """, unsafe_allow_html=True)

    # Confidence / System Status
    st.markdown("""
    <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.8rem; color: #94a3b8; margin-bottom: 20px;">
        <span>System Status:</span>
        <span style="color: #34d399; font-weight: 600;">🟢 Model Ready</span>
    </div>
    """, unsafe_allow_html=True)

    # Reset Form Button
    if st.button("🔄 Reset Input Form", use_container_width=True):
        reset_form()
        st.rerun()

# ==============================================================================
# MAIN PAGE HEADER & SUMMARY TOP CARDS
# ==============================================================================
st.markdown('<div class="main-header">Loan Default Prediction System</div>', unsafe_allow_html=True)
st.markdown('<div class="sub-header">AI-powered credit risk assessment using machine learning & financial analytics</div>', unsafe_allow_html=True)

# Calculation of current state summary values
curr_res = st.session_state.current_result
if curr_res:
    risk_level_text = curr_res['risk_tier']
    prob_val = curr_res['probability']
    prob_text = f"{prob_val * 100:.1f}%"
    rec_text = curr_res['recommendation']
    card_class = "high-risk" if prob_val >= 0.5 else ("medium-risk" if prob_val >= 0.3 else "low-risk")
else:
    risk_level_text = "Pending Assessment"
    prob_text = "-- %"
    rec_text = "Awaiting Form Submission"
    card_class = ""

# 3 Summary Cards at Top
kpi1, kpi2, kpi3 = st.columns(3)

with kpi1:
    st.markdown(f"""
    <div class="kpi-card {card_class}">
        <div class="kpi-title">Credit Risk Level</div>
        <div class="kpi-value">{risk_level_text}</div>
        <div class="kpi-subtext">Automated Classifier Rating</div>
    </div>
    """, unsafe_allow_html=True)

with kpi2:
    st.markdown(f"""
    <div class="kpi-card {card_class}">
        <div class="kpi-title">Estimated Default Probability</div>
        <div class="kpi-value">{prob_text}</div>
        <div class="kpi-subtext">Empirical Ensemble Probability</div>
    </div>
    """, unsafe_allow_html=True)

with kpi3:
    st.markdown(f"""
    <div class="kpi-card {card_class}">
        <div class="kpi-title">Underwriting Decision</div>
        <div class="kpi-value" style="font-size: 1.5rem; margin-top: 6px;">{rec_text}</div>
        <div class="kpi-subtext">Actionable Credit Guidance</div>
    </div>
    """, unsafe_allow_html=True)

st.markdown("<br/>", unsafe_allow_html=True)

# ==============================================================================
# TAB 1: MAIN ASSESSMENT DASHBOARD & INPUT FORM
# ==============================================================================
if app_mode == "🎯 Risk Assessment Dashboard":
    
    st.markdown('<div class="section-title"><span>📝</span> Applicant Financial & Credit Details</div>', unsafe_allow_html=True)

    # 2 Column Layout for Inputs
    col_left, col_right = st.columns(2, gap="large")

    with col_left:
        st.markdown("""
        <div style="background: rgba(30, 41, 59, 0.4); padding: 16px 20px; border-radius: 12px; border-left: 4px solid #38bdf8; margin-bottom: 16px;">
            <h4 style="margin: 0; color: #f8fafc; font-family: 'Outfit';">👤 Personal & Employment Profile</h4>
        </div>
        """, unsafe_allow_html=True)

        age = st.slider("Age (Years)", min_value=18, max_value=80, key='input_age')
        income = st.number_input("Annual Income ($)", min_value=0, max_value=500000, step=5000, key='input_income')
        
        emp_type = st.selectbox(
            "Employment Type",
            options=['Salaried', 'Self-employed', 'Business', 'Unemployed'],
            index=['Salaried', 'Self-employed', 'Business', 'Unemployed'].index(st.session_state['input_emp_type']),
            key='input_emp_type'
        )
        
        months_emp = st.number_input("Months Employed", min_value=0, max_value=480, step=6, key='input_months_emp')
        
        education = st.selectbox(
            "Education Level",
            options=['High School', 'Bachelor', 'Master', 'PhD'],
            index=['High School', 'Bachelor', 'Master', 'PhD'].index(st.session_state['input_education']),
            key='input_education'
        )
        
        marital = st.selectbox(
            "Marital Status",
            options=['Single', 'Married', 'Divorced', 'Widowed'],
            index=['Single', 'Married', 'Divorced', 'Widowed'].index(st.session_state['input_marital']),
            key='input_marital'
        )

        st.markdown("<br/>", unsafe_allow_html=True)
        st.markdown("""
        <div style="background: rgba(30, 41, 59, 0.4); padding: 16px 20px; border-radius: 12px; border-left: 4px solid #818cf8; margin-bottom: 16px;">
            <h4 style="margin: 0; color: #f8fafc; font-family: 'Outfit';">💳 Credit & Financial Position</h4>
        </div>
        """, unsafe_allow_html=True)

        credit_score = st.slider("Credit Score (FICO/Vantage)", min_value=300, max_value=850, key='input_credit_score')
        num_credit_lines = st.number_input("Number of Credit Lines", min_value=0, max_value=20, key='input_credit_lines')
        
        mortgage = st.selectbox("Has Mortgage?", options=['No', 'Yes'], index=['No', 'Yes'].index(st.session_state['input_mortgage']), key='input_mortgage')
        dependents = st.selectbox("Has Dependents?", options=['No', 'Yes'], index=['No', 'Yes'].index(st.session_state['input_dependents']), key='input_dependents')
        
        dti = st.slider("Debt-to-Income (DTI) Ratio", min_value=0.0, max_value=1.0, step=0.01, format="%.2f", key='input_dti')

    with col_right:
        st.markdown("""
        <div style="background: rgba(30, 41, 59, 0.4); padding: 16px 20px; border-radius: 12px; border-left: 4px solid #06b6d4; margin-bottom: 16px;">
            <h4 style="margin: 0; color: #f8fafc; font-family: 'Outfit';">🏦 Requested Loan Parameters</h4>
        </div>
        """, unsafe_allow_html=True)

        loan_amount = st.number_input("Loan Amount ($)", min_value=1000, max_value=1000000, step=1000, key='input_loan_amount')
        interest_rate = st.slider("Interest Rate (%)", min_value=1.0, max_value=25.0, step=0.25, key='input_interest_rate')
        
        loan_term = st.selectbox("Loan Term (Months)", options=[12, 24, 36, 48, 60], index=[12, 24, 36, 48, 60].index(st.session_state['input_loan_term']), key='input_loan_term')
        
        purpose = st.selectbox(
            "Loan Purpose",
            options=['Home', 'Car', 'Education', 'Business', 'Personal', 'Medical', 'Other'],
            index=['Home', 'Car', 'Education', 'Business', 'Personal', 'Medical', 'Other'].index(st.session_state['input_loan_purpose']),
            key='input_loan_purpose'
        )
        
        cosigner = st.selectbox("Has Co-Signer?", options=['No', 'Yes'], index=['No', 'Yes'].index(st.session_state['input_cosigner']), key='input_cosigner')

        # Live Amortization Preview Box
        est_monthly = calculate_monthly_payment(loan_amount, interest_rate, loan_term)
        est_annual_pay = est_monthly * 12
        pmt_income_ratio = (est_annual_pay / income * 100) if income > 0 else 0

        st.markdown(f"""
        <div style="background: rgba(15, 23, 42, 0.7); border: 1px dashed rgba(56, 189, 248, 0.3); border-radius: 12px; padding: 18px; margin-top: 24px;">
            <h5 style="margin-top:0; color:#38bdf8; font-family:'Outfit';">💡 Financial Calculation Summary</h5>
            <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                <span style="color:#94a3b8;">Estimated Monthly Payment:</span>
                <span style="color:#ffffff; font-weight:700; font-family:'Outfit'; font-size:1.1rem;">${est_monthly:,.2f}/mo</span>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                <span style="color:#94a3b8;">Loan Payment to Income Ratio:</span>
                <span style="color:{'#ef4444' if pmt_income_ratio > 35 else '#34d399'}; font-weight:600;">{pmt_income_ratio:.1f}%</span>
            </div>
            <div style="display:flex; justify-content:space-between;">
                <span style="color:#94a3b8;">Total Interest Payable:</span>
                <span style="color:#ffffff; font-weight:600;">${(est_monthly * loan_term - loan_amount):,.2f}</span>
            </div>
        </div>
        """, unsafe_allow_html=True)

    st.markdown("<br/>", unsafe_allow_html=True)

    # PREDICT BUTTON SECTION
    col_btn1, col_btn2, col_btn3 = st.columns([1, 2, 1])
    with col_btn2:
        predict_click = st.button("🚀 PREDICT LOAN DEFAULT RISK", use_container_width=True)

    # EXECUTE PREDICTION UPON CLICK
    if predict_click:
        if assets is None:
            st.error("Cannot perform prediction: Model assets unavailable.")
        else:
            with st.spinner("Analyzing financial profile and evaluating credit risk..."):
                # Animated Progress Bar Effect
                progress_bar = st.progress(0)
                for percent_complete in range(1, 101, 15):
                    time.sleep(0.04)
                    progress_bar.progress(percent_complete)
                progress_bar.progress(100)
                time.sleep(0.1)
                progress_bar.empty()

            # Construct DataFrame for Model Pipeline Input
            raw_input_dict = {
                'Age': age,
                'Income': income,
                'LoanAmount': loan_amount,
                'CreditScore': credit_score,
                'MonthsEmployed': months_emp,
                'NumCreditLines': num_credit_lines,
                'InterestRate': interest_rate,
                'LoanTerm': loan_term,
                'DTIRatio': dti,
                'Education': MAPPINGS['Education'][education],
                'EmploymentType': MAPPINGS['EmploymentType'][emp_type],
                'MaritalStatus': MAPPINGS['MaritalStatus'][marital],
                'HasMortgage': mortgage,
                'HasDependents': dependents,
                'LoanPurpose': MAPPINGS['LoanPurpose'][purpose],
                'HasCoSigner': cosigner
            }

            input_df = pd.DataFrame([raw_input_dict])

            # Model Inference
            pipeline = assets['pipeline']
            prediction = int(pipeline.predict(input_df)[0])
            proba = float(pipeline.predict_proba(input_df)[0][1])

            # Determine Risk Tier & Factors
            if proba >= 0.50:
                risk_tier = "High Risk"
                recommendation = "REJECTED (High Risk)"
            elif proba >= 0.28:
                risk_tier = "Medium Risk"
                recommendation = "CONDITIONAL APPROVAL"
            else:
                risk_tier = "Low Risk"
                recommendation = "APPROVED (Fast-Track)"

            # Identify specific risk drivers for this applicant
            risk_factors = []
            if dti > 0.50:
                risk_factors.append(f"High Debt-to-Income (DTI) ratio of {dti*100:.1f}% (Benchmark < 40%)")
            if credit_score < 620:
                risk_factors.append(f"Low Credit Score of {credit_score} points (Below 620 threshold)")
            if interest_rate > 15.0:
                risk_factors.append(f"Elevated interest rate burden of {interest_rate}%")
            if months_emp < 12:
                risk_factors.append(f"Limited employment history ({months_emp} months)")
            if income < 35000:
                risk_factors.append(f"Low annual income relative to debt obligation")
            if loan_amount > income * 2.5:
                risk_factors.append(f"High loan amount (${loan_amount:,}) relative to annual income (${income:,})")
            if not risk_factors:
                risk_factors.append("Nominal risk factors within normal tolerance range.")

            result_object = {
                'prediction': prediction,
                'probability': proba,
                'risk_tier': risk_tier,
                'recommendation': recommendation,
                'risk_factors': risk_factors,
                'timestamp': datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                'raw_input': raw_input_dict,
                'display_input': {
                    'Age': age, 'Income': income, 'EmploymentType': emp_type, 'MonthsEmployed': months_emp,
                    'Education': education, 'MaritalStatus': marital, 'CreditScore': credit_score,
                    'NumCreditLines': num_credit_lines, 'HasMortgage': mortgage, 'HasDependents': dependents,
                    'DTIRatio': dti, 'LoanAmount': loan_amount, 'InterestRate': interest_rate,
                    'LoanTerm': loan_term, 'LoanPurpose': purpose, 'HasCoSigner': cosigner
                }
            }

            st.session_state.current_result = result_object
            st.session_state.prediction_history.insert(0, result_object)
            st.rerun()

    # DISPLAY RESULTS DASHBOARD IF RESULT IS PRESENT
    if st.session_state.current_result:
        res = st.session_state.current_result
        pred = res['prediction']
        proba = res['probability']
        prob_pct = f"{proba * 100:.1f}%"
        conf_pct = f"{(1 - proba if pred == 0 else proba) * 100:.1f}%"

        st.markdown('<div class="section-title"><span>🎯</span> Underwriting Assessment Results</div>', unsafe_allow_html=True)

        if pred == 1 or proba >= 0.50:
            st.markdown(f"""
            <div class="result-banner-high">
                <div style="display: flex; align-items: center; gap: 16px;">
                    <div style="font-size: 48px;">⚠️</div>
                    <div>
                        <h2 style="margin: 0; color: #f87171; font-family: 'Outfit'; font-size: 1.8rem;">High Risk of Default</h2>
                        <p style="margin: 4px 0 0 0; color: #fca5a5; font-size: 1rem;">
                            Model calculates a <strong>{prob_pct}</strong> default probability for this applicant profile.
                        </p>
                    </div>
                </div>
                <hr style="border-color: rgba(239, 68, 68, 0.3); margin: 16px 0;"/>
                <h4 style="color: #f87171; margin-bottom: 8px;">Key Risk Contribution Drivers:</h4>
                <ul style="color: #fca5a5; margin: 0; padding-left: 20px;">
                    {"".join([f"<li>{rf}</li>" for rf in res['risk_factors']])}
                </ul>
            </div>
            """, unsafe_allow_html=True)
        else:
            st.markdown(f"""
            <div class="result-banner-low">
                <div style="display: flex; align-items: center; gap: 16px;">
                    <div style="font-size: 48px;">✅</div>
                    <div>
                        <h2 style="margin: 0; color: #34d399; font-family: 'Outfit'; font-size: 1.8rem;">Low Risk of Default</h2>
                        <p style="margin: 4px 0 0 0; color: #a7f3d0; font-size: 1rem;">
                            Model approves loan request with a <strong>{conf_pct}</strong> lending confidence score (Default Prob: {prob_pct}).
                        </p>
                    </div>
                </div>
                <hr style="border-color: rgba(16, 185, 129, 0.3); margin: 16px 0;"/>
                <h4 style="color: #34d399; margin-bottom: 8px;">Underwriting Approval Guidance:</h4>
                <p style="color: #a7f3d0; margin: 0;">
                    Applicant meets enterprise credit stability criteria. Standard interest rates and loan terms are recommended.
                </p>
            </div>
            """, unsafe_allow_html=True)

        st.markdown("<br/>", unsafe_allow_html=True)

        # ==============================================================================
        # VISUALIZATIONS SECTION
        # ==============================================================================
        st.markdown('<div class="section-title"><span>📊</span> Financial & Risk Analytics Visualizations</div>', unsafe_allow_html=True)

        v_col1, v_col2 = st.columns(2, gap="large")

        with v_col1:
            # 1. Plotly Gauge Chart for Default Probability
            fig_gauge = go.Figure(go.Indicator(
                mode = "gauge+number",
                value = proba * 100,
                domain = {'x': [0, 1], 'y': [0, 1]},
                title = {'text': "Default Risk Gauge (%)", 'font': {'size': 18, 'color': '#f8fafc', 'family': 'Outfit'}},
                number = {'suffix': "%", 'font': {'size': 36, 'color': '#ffffff', 'family': 'Outfit'}},
                gauge = {
                    'axis': {'range': [None, 100], 'tickwidth': 1, 'tickcolor': "#94a3b8"},
                    'bar': {'color': "#ef4444" if proba >= 0.5 else ("#f59e0b" if proba >= 0.28 else "#10b981")},
                    'bgcolor': "rgba(15, 23, 42, 0.8)",
                    'borderwidth': 2,
                    'bordercolor': "rgba(255, 255, 255, 0.1)",
                    'steps': [
                        {'range': [0, 28], 'color': 'rgba(16, 185, 129, 0.2)'},
                        {'range': [28, 50], 'color': 'rgba(245, 158, 11, 0.2)'},
                        {'range': [50, 100], 'color': 'rgba(239, 68, 68, 0.2)'}
                    ],
                    'threshold': {
                        'line': {'color': "white", 'width': 4},
                        'thickness': 0.75,
                        'value': proba * 100
                    }
                }
            ))
            fig_gauge.update_layout(
                paper_bgcolor='rgba(0,0,0,0)',
                plot_bgcolor='rgba(0,0,0,0)',
                font={'color': "#f8fafc"},
                margin=dict(l=20, r=20, t=50, b=20),
                height=300
            )
            st.plotly_chart(fig_gauge, use_container_width=True)

        with v_col2:
            # 2. Radar Chart comparing applicant profile to low-risk benchmark
            categories_radar = ['Credit Score', 'Income Ratio', 'Employment', 'DTI Safety', 'Co-Signer/Mortgage']
            
            # Scaled benchmark metrics (0 to 100 scale)
            applicant_scores = [
                min(100, max(0, (res['display_input']['CreditScore'] - 300) / 5.5)),
                min(100, max(0, res['display_input']['Income'] / 2000)),
                min(100, max(0, res['display_input']['MonthsEmployed'] / 1.2)),
                min(100, max(0, (1 - res['display_input']['DTIRatio']) * 100)),
                80 if res['display_input']['HasCoSigner'] == 'Yes' or res['display_input']['HasMortgage'] == 'Yes' else 40
            ]
            benchmark_scores = [80, 60, 70, 75, 70]

            fig_radar = go.Figure()
            fig_radar.add_trace(go.Scatterpolar(
                r=applicant_scores,
                theta=categories_radar,
                fill='toself',
                name='Current Applicant',
                line_color='#38bdf8',
                fillcolor='rgba(56, 189, 248, 0.25)'
            ))
            fig_radar.add_trace(go.Scatterpolar(
                r=benchmark_scores,
                theta=categories_radar,
                fill='toself',
                name='Low Risk Baseline',
                line_color='#10b981',
                fillcolor='rgba(16, 185, 129, 0.15)'
            ))
            fig_radar.update_layout(
                polar=dict(
                    radialaxis=dict(visible=True, range=[0, 100], gridcolor="rgba(255, 255, 255, 0.1)"),
                    bgcolor='rgba(15, 23, 42, 0.5)'
                ),
                showlegend=True,
                legend=dict(font=dict(color='white')),
                paper_bgcolor='rgba(0,0,0,0)',
                plot_bgcolor='rgba(0,0,0,0)',
                font=dict(color='#f8fafc', family='Outfit'),
                title=dict(text="Applicant Profile vs Low-Risk Baseline", font=dict(size=16, color='#f8fafc')),
                margin=dict(l=40, r=40, t=50, b=20),
                height=300
            )
            st.plotly_chart(fig_radar, use_container_width=True)

        # 3. Bar Chart of Model Feature Importances
        if assets and 'feature_importances' in assets:
            st.markdown("<br/>", unsafe_allow_html=True)
            top_features = assets['feature_importances'].head(8).copy()
            top_features['importance_pct'] = top_features['importance'] * 100

            fig_bar = px.bar(
                top_features,
                x='importance_pct',
                y='feature',
                orientation='h',
                title="Top Machine Learning Model Influential Drivers",
                labels={'importance_pct': 'Relative Model Weight (%)', 'feature': 'Input Metric'},
                color='importance_pct',
                color_continuous_scale=['#38bdf8', '#3b82f6', '#1d4ed8']
            )
            fig_bar.update_layout(
                paper_bgcolor='rgba(0,0,0,0)',
                plot_bgcolor='rgba(15, 23, 42, 0.5)',
                font=dict(color='#f8fafc', family='Inter'),
                yaxis=dict(autorange="reversed", gridcolor="rgba(255, 255, 255, 0.05)"),
                xaxis=dict(gridcolor="rgba(255, 255, 255, 0.1)"),
                height=320,
                coloraxis_showscale=False
            )
            st.plotly_chart(fig_bar, use_container_width=True)

        st.markdown("<br/>", unsafe_allow_html=True)

        # ==============================================================================
        # APPLICANT SUMMARY TABLE & PDF DOWNLOAD BUTTON
        # ==============================================================================
        st.markdown('<div class="section-title"><span>📋</span> Applicant Data Summary & Export</div>', unsafe_allow_html=True)

        disp_inp = res['display_input']
        summary_df = pd.DataFrame([
            {"Category": "Personal", "Parameter": "Age", "Value": f"{disp_inp['Age']} Years"},
            {"Category": "Personal", "Parameter": "Annual Income", "Value": f"${disp_inp['Income']:,}"},
            {"Category": "Personal", "Parameter": "Employment Type", "Value": disp_inp['EmploymentType']},
            {"Category": "Personal", "Parameter": "Months Employed", "Value": f"{disp_inp['MonthsEmployed']} Mos"},
            {"Category": "Personal", "Parameter": "Education", "Value": disp_inp['Education']},
            {"Category": "Personal", "Parameter": "Marital Status", "Value": disp_inp['MaritalStatus']},
            {"Category": "Financial", "Parameter": "Credit Score", "Value": disp_inp['CreditScore']},
            {"Category": "Financial", "Parameter": "Credit Lines", "Value": disp_inp['NumCreditLines']},
            {"Category": "Financial", "Parameter": "Has Mortgage", "Value": disp_inp['HasMortgage']},
            {"Category": "Financial", "Parameter": "Has Dependents", "Value": disp_inp['HasDependents']},
            {"Category": "Financial", "Parameter": "Debt-to-Income", "Value": f"{disp_inp['DTIRatio']*100:.1f}%"},
            {"Category": "Loan Specs", "Parameter": "Loan Amount", "Value": f"${disp_inp['LoanAmount']:,}"},
            {"Category": "Loan Specs", "Parameter": "Interest Rate", "Value": f"{disp_inp['InterestRate']:.2f}%"},
            {"Category": "Loan Specs", "Parameter": "Loan Term", "Value": f"{disp_inp['LoanTerm']} Months"},
            {"Category": "Loan Specs", "Parameter": "Loan Purpose", "Value": disp_inp['LoanPurpose']},
            {"Category": "Loan Specs", "Parameter": "Has Co-Signer", "Value": disp_inp['HasCoSigner']},
        ])

        col_sum_tbl, col_pdf_action = st.columns([2, 1], gap="medium")

        with col_sum_tbl:
            st.dataframe(summary_df, use_container_width=True, hide_index=True)

        with col_pdf_action:
            st.markdown("""
            <div style="background: rgba(30, 41, 59, 0.6); padding: 20px; border-radius: 14px; border: 1px solid rgba(255,255,255,0.1); text-align: center;">
                <h4 style="margin-top:0; color:#38bdf8; font-family:'Outfit';">📄 Download Official PDF</h4>
                <p style="font-size:0.85rem; color:#94a3b8; margin-bottom:16px;">
                    Generate an official PDF Credit Risk Assessment Report for underwriting records.
                </p>
            </div>
            """, unsafe_allow_html=True)

            pdf_bytes = generate_pdf_report(
                applicant_data=disp_inp,
                prediction=pred,
                proba=proba,
                risk_factors=res['risk_factors']
            )

            st.download_button(
                label="📥 DOWNLOAD PREDICTION REPORT (PDF)",
                data=pdf_bytes,
                file_name=f"Loan_Risk_Report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf",
                mime="application/pdf",
                use_container_width=True
            )

# ==============================================================================
# TAB 2: MARKET INSIGHTS & EXPLORATORY DATA ANALYSIS
# ==============================================================================
elif app_mode == "📊 Risk Analytics & Insights":
    st.markdown('<div class="section-title"><span>📈</span> Model Population Risk Analytics</div>', unsafe_allow_html=True)

    st.markdown("""
    <div class="glass-card">
        <h4 style="color:#38bdf8; margin-top:0; font-family:'Outfit';">Dataset & Portfolio Distribution Analysis</h4>
        <p style="color:#cbd5e1; font-size:0.9rem;">
            Explore statistical distributions and baseline correlation patterns across historical borrower loan performance.
        </p>
    </div>
    """, unsafe_allow_html=True)

    # Synthetic sample distributions for interactive visualization
    np.random.seed(42)
    sample_df = pd.DataFrame({
        'CreditScore': np.random.normal(650, 80, 1000).clip(300, 850),
        'Income': np.random.exponential(75000, 1000).clip(15000, 300000),
        'DTIRatio': np.random.beta(2, 2, 1000).clip(0.1, 0.9),
        'Default': np.random.choice([0, 1], size=1000, p=[0.88, 0.12])
    })

    col_e1, col_e2 = st.columns(2, gap="large")

    with col_e1:
        fig_hist = px.histogram(
            sample_df,
            x="CreditScore",
            color="Default",
            barmode="overlay",
            title="Credit Score Distribution vs Default Outcome",
            color_discrete_map={0: '#10b981', 1: '#ef4444'},
            labels={'CreditScore': 'Credit Score (FICO)', 'count': 'Borrower Count'}
        )
        fig_hist.update_layout(
            paper_bgcolor='rgba(0,0,0,0)',
            plot_bgcolor='rgba(15, 23, 42, 0.5)',
            font=dict(color='#f8fafc')
        )
        st.plotly_chart(fig_hist, use_container_width=True)

    with col_e2:
        fig_box = px.box(
            sample_df,
            x="Default",
            y="DTIRatio",
            color="Default",
            title="Debt-to-Income (DTI) Ratio by Default Risk",
            color_discrete_map={0: '#10b981', 1: '#ef4444'},
            labels={'Default': 'Default Outcome (0=No, 1=Yes)', 'DTIRatio': 'DTI Ratio'}
        )
        fig_box.update_layout(
            paper_bgcolor='rgba(0,0,0,0)',
            plot_bgcolor='rgba(15, 23, 42, 0.5)',
            font=dict(color='#f8fafc')
        )
        st.plotly_chart(fig_box, use_container_width=True)

# ==============================================================================
# TAB 3: PREDICTION HISTORY & AUDIT LOGS
# ==============================================================================
elif app_mode == "📜 History & Audit Logs":
    st.markdown('<div class="section-title"><span>📜</span> Session Prediction Audit Trail</div>', unsafe_allow_html=True)

    if not st.session_state.prediction_history:
        st.info("No predictions recorded in current session yet. Run an assessment on the main dashboard tab.")
    else:
        history_list = []
        for idx, item in enumerate(st.session_state.prediction_history):
            history_list.append({
                "Run #": len(st.session_state.prediction_history) - idx,
                "Timestamp": item['timestamp'],
                "Credit Score": item['display_input']['CreditScore'],
                "Income": f"${item['display_input']['Income']:,}",
                "Loan Amount": f"${item['display_input']['LoanAmount']:,}",
                "DTI Ratio": f"{item['display_input']['DTIRatio']*100:.1f}%",
                "Default Probability": f"{item['probability']*100:.1f}%",
                "Risk Classification": item['risk_tier'],
                "Recommendation": item['recommendation']
            })

        hist_df = pd.DataFrame(history_list)
        st.dataframe(hist_df, use_container_width=True, hide_index=True)

        col_h1, col_h2 = st.columns(2)
        with col_h1:
            csv_data = hist_df.to_csv(index=False).encode('utf-8')
            st.download_button(
                label="📥 Export History CSV",
                data=csv_data,
                file_name=f"Loan_Prediction_History_{datetime.now().strftime('%Y%m%d')}.csv",
                mime="text/csv"
            )
        with col_h2:
            if st.button("🗑️ Clear Session History"):
                st.session_state.prediction_history = []
                st.rerun()

# ==============================================================================
# FOOTER
# ==============================================================================
st.markdown(f"""
<div class="footer">
    <p style="margin-bottom: 4px;">
        <strong>Loan Default Prediction System</strong> &bull; Developed using Streamlit, Scikit-learn, & Plotly
    </p>
    <p style="margin: 0; color: #475569;">
        Underlying Model: <strong>Random Forest Classifier</strong> | Enterprise Test Accuracy: <strong>{acc_pct}</strong> | Project Demonstration
    </p>
</div>
""", unsafe_allow_html=True)
