# CryptoTrader - Professional Crypto Trading Dashboard

This project provides a comprehensive cryptocurrency trading dashboard with real-time market data, advanced charting, portfolio tracking, and trading capabilities - all running on localhost.

## Features

### 🚀 Core Features
- **Real-time Market Data**: Live cryptocurrency prices and market statistics
- **Advanced Charts**: Candlestick charts with technical indicators (MA, RSI, Volume)
- **Trading Interface**: Buy/sell orders with market and limit order types
- **Portfolio Tracking**: Real-time portfolio performance and P&L analysis
- **Market Analysis**: Comprehensive market overview with top gainers/losers

### 📊 Dashboard Features
- Market overview with global statistics
- Interactive price charts with multiple timeframes
- Top cryptocurrencies list with sparkline charts
- Portfolio allocation visualization
- Trading history and performance tracking

### 💹 Trading Features
- Spot trading interface (demo mode)
- Market and limit orders
- Real-time balance tracking
- Trade history and analytics
- Advanced trading options with leverage

### 📈 Technical Analysis
- Multiple chart types (Line, Area, Candlestick)
- Technical indicators (Moving Averages, RSI)
- Support and resistance levels
- Volume analysis
- Price alerts (planned)

## Technology Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **CoinGecko API** for market data
- **Real-time caching** for performance
- **RESTful API** endpoints

### Frontend
- **React 19** with modern hooks
- **Material-UI (MUI)** for beautiful UI components
- **Recharts** for advanced charting
- **React Router** for navigation
- **Responsive design** for all devices

## Project Structure

```
/backend        Backend Express server
  /models       Mongoose models
  /routes       API routes (crypto, trading)
  /services     CryptoService for market data
  app.js        Express app configuration
  server.js     Server entry point

/frontend       React frontend
  /src
    /pages      React pages (Dashboard, MarketData, Trading, Portfolio, Charts)
    /components UI components (Sidebar, etc.)
  vite.config.js  Vite configuration
  index.html      HTML entry
```

## Quick Start

### 1. Install Dependencies
```bash
# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 2. Start the Backend Server
```bash
cd backend
npm start
```
The backend server will start on `http://localhost:5000`

### 3. Start the Frontend Development Server
```bash
cd frontend
npm start
```
The frontend will start on `http://localhost:5173`

### 4. Access the Application
Open your browser and navigate to `http://localhost:5173`

## Available Pages

1. **Dashboard** (`/`) - Market overview and statistics
2. **Market Data** (`/market`) - Comprehensive cryptocurrency table
3. **Charts** (`/charts`) - Advanced charting with technical analysis
4. **Trading** (`/trading`) - Buy/sell interface with portfolio tracking
5. **Portfolio** (`/portfolio`) - Portfolio performance and asset allocation

## API Endpoints

### Market Data
- `GET /api/crypto/market` - Get cryptocurrency market data
- `GET /api/crypto/global` - Get global market statistics
- `GET /api/crypto/coin/:id` - Get specific coin details
- `GET /api/crypto/coin/:id/history` - Get price history

### Trading (Demo)
- `POST /api/crypto/trade` - Execute trade orders
- `GET /api/crypto/portfolio` - Get portfolio data

## Features Overview

### Dashboard
- Global market statistics
- Bitcoin price chart
- Top cryptocurrencies list
- Real-time data updates

### Market Data
- Sortable cryptocurrency table
- Search and filter functionality
- Mini price charts (sparklines)
- Favorites system
- Real-time price updates

### Charts
- Multiple chart types and timeframes
- Technical indicators
- Support/resistance levels
- RSI and moving averages
- Volume analysis

### Trading
- Demo trading interface
- Buy/sell orders
- Balance tracking
- Trade history
- Advanced options with leverage

### Portfolio
- Asset allocation pie chart
- Performance tracking
- P&L analysis
- Holdings table
- Portfolio value history

## Demo Mode Notice

This application runs in **demo mode** with mock trading. No real cryptocurrency transactions are executed. All trading functions are for demonstration purposes only.

## Development

### Adding New Features
1. Backend: Add routes in `/backend/routes/`
2. Frontend: Add components in `/frontend/src/components/`
3. Add new pages in `/frontend/src/pages/`

### Customization
- Modify the color scheme in `App.js` theme configuration
- Add new cryptocurrencies in the coins array
- Customize charts in the Charts component
- Add new technical indicators

## Environment

- **Node.js**: v16+ recommended
- **npm**: v7+ recommended
- **Browser**: Modern browsers with ES6+ support

## License

This project is for educational and demonstration purposes.

---

**Note**: This is a demonstration application. Do not use for actual cryptocurrency trading without proper implementation of security measures, real API keys, and trading safeguards.
