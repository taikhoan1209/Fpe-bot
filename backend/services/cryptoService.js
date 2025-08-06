const axios = require('axios');

class CryptoService {
  constructor() {
    this.baseURL = 'https://api.coingecko.com/api/v3';
    this.cache = new Map();
    this.cacheTimeout = 60000; // 1 minute
  }

  async getMarketData(vs_currency = 'usd', order = 'market_cap_desc', per_page = 100, page = 1) {
    const cacheKey = `market_${vs_currency}_${order}_${per_page}_${page}`;
    
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    try {
      const response = await axios.get(`${this.baseURL}/coins/markets`, {
        params: {
          vs_currency,
          order,
          per_page,
          page,
          sparkline: true,
          price_change_percentage: '1h,24h,7d'
        }
      });
      
      const data = response.data;
      this.cache.set(cacheKey, { data, timestamp: Date.now() });
      return data;
    } catch (error) {
      console.error('Error fetching market data:', error);
      return this.getMockData();
    }
  }

  async getCoinDetails(coinId) {
    const cacheKey = `coin_${coinId}`;
    
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    try {
      const response = await axios.get(`${this.baseURL}/coins/${coinId}`, {
        params: {
          localization: false,
          tickers: false,
          market_data: true,
          community_data: false,
          developer_data: false,
          sparkline: true
        }
      });
      
      const data = response.data;
      this.cache.set(cacheKey, { data, timestamp: Date.now() });
      return data;
    } catch (error) {
      console.error('Error fetching coin details:', error);
      return null;
    }
  }

  async getCoinHistory(coinId, days = 7) {
    const cacheKey = `history_${coinId}_${days}`;
    
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout * 5) { // 5 minutes for history
        return cached.data;
      }
    }

    try {
      const response = await axios.get(`${this.baseURL}/coins/${coinId}/market_chart`, {
        params: {
          vs_currency: 'usd',
          days
        }
      });
      
      const data = response.data;
      this.cache.set(cacheKey, { data, timestamp: Date.now() });
      return data;
    } catch (error) {
      console.error('Error fetching coin history:', error);
      return this.getMockHistoryData();
    }
  }

  async getGlobalData() {
    const cacheKey = 'global_data';
    
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout * 2) { // 2 minutes for global data
        return cached.data;
      }
    }

    try {
      const response = await axios.get(`${this.baseURL}/global`);
      const data = response.data.data;
      this.cache.set(cacheKey, { data, timestamp: Date.now() });
      return data;
    } catch (error) {
      console.error('Error fetching global data:', error);
      return this.getMockGlobalData();
    }
  }

  getMockData() {
    return [
      {
        id: 'bitcoin',
        symbol: 'btc',
        name: 'Bitcoin',
        image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
        current_price: 45000,
        market_cap: 880000000000,
        market_cap_rank: 1,
        price_change_percentage_24h: 2.5,
        price_change_percentage_7d_in_currency: -1.2,
        price_change_percentage_1h_in_currency: 0.8,
        total_volume: 25000000000,
        sparkline_in_7d: {
          price: [44000, 44500, 45200, 44800, 45500, 45000]
        }
      },
      {
        id: 'ethereum',
        symbol: 'eth',
        name: 'Ethereum',
        image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
        current_price: 2800,
        market_cap: 340000000000,
        market_cap_rank: 2,
        price_change_percentage_24h: 4.1,
        price_change_percentage_7d_in_currency: 2.3,
        price_change_percentage_1h_in_currency: 1.2,
        total_volume: 15000000000,
        sparkline_in_7d: {
          price: [2750, 2800, 2850, 2780, 2820, 2800]
        }
      }
    ];
  }

  getMockHistoryData() {
    const now = Date.now();
    const prices = [];
    for (let i = 7; i >= 0; i--) {
      const timestamp = now - (i * 24 * 60 * 60 * 1000);
      const price = 45000 + Math.random() * 5000 - 2500;
      prices.push([timestamp, price]);
    }
    return { prices };
  }

  getMockGlobalData() {
    return {
      active_cryptocurrencies: 10000,
      total_market_cap: { usd: 1800000000000 },
      total_volume: { usd: 80000000000 },
      market_cap_percentage: { btc: 48.5, eth: 18.2 },
      market_cap_change_percentage_24h_usd: 2.1
    };
  }
}

module.exports = new CryptoService();