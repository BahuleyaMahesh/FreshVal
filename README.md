# FreshVal

FreshVal is a frontend-only economic intelligence dashboard for independent bakeries. It uses a fixed synthetic demonstration dataset, a TypeScript linear regression model, local economic optimisation, Recharts visualisations and browser localStorage.

> **Important:** all built-in observations are synthetic demonstration data. They are not real market observations and do not establish causal price elasticity.

## Run locally

Prerequisite: Node.js 18+

```bash
npm install
npm run dev
```

Open the local Vite URL shown in the terminal (the default is `http://localhost:3000`).

Build and preview the production bundle:

```bash
npm run build
npm run preview
```

## Features

- Current price and FreshVal recommended price hero cards.
- Gradient-descent linear regression predicting units sold from product, price and season.
- Reproducible 80/20 evaluation split with calculated MAE and RMSE.
- Candidate price comparison using inventory-capped demand, revenue and contribution.
- Historical, seasonal and competitor analysis with responsive charts.
- Add, view, delete, export and import actual sales observations.
- Add and delete competitor observations.
- No backend, API keys, external datasets or runtime network requests are required.

Actual records and competitor records are stored in this browser's localStorage. They do not sync across devices or users. The built-in sample data in `src/data/sampleData.ts` is never modified.

## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. In Vercel, select **Add New Project** and import the repository.
3. Keep the detected framework as **Vite**.
4. Use `npm run build` as the build command and `dist` as the output directory (Vercel generally detects these automatically).
5. Deploy. No environment variables are needed.

The app is a static Vite build and is ready for direct Vercel deployment.
