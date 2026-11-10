import PageHeading from '../components/PageHeading';
import ModelComparison from '../components/ModelComparison';
import Metric from '../components/Metric';
import { crossValidation, modelMetrics } from '../data/modelMetrics';

export default function Performance() {
  return <>
    <PageHeading title="Model Performance" description="Comparison results and final Random Forest evaluation. All monetary errors are reported in euros." />
    <section className="section"><div className="section-heading"><div><h2>Model comparison</h2><p>Initial held-out evaluation · 80% training / 20% test split</p></div></div><ModelComparison /><p className="supporting">Lower MAE and RMSE indicate smaller errors. Higher R² indicates a better fit.</p></section>
    <figure className="section"><figcaption><h2>Mean absolute error by model</h2><p>Error in € millions · lower is better · bars share a zero baseline</p></figcaption><div className="bar-chart">{modelMetrics.map(model => <div className="bar-row" key={model.name}><span>{model.name}</span><div className="bar-track"><div className={`bar ${model.name === 'Random Forest' ? 'final-bar' : ''}`} style={{ width: `${model.mae / 40 * 100}%` }} /></div><strong>€{model.mae.toFixed(2)}M</strong></div>)}</div></figure>
    <section className="section"><div className="section-heading"><div><h2>Final Random Forest: 5-fold cross-validation</h2><p>The final configuration uses a log-transformed target. These scores are separate from the initial comparison above.</p></div></div><dl className="metrics-row">
      <Metric label="Average MAE" value={`€${crossValidation.mae.toFixed(2)}M`} detail="Mean absolute error" />
      <Metric label="Average RMSE" value={`€${crossValidation.rmse.toFixed(2)}M`} detail="Root mean squared error" />
      <Metric label="Average R²" value={crossValidation.r2.toFixed(3)} detail="Coefficient of determination" />
      <Metric label="MAE standard deviation" value={`€${crossValidation.maeStd.toFixed(2)}M`} detail="Variation across folds" />
    </dl></section>
    <section className="note"><h2>Interpreting the results</h2><p>Cross-validation R² of 0.085 indicates limited explanatory power. Negative R² in the initial comparison means those results performed worse than predicting the evaluation set’s mean. With 79 matched players, the results are sensitive to how players are split between folds.</p><p>Metrics are recorded notebook results; they are not recalculated when the prediction form is submitted.</p></section>
  </>;
}
