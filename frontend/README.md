# Premier League Market Value Predictor — frontend

Responsive React + TypeScript + Vite app with a red and black football analytics theme. Predictions use the real saved Random Forest model through a local Python API.

## Run locally

Start the backend first, following `../backend/README.md`. Then, with Node.js 20.19+ or 22.12+:

```sh
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite (normally http://localhost:5173). Keep both servers running. Vite proxies `/api` to `http://127.0.0.1:8000`. Restart Vite if it was running before the proxy configuration was added.

```sh
npm run build    # Type-check and create dist/
npm run preview  # Preview static production output (requires a deployed API URL)
```

## Structure

- `src/components/`: top navigation, page headings, compact metrics, comparison table.
- `src/pages/`: overview, predictor, model performance, methodology, player directory.
- `src/data/modelMetrics.ts`: supplied comparison and cross-validation metrics.
- `src/services/prediction.ts`: typed HTTP client for real inference, with timeout and response checks.
- `src/styles.css`: neutral dark layout, restrained red accent, compact tables and mobile breakpoints.
- `vite.config.ts`: local API proxy.

Routes: `/`, `/players`, `/predict`, `/performance`, `/methodology`. The old `/about` route redirects to `/methodology`. The player directory is linked from the overview and methodology.

The form submits all seven inputs to `POST /api/predict`. It handles loading, reset, validation, and API errors, without falling back to mock predictions.

## Future API Gateway connection

Set `VITE_API_BASE_URL` to the backend origin before building, for example `https://your-api.example` (including a stage prefix if needed). The client appends `/api/predict`. Configure API Gateway CORS for the frontend origin. Never put AWS credentials in frontend code. Configure an SPA rewrite to `/index.html` when hosting nested frontend routes.

Typography uses the system sans-serif stack, without external font requests. The model MAE comparison uses CSS bars; no chart or UI framework is required. Existing Python training code, notebook, and model artifact are unchanged.

## Players & values tab

`src/data/players.json` contains 103 Premier League records from the notebook’s [Kaggle source](https://www.kaggle.com/datasets/kanchana1990/football-transfer-value-intelligence-2024), built February 21, 2026, with Transfermarkt-derived market values. These historical recorded values are separate from predictions. The source is a subset, not a complete live roster. Club and position are omitted because those source columns contain malformed data. Dates are individual last valuation dates.

To refresh from a downloaded source archive, run `python3 scripts/import-players.py /path/to/archive.zip` from `frontend/`. The importer selects only Premier League rows and validates unique IDs and a single snapshot date.

The performance page reports fixed notebook evaluation results, including MAE standard deviation of €3.54M; it does not rerun cross-validation. Predictions call the real local model API. AWS hosting and inference deployment remain planned.
