const STORAGE_KEY = 'loanGuardPredictionHistory';

/**
 * Retrieves all stored prediction records from localStorage.
 * @returns {Array<Object>}
 */
export const getPredictionHistory = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error('Failed to parse prediction history from localStorage:', error);
    return [];
  }
};

/**
 * Saves a new prediction record containing both input parameters and backend result.
 * @param {Object} inputs - All 16 applicant input fields
 * @param {Object} result - Backend response (prediction, prediction_label, default_probability, risk_level)
 * @returns {Object} The saved record
 */
export const savePredictionRecord = (inputs, result) => {
  try {
    const history = getPredictionHistory();
    const newRecord = {
      id: `pred_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      inputs: { ...inputs },
      result: {
        prediction: result.prediction,
        prediction_label: result.prediction_label,
        default_probability: result.default_probability,
        risk_level: result.risk_level,
        recommendation: result.recommendation || '',
        risk_factors: result.risk_factors || [],
        model: 'Logistic Regression',
      },
    };

    const updated = [newRecord, ...history];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newRecord;
  } catch (error) {
    console.error('Failed to save prediction record:', error);
    return null;
  }
};

/**
 * Deletes a single prediction record by ID.
 * @param {string} id 
 * @returns {Array<Object>} Updated history array
 */
export const deletePredictionRecord = (id) => {
  try {
    const history = getPredictionHistory();
    const updated = history.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Failed to delete prediction record:', error);
    return getPredictionHistory();
  }
};

/**
 * Clears all prediction history records.
 */
export const clearPredictionHistory = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  } catch (error) {
    console.error('Failed to clear prediction history:', error);
    return [];
  }
};

/**
 * Exports prediction history to LoanGuard_Prediction_History.csv and triggers download.
 */
export const exportHistoryToCSV = () => {
  const history = getPredictionHistory();
  if (!history || history.length === 0) return false;

  const headers = [
    'Record_ID',
    'Timestamp',
    'Age',
    'Income',
    'LoanAmount',
    'CreditScore',
    'MonthsEmployed',
    'NumCreditLines',
    'InterestRate',
    'LoanTerm_Months',
    'DTIRatio',
    'Education',
    'EmploymentType',
    'MaritalStatus',
    'HasMortgage',
    'HasDependents',
    'LoanPurpose',
    'HasCoSigner',
    'Prediction_Code',
    'Prediction_Label',
    'Default_Probability_Pct',
    'Risk_Level',
    'Model_Name'
  ];

  const csvRows = [];
  csvRows.push(headers.join(','));

  history.forEach((item) => {
    const inp = item.inputs || {};
    const res = item.result || {};
    const probPct = res.default_probability ? (res.default_probability * 100).toFixed(2) : '0.00';

    const row = [
      `"${item.id || ''}"`,
      `"${item.timestamp || ''}"`,
      inp.Age ?? '',
      inp.Income ?? '',
      inp.LoanAmount ?? '',
      inp.CreditScore ?? '',
      inp.MonthsEmployed ?? '',
      inp.NumCreditLines ?? '',
      inp.InterestRate ?? '',
      inp.LoanTerm ?? '',
      inp.DTIRatio ?? '',
      `"${inp.Education || ''}"`,
      `"${inp.EmploymentType || ''}"`,
      `"${inp.MaritalStatus || ''}"`,
      `"${inp.HasMortgage === 1 || inp.HasMortgage === 'Yes' ? 'Yes' : 'No'}"`,
      `"${inp.HasDependents === 1 || inp.HasDependents === 'Yes' ? 'Yes' : 'No'}"`,
      `"${inp.LoanPurpose || ''}"`,
      `"${inp.HasCoSigner === 1 || inp.HasCoSigner === 'Yes' ? 'Yes' : 'No'}"`,
      res.prediction ?? 0,
      `"${res.prediction_label || 'No Default'}"`,
      `${probPct}%`,
      `"${res.risk_level || 'Low Risk'}"`,
      `"${res.model || 'Logistic Regression'}"`
    ];

    csvRows.push(row.join(','));
  });

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `LoanGuard_Prediction_History_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return true;
};
