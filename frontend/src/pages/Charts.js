import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  Avatar,
  Chip,
  Button,
  ButtonGroup,
} from '@mui/material';
import {
  CandlestickChart,
  ShowChart,
  Timeline,
  TrendingUp,
  TrendingDown,
  BarChart,
} from '@mui/icons-material';
import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  AreaChart,
} from 'recharts';

function Charts() {
  const [selectedCoin, setSelectedCoin] = useState('bitcoin');
  const [timeframe, setTimeframe] = useState('24h');
  const [chartType, setChartType] = useState('line');
  const [indicators, setIndicators] = useState(['volume']);
  const [priceData, setPriceData] = useState([]);
  const [coinDetails, setCoinDetails] = useState(null);

  const coins = [
    { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png' },
    { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png' },
    { id: 'binancecoin', symbol: 'BNB', name: 'BNB', image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png' },
  ];

  // Generate mock price data
  const generateMockData = () => {
    const data = [];
    const basePrice = selectedCoin === 'bitcoin' ? 47000 : selectedCoin === 'ethereum' ? 2800 : 315;
    const dataPoints = timeframe === '1h' ? 60 : timeframe === '24h' ? 24 : timeframe === '7d' ? 7 : 30;
    
    for (let i = 0; i < dataPoints; i++) {
      const timestamp = Date.now() - (dataPoints - i) * (timeframe === '1h' ? 60000 : timeframe === '24h' ? 3600000 : 86400000);
      const variation = (Math.random() - 0.5) * 0.1; // 10% variation
      const price = basePrice * (1 + variation + Math.sin(i / 10) * 0.05);
      const volume = Math.random() * 1000000000;
      
      data.push({
        timestamp,
        time: new Date(timestamp).toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit',
          ...(timeframe === '7d' || timeframe === '30d' ? { month: 'short', day: 'numeric' } : {})
        }),
        price: parseFloat(price.toFixed(2)),
        volume: Math.floor(volume),
        high: parseFloat((price * 1.02).toFixed(2)),
        low: parseFloat((price * 0.98).toFixed(2)),
        open: parseFloat((price * 0.99).toFixed(2)),
        close: parseFloat(price.toFixed(2)),
        ma20: parseFloat((price * 0.995).toFixed(2)),
        ma50: parseFloat((price * 0.99).toFixed(2)),
        rsi: Math.random() * 100,
      });
    }
    return data;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, you would fetch actual data here
        const mockData = generateMockData();
        setPriceData(mockData);
        
        // Mock coin details
        const coinData = coins.find(coin => coin.id === selectedCoin);
        setCoinDetails({
          ...coinData,
          current_price: mockData[mockData.length - 1]?.price || 0,
          price_change_24h: ((Math.random() - 0.5) * 1000),
          price_change_percentage_24h: ((Math.random() - 0.5) * 10),
          market_cap: Math.random() * 1000000000000,
          volume_24h: Math.random() * 50000000000,
          high_24h: Math.max(...mockData.map(d => d.high)),
          low_24h: Math.min(...mockData.map(d => d.low)),
        });
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchData();
  }, [selectedCoin, timeframe]);

  const formatNumber = (num) => {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num?.toFixed(2);
  };

  const formatPrice = (price) => {
    if (price < 1) return price?.toFixed(6);
    if (price < 100) return price?.toFixed(4);
    return price?.toFixed(2);
  };

  const handleIndicatorChange = (event, newIndicators) => {
    setIndicators(newIndicators);
  };

  const selectedCoinData = coins.find(coin => coin.id === selectedCoin);

  const renderChart = () => {
    if (!priceData.length) return null;

    const commonProps = {
      width: '100%',
      height: 400,
      data: priceData,
      margin: { top: 20, right: 30, left: 20, bottom: 5 },
    };

    switch (chartType) {
      case 'area':
        return (
          <ResponsiveContainer {...commonProps}>
            <AreaChart data={priceData}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="time" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1d26', border: '1px solid rgba(255,255,255,0.1)' }}
                formatter={(value) => [`$${formatPrice(value)}`, 'Price']}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke="#00d4ff"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorPrice)"
              />
              {indicators.includes('ma20') && (
                <Line type="monotone" dataKey="ma20" stroke="#ff6b35" strokeWidth={1} dot={false} />
              )}
              {indicators.includes('ma50') && (
                <Line type="monotone" dataKey="ma50" stroke="#00ff88" strokeWidth={1} dot={false} />
              )}
            </AreaChart>
          </ResponsiveContainer>
        );
      
      case 'candlestick':
        return (
          <ResponsiveContainer {...commonProps}>
            <ComposedChart data={priceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="time" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1d26', border: '1px solid rgba(255,255,255,0.1)' }}
                formatter={(value, name) => {
                  if (name === 'volume') return [formatNumber(value), 'Volume'];
                  return [`$${formatPrice(value)}`, name.toUpperCase()];
                }}
              />
              <Bar dataKey="volume" fill="rgba(255, 255, 255, 0.1)" yAxisId="volume" />
              <Line type="monotone" dataKey="high" stroke="#00ff88" strokeWidth={1} dot={false} />
              <Line type="monotone" dataKey="low" stroke="#ff4757" strokeWidth={1} dot={false} />
              <Line type="monotone" dataKey="close" stroke="#00d4ff" strokeWidth={2} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        );

      default:
        return (
          <ResponsiveContainer {...commonProps}>
            <LineChart data={priceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="time" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1d26', border: '1px solid rgba(255,255,255,0.1)' }}
                formatter={(value, name) => {
                  if (name === 'volume') return [formatNumber(value), 'Volume'];
                  if (name === 'rsi') return [value.toFixed(2), 'RSI'];
                  return [`$${formatPrice(value)}`, name.toUpperCase()];
                }}
              />
              <Line type="monotone" dataKey="price" stroke="#00d4ff" strokeWidth={2} dot={false} />
              {indicators.includes('ma20') && (
                <Line type="monotone" dataKey="ma20" stroke="#ff6b35" strokeWidth={1} dot={false} />
              )}
              {indicators.includes('ma50') && (
                <Line type="monotone" dataKey="ma50" stroke="#00ff88" strokeWidth={1} dot={false} />
              )}
              {indicators.includes('volume') && (
                <Bar dataKey="volume" fill="rgba(255, 255, 255, 0.2)" yAxisId="volume" />
              )}
            </LineChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
        Advanced Charts
      </Typography>

      {/* Coin Info Header */}
      {coinDetails && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar src={selectedCoinData?.image} sx={{ width: 48, height: 48, mr: 2 }} />
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    {coinDetails.name} ({coinDetails.symbol.toUpperCase()})
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="primary">
                    ${formatPrice(coinDetails.current_price)}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 4 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">24h Change</Typography>
                  <Chip
                    label={`${coinDetails.price_change_percentage_24h >= 0 ? '+' : ''}${coinDetails.price_change_percentage_24h?.toFixed(2)}%`}
                    color={coinDetails.price_change_percentage_24h >= 0 ? 'success' : 'error'}
                    variant="outlined"
                  />
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">24h High</Typography>
                  <Typography variant="body1" fontWeight="500">
                    ${formatPrice(coinDetails.high_24h)}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">24h Low</Typography>
                  <Typography variant="body1" fontWeight="500">
                    ${formatPrice(coinDetails.low_24h)}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">Volume (24h)</Typography>
                  <Typography variant="body1" fontWeight="500">
                    ${formatNumber(coinDetails.volume_24h)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      <Grid container spacing={3}>
        {/* Chart Controls */}
        <Grid item xs={12}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Cryptocurrency</InputLabel>
                    <Select
                      value={selectedCoin}
                      label="Cryptocurrency"
                      onChange={(e) => setSelectedCoin(e.target.value)}
                    >
                      {coins.map((coin) => (
                        <MenuItem key={coin.id} value={coin.id}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar src={coin.image} sx={{ width: 24, height: 24, mr: 1 }} />
                            {coin.name} ({coin.symbol})
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={2}>
                  <Typography variant="body2" gutterBottom>Timeframe</Typography>
                  <ButtonGroup variant="outlined" size="small">
                    {['1h', '24h', '7d', '30d'].map((tf) => (
                      <Button
                        key={tf}
                        variant={timeframe === tf ? 'contained' : 'outlined'}
                        onClick={() => setTimeframe(tf)}
                      >
                        {tf}
                      </Button>
                    ))}
                  </ButtonGroup>
                </Grid>

                <Grid item xs={12} md={2}>
                  <Typography variant="body2" gutterBottom>Chart Type</Typography>
                  <ToggleButtonGroup
                    value={chartType}
                    exclusive
                    onChange={(e, newType) => newType && setChartType(newType)}
                    size="small"
                  >
                    <ToggleButton value="line">
                      <ShowChart />
                    </ToggleButton>
                    <ToggleButton value="area">
                      <Timeline />
                    </ToggleButton>
                    <ToggleButton value="candlestick">
                      <BarChart />
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Grid>

                <Grid item xs={12} md={3}>
                  <Typography variant="body2" gutterBottom>Indicators</Typography>
                  <ToggleButtonGroup
                    value={indicators}
                    onChange={handleIndicatorChange}
                    size="small"
                  >
                    <ToggleButton value="ma20">MA20</ToggleButton>
                    <ToggleButton value="ma50">MA50</ToggleButton>
                    <ToggleButton value="volume">Volume</ToggleButton>
                    <ToggleButton value="rsi">RSI</ToggleButton>
                  </ToggleButtonGroup>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Main Chart */}
        <Grid item xs={12} lg={9}>
          <Card sx={{ height: 500 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {selectedCoinData?.name} Price Chart ({timeframe})
              </Typography>
              {renderChart()}
            </CardContent>
          </Card>
        </Grid>

        {/* Technical Analysis Panel */}
        <Grid item xs={12} lg={3}>
          <Card sx={{ height: 500 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Technical Analysis
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Moving Averages
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">MA20</Typography>
                  <Typography variant="body2" color="warning.main">
                    ${formatPrice(priceData[priceData.length - 1]?.ma20 || 0)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">MA50</Typography>
                  <Typography variant="body2" color="success.main">
                    ${formatPrice(priceData[priceData.length - 1]?.ma50 || 0)}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Oscillators
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">RSI (14)</Typography>
                  <Chip
                    label={priceData[priceData.length - 1]?.rsi?.toFixed(2) || '0'}
                    size="small"
                    color={
                      (priceData[priceData.length - 1]?.rsi || 0) > 70 ? 'error' :
                      (priceData[priceData.length - 1]?.rsi || 0) < 30 ? 'success' : 'default'
                    }
                  />
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Support & Resistance
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Resistance</Typography>
                  <Typography variant="body2" color="error.main">
                    ${formatPrice((coinDetails?.current_price || 0) * 1.05)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Support</Typography>
                  <Typography variant="body2" color="success.main">
                    ${formatPrice((coinDetails?.current_price || 0) * 0.95)}
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Overall Signal
                </Typography>
                <Chip
                  label="NEUTRAL"
                  color="warning"
                  variant="filled"
                  size="small"
                  sx={{ width: '100%' }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Charts;