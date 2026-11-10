import { Link } from 'react-router-dom';
import PageHeading from '../components/PageHeading';
import Metric from '../components/Metric';
import ModelComparison from '../components/ModelComparison';

export default function Dashboard() {
  return <>
    <PageHeading title="Premier League Market Value Predictor" description="Machine learning analysis of Premier League player performance and estimated market value." />
    <dl className="metrics-row">
      <Metric label="Matched players" value="79" detail="Exact player-name matches" />
      <Metric label="Final model" value="Random Forest" detail="Regression with a log-transformed target" />
      <Metric label="Cross-validation MAE" value="€17.53M" detail="Average over 5 folds" />
      <Metric label="Cross-validation R²" value="0.085" detail="Limited explanatory power" />
    </dl>
    <div className="overview-grid">
      <section><h2>Research question</h2><p>How well can age, position, playing time, and goal contributions explain Premier League player market values?</p><p>The predictor accepts seven player statistics and uses the saved Random Forest model to estimate a market value in euros.</p><Link to="/predict" className="button">Open predictor</Link></section>
      <section><h2>Dataset</h2><p>The notebook started with 454 FBref players and 103 Premier League records from a market-value dataset. Exact name matching produced 79 players for modelling.</p><p>The recorded market values are a historical snapshot, separate from model estimates.</p><Link to="/players" className="text-link">Browse player values →</Link></section>
    </div>
    <section className="section"><div className="section-heading"><h2>Model comparison</h2><Link className="text-link" to="/performance">Evaluation details →</Link></div><ModelComparison /></section>
    <section className="note"><h2>Current limitations</h2><p>The sample is small, and performance statistics capture only part of a player’s market value. Cross-validation R² is low; these estimates should be treated as experimental. The model runs through a local Python API. AWS deployment is planned.</p><Link className="text-link" to="/methodology">Read the methodology →</Link></section>
  </>;
}
