# Forex Trading App

This project provides a simple local forex trading application with a Node.js/Express backend and a React frontend built using Vite.

## Structure

```
/backend        Backend Express server
  /models       Mongoose models (Trade, Plan, Journal)
  /routes       API routes (risk management)
  /services     Helper services
  app.js        Express app
  server.js     Server entry point
/frontend       React frontend
  /src
    /pages      React pages (Dashboard, RiskManagement)
    /components UI components (Sidebar)
  vite.config.js  Vite configuration
  index.html      HTML entry
```

## Usage

1. Install dependencies for each part:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```
2. Start MongoDB locally and run the backend:
   ```bash
   cd backend && npm start
   ```
3. In a new terminal, run the frontend:
   ```bash
   cd frontend && npm start
   ```
4. Open `http://localhost:3000` to access the app.

The Risk Management page fetches basic statistics from the backend and displays them.
