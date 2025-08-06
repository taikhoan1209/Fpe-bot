import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  CurrencyBitcoin,
  AccountBalance,
  ShowChart,
  Timeline,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, AreaChart, Area } from 'recharts';

const StatCard = ({ title, value, change, changePercent, icon, color = 'primary' }) => (
  <Card sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography color="text.secondary" gutterBottom variant="body2">
            {title}
          </Typography>
          <Typography variant="h5" component="div" fontWeight="bold">
            {value}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            {changePercent >= 0 ? (
              <TrendingUp sx={{ color: 'success.main', mr: 0.5, fontSize: 16 }} />
            ) : (
              <TrendingDown sx={{ color: 'error.main', mr: 0.5, fontSize: 16 }} />
            )}
            <Typography
              variant="body2"
              sx={{
                color: changePercent >= 0 ? 'success.main' : 'error.main',
                fontWeight: 500,
              }}
            >
              {change} ({changePercent >= 0 ? '+' : ''}{changePercent.toFixed(2)}%)
            </Typography>
          </Box>
        </Box>
        <Avatar
          sx={{
            bgcolor: `${color}.main`,
            width: 48,
            height: 48,
            boxShadow: `0 4px 20px rgba(0, 212, 255, 0.3)`,
          }}
        >
          {icon}
        </Avatar>
      </Box>
    </CardContent>
  </Card>
);

const CoinListItem = ({ coin, onClick }) => (
  <ListItem
    sx={{
      borderRadius: 2,
      mb: 1,
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
      },
    }}
    onClick={() => onClick(coin)}
  >
    <ListItemAvatar>
      <Avatar src={coin.image} alt={coin.name} sx={{ width: 32, height: 32 }} />
    </ListItemAvatar>
    <ListItemText
      primary={
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body1" fontWeight="500">
            {coin.name}
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            ${coin.current_price?.toLocaleString()}
          </Typography>
        </Box>
      }
      secondary={
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
          <Typography variant="body2" color="text.secondary">
            {coin.symbol.toUpperCase()}
          </Typography>
          <Chip
            label={`${coin.price_change_percentage_24h >= 0 ? '+' : ''}${coin.price_change_percentage_24h?.toFixed(2)}%`}
            size="small"
            color={coin.price_change_percentage_24h >= 0 ? 'success' : 'error'}
            variant="outlined"
          />
        </Box>
      }
    />
  </ListItem>
);

function Dashboard() {
  const [marketData, setMarketData] = useState([]);
  const [globalData, setGlobalData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock chart data
  const chartData = [
    { time: '00:00', price: 45000 },
    { time: '04:00', price: 46200 },
    { time: '08:00', price: 44800 },
    { time: '12:00', price: 47500 },
    { time: '16:00', price: 46800 },
    { time: '20:00', price: 48200 },
    { time: '24:00', price: 47900 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch market data
        const marketResponse = await fetch('http://localhost:5000/api/crypto/market?per_page=10');
        const marketResult = await marketResponse.json();
        setMarketData(marketResult);

        // Fetch global data
        const globalResponse = await fetch('http://localhost:5000/api/crypto/global');
        const globalResult = await globalResponse.json();
        setGlobalData(globalResult);
        
      } catch (error) {
        console.error('Error fetching data:', error);
        // Use mock data on error
        setMarketData([
          {
            id: 'bitcoin',
            symbol: 'btc',
            name: 'Bitcoin',
            image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
            current_price: 47900,
            price_change_percentage_24h: 2.5,
            market_cap: 940000000000,
            total_volume: 28000000000,
          },
          {
            id: 'ethereum',
            symbol: 'eth',
            name: 'Ethereum',
            image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
            current_price: 2850,
            price_change_percentage_24h: 4.1,
            market_cap: 350000000000,
            total_volume: 16000000000,
          }
        ]);
        setGlobalData({
          total_market_cap: { usd: 1900000000000 },
          total_volume: { usd: 85000000000 },
          market_cap_change_percentage_24h_usd: 2.1,
          active_cryptocurrencies: 10500,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num) => {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    return num?.toLocaleString();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
        Market Overview
      </Typography>
      
      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Market Cap"
            value={`$${formatNumber(globalData?.total_market_cap?.usd)}`}
            change={`${formatNumber(globalData?.total_market_cap?.usd * 0.021)}`}
            changePercent={globalData?.market_cap_change_percentage_24h_usd || 2.1}
            icon={<AccountBalance />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="24h Volume"
            value={`$${formatNumber(globalData?.total_volume?.usd)}`}
            change="$2.1B"
            changePercent={1.8}
            icon={<ShowChart />}
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Cryptos"
            value={globalData?.active_cryptocurrencies?.toLocaleString() || '10,500'}
            change="+125"
            changePercent={1.2}
            icon={<CurrencyBitcoin />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Fear & Greed Index"
            value="74"
            change="+8"
            changePercent={12.1}
            icon={<Timeline />}
            color="warning"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Market Chart */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ height: 400 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Bitcoin Price (24h)
              </Typography>
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke="#00d4ff"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorPrice)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Cryptocurrencies */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: 400 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top Cryptocurrencies
              </Typography>
              <List sx={{ maxHeight: 320, overflow: 'auto' }}>
                {marketData.slice(0, 8).map((coin) => (
                  <CoinListItem
                    key={coin.id}
                    coin={coin}
                    onClick={(coin) => console.log('Selected coin:', coin)}
                  />
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
