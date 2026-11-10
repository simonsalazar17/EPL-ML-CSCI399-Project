import { modelMetrics } from '../data/modelMetrics';
export default function ModelComparison() {
  return <div className="table-scroll"><table><caption className="sr-only">Model comparison evaluation results</caption><thead><tr><th scope="col">Model</th><th scope="col">MAE</th><th scope="col">RMSE</th><th scope="col">R²</th></tr></thead><tbody>{modelMetrics.map(model => <tr key={model.name} className={model.name === 'Random Forest' ? 'selected-row' : ''}><th scope="row">{model.name}{model.name === 'Random Forest' && <span className="table-note">Selected</span>}</th><td>€{model.mae.toFixed(2)}M</td><td>€{model.rmse.toFixed(2)}M</td><td>{model.r2.toFixed(3)}</td></tr>)}</tbody></table></div>;
}
