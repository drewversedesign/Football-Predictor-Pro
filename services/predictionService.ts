import { authClient } from './authService';

const API_URL = '/api';

export const savePrediction = async (predictionData: any) => {
  const session = await authClient.getSession();
  if (!session?.data?.session) throw new Error("Not authenticated");

  const response = await fetch(`${API_URL}/predictions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.data.session.token}`
    },
    body: JSON.stringify(predictionData)
  });

  if (!response.ok) throw new Error("Failed to save prediction");
  return response.json();
};

export const getPredictions = async () => {
  const session = await authClient.getSession();
  if (!session?.data?.session) throw new Error("Not authenticated");

  const response = await fetch(`${API_URL}/predictions`, {
    headers: {
      'Authorization': `Bearer ${session.data.session.token}`
    }
  });

  if (!response.ok) throw new Error("Failed to fetch predictions");
  return response.json();
};
