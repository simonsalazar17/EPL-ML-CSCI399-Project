export type Position = 'FW' | 'MF' | 'DF' | 'GK';
export interface PlayerInputs {
  age: number;
  position: Position;
  minutesPlayed: number;
  goals: number;
  assists: number;
  goalsPer90: number;
  assistsPer90: number;
}
export interface PredictionResult { estimatedValueMillions: number; isMock: false }

// Vite proxies /api locally. Set VITE_API_BASE_URL for a future API Gateway deployment.
const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');

export async function predictMarketValue(inputs: PlayerInputs): Promise<PredictionResult> {
  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl}/api/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inputs),
      signal: AbortSignal.timeout(15000),
    });
  } catch {
    throw new Error('Cannot reach the prediction API. Make sure the Python backend is running.');
  }
  if (!response.ok) {
    throw new Error(response.status === 422
      ? 'Please check the player statistics. The API rejected one or more inputs.'
      : 'Prediction failed. Make sure the Python backend is running and try again.');
  }
  const result: unknown = await response.json();
  if (typeof result !== 'object' || result === null || !('estimatedValueMillions' in result)
      || typeof result.estimatedValueMillions !== 'number' || !Number.isFinite(result.estimatedValueMillions)
      || result.estimatedValueMillions < 0 || !('isMock' in result) || result.isMock !== false) {
    throw new Error('The prediction API returned an unexpected response.');
  }
  return { estimatedValueMillions: result.estimatedValueMillions, isMock: false };
}
