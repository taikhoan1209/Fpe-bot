const express = require('express');
const router = express.Router();
const cryptoService = require('../services/cryptoService');

// Get market data
router.get('/market', async (req, res) => {
  try {
    const { 
      vs_currency = 'usd', 
      order = 'market_cap_desc', 
      per_page = 100, 
      page = 1 
    } = req.query;
    
    const data = await cryptoService.getMarketData(vs_currency, order, per_page, page);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch market data' });
  }
});

// Get coin details
router.get('/coin/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await cryptoService.getCoinDetails(id);
    
    if (!data) {
      return res.status(404).json({ error: 'Coin not found' });
    }
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch coin details' });
  }
});

// Get coin price history
router.get('/coin/:id/history', async (req, res) => {
  try {
    const { id } = req.params;
    const { days = 7 } = req.query;
    
    const data = await cryptoService.getCoinHistory(id, days);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch coin history' });
  }
});

// Get global market data
router.get('/global', async (req, res) => {
  try {
    const data = await cryptoService.getGlobalData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch global data' });
  }
});

// Mock trading endpoints
router.post('/trade', async (req, res) => {
  try {
    const { type, symbol, amount, price } = req.body;
    
    // Mock trade execution
    const trade = {
      id: Date.now().toString(),
      type, // 'buy' or 'sell'
      symbol,
      amount,
      price,
      timestamp: new Date(),
      status: 'completed',
      total: amount * price
    };
    
    res.json(trade);
  } catch (error) {
    res.status(500).json({ error: 'Failed to execute trade' });
  }
});

// Get portfolio mock data
router.get('/portfolio', async (req, res) => {
  try {
    const portfolio = {
      totalValue: 125000,
      pnl: 15000,
      pnlPercentage: 13.6,
      assets: [
        {
          id: 'bitcoin',
          symbol: 'BTC',
          name: 'Bitcoin',
          amount: 2.5,
          value: 112500,
          pnl: 12500,
          pnlPercentage: 12.5
        },
        {
          id: 'ethereum',
          symbol: 'ETH',
          name: 'Ethereum',
          amount: 4.5,
          value: 12600,
          pnl: 2500,
          pnlPercentage: 24.7
        }
      ]
    };
    
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch portfolio' });
  }
});

module.exports = router;