import { useState } from 'react';
import type { FormEvent } from 'react';
import PageHeading from '../components/PageHeading';
import { predictMarketValue } from '../services/prediction';
import type { PlayerInputs, PredictionResult } from '../services/prediction';

const defaults: PlayerInputs = { age: 25, position: 'FW', minutesPlayed: 2400, goals: 15, assists: 7, goalsPer90: 0.56, assistsPer90: 0.26 };
const fields = [
  { key: 'age', label: 'Age', unit: 'years', min: 15, max: 50, step: 1 },
  { key: 'minutesPlayed', label: 'Minutes played', unit: 'minutes', min: 0, step: 1 },
  { key: 'goals', label: 'Goals', unit: 'total', min: 0, step: 1 },
  { key: 'assists', label: 'Assists', unit: 'total', min: 0, step: 1 },
  { key: 'goalsPer90', label: 'Goals per 90', unit: 'per 90 minutes', min: 0, step: 0.01 },
  { key: 'assistsPer90', label: 'Assists per 90', unit: 'per 90 minutes', min: 0, step: 0.01 },
] as const;

export default function Predictor() {
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const inputs: PlayerInputs = {
      age: Number(data.get('age')), position: data.get('position') as PlayerInputs['position'],
      minutesPlayed: Number(data.get('minutesPlayed')), goals: Number(data.get('goals')),
      assists: Number(data.get('assists')), goalsPer90: Number(data.get('goalsPer90')), assistsPer90: Number(data.get('assistsPer90')),
    };
    setLoading(true); setError(''); setResult(null);
    try { setResult(await predictMarketValue(inputs)); }
    catch (error) { setError(error instanceof Error ? error.message : 'Unable to generate a prediction. Please try again.'); }
    finally { setLoading(false); }
  }
  return <>
    <PageHeading title="Player Value Predictor" description="Enter player statistics to estimate market value with the trained Random Forest model." />
    <div className="predictor-grid">
      <section className="prediction-form">
        <div className="section-heading">
          <div><h2>Player statistics</h2><p>All seven inputs are required.</p></div>
        </div>
        <form
          onSubmit={handleSubmit}
          onChange={() => { setResult(null); setError(''); }}
          onReset={() => { setResult(null); setError(''); }}
        >
          <fieldset disabled={loading}>
            <legend className="sr-only">Player statistics</legend>
            <div className="form-grid">
              {fields.slice(0, 1).map(field => <label className="field" key={field.key}>
                {field.label}<span className="field-hint">{field.unit}</span>
                <input
                  name={field.key}
                  type="number"
                  min={field.min}
                  max={'max' in field ? field.max : undefined}
                  step={field.step}
                  defaultValue={defaults[field.key]}
                  required
                />
              </label>)}
              <label className="field">
                Position<span className="field-hint">playing role</span>
                <select name="position" defaultValue={defaults.position} required>
                  {['FW', 'MF', 'DF', 'GK'].map(position => <option key={position} value={position}>{position}</option>)}
                </select>
              </label>
              {fields.slice(1).map(field => <label className="field" key={field.key}>
                {field.label}<span className="field-hint">{field.unit}</span>
                <input
                  name={field.key}
                  type="number"
                  min={field.min}
                  max={'max' in field ? field.max : undefined}
                  step={field.step}
                  defaultValue={defaults[field.key]}
                  required
                />
              </label>)}

            </div>
            <div className="form-actions">
              <button className="button" type="submit">{loading ? 'Calculating…' : 'Predict Market Value'}</button>
              <button className="reset-button" type="reset">Reset</button>
            </div>
          </fieldset>
        </form>
      </section>
      <aside className="prediction-panel" aria-label="Prediction result">
        <div aria-live="polite" aria-busy={loading}>
          <h2>{loading ? 'Calculating estimate…' : 'Estimated Market Value'}</h2>
          {result ? <>
            <div className="prediction-value">€{result.estimatedValueMillions.toFixed(1)}<span> million</span></div>
            <p>Model estimate from the submitted statistics, not an official valuation or a transfer fee.</p>
          </> : <p>Submit the player statistics to see an estimate.</p>}
        </div>
        {error && <p role="alert" className="error">{error}</p>}
        <div className="prediction-footnote">Random Forest · Values in EUR<br />Cross-validation MAE: €17.53M</div>
      </aside>
    </div>
  </>;
}
