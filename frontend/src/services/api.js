const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Sends applicant data to FastAPI /predict endpoint.
 * @param {Object} data 
 * @returns {Promise<Object>}
 */
export const predictLoanDefault = async (data) => {
  try {
    const response = await fetch(`${BASE_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Unable to generate prediction. Please check the entered information and try again.');
    }

    return await response.json();
  } catch (error) {
    console.error('API Prediction Error:', error);
    throw error;
  }
};

/**
 * Fetches model metadata and accuracy metrics from /model-info endpoint.
 * @returns {Promise<Object>}
 */
export const getModelInfo = async () => {
  try {
    const response = await fetch(`${BASE_URL}/model-info`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch model information.');
    }

    return await response.json();
  } catch (error) {
    console.error('API Model Info Error:', error);
    throw error;
  }
};
