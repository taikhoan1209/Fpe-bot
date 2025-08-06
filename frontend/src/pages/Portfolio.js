import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  CircularProgress,
  LinearProgress,
} from '@mui/material';
import {
  AccountBalanceWallet,
  TrendingUp,
  TrendingDown,
  ShowChart,
  Assessment,
} from '@mui/icons-material';
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

function Portfolio() {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock portfolio performance data
  const performanceData = [
    { date: '2024-01-01', value: 100000 },
    { date: '2024-01-08', value: 105000 },
    { date: '2024-01-15', value: 98000 },
    { date: '2024-01-22', value: 112000 },
    { date: '2024-01-29', value: 125000 },
  ];

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/crypto/portfolio');
        const data = await response.json();
        setPortfolio(data);
      } catch (error) {
        console.error('Error fetching portfolio:', error);
        // Use mock data on error
        setPortfolio({
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
              pnlPercentage: 12.5,
              image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
              currentPrice: 45000,
              avgBuyPrice: 40000,
            },
            {
              id: 'ethereum',
              symbol: 'ETH',
              name: 'Ethereum',
              amount: 4.5,
              value: 12600,
              pnl: 2500,
              pnlPercentage: 24.7,
              image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
              currentPrice: 2800,
              avgBuyPrice: 2250,
            },
            {
              id: 'binancecoin',
              symbol: 'BNB',
              name: 'BNB',
              amount: 10,
              value: 3150,
              pnl: -350,
              pnlPercentage: -10.0,
              image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png',
              currentPrice: 315,
              avgBuyPrice: 350,
            }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const formatCurrency = (num) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(num);
  };

  const getColorForPercentage = (percentage) => {
    return percentage >= 0 ? '#00ff88' : '#ff4757';
  };

  // Prepare pie chart data
  const pieChartData = portfolio?.assets.map(asset => ({
    name: asset.symbol,
    value: asset.value,
    percentage: ((asset.value / portfolio.totalValue) * 100).toFixed(1)
  }));

  const COLORS = ['#00d4ff', '#ff6b35', '#00ff88', '#ff4757', '#ffa502'];

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
        Portfolio
      </Typography>

      {/* Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom variant="body2">
                    Total Portfolio Value
                  </Typography>
                  <Typography variant="h5" component="div" fontWeight="bold">
                    {formatCurrency(portfolio.totalValue)}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                  <AccountBalanceWallet />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom variant="body2">
                    Total P&L
                  </Typography>
                  <Typography variant="h5" component="div" fontWeight="bold" 
                    sx={{ color: portfolio.pnl >= 0 ? 'success.main' : 'error.main' }}>
                    {formatCurrency(portfolio.pnl)}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    {portfolio.pnlPercentage >= 0 ? (
                      <TrendingUp sx={{ color: 'success.main', mr: 0.5, fontSize: 16 }} />
                    ) : (
                      <TrendingDown sx={{ color: 'error.main', mr: 0.5, fontSize: 16 }} />
                    )}
                    <Typography
                      variant="body2"
                      sx={{ color: portfolio.pnl >= 0 ? 'success.main' : 'error.main' }}
                    >
                      {portfolio.pnlPercentage >= 0 ? '+' : ''}{portfolio.pnlPercentage.toFixed(2)}%
                    </Typography>
                  </Box>
                </Box>
                <Avatar sx={{ 
                  bgcolor: portfolio.pnl >= 0 ? 'success.main' : 'error.main', 
                  width: 48, 
                  height: 48 
                }}>
                  {portfolio.pnl >= 0 ? <TrendingUp /> : <TrendingDown />}
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom variant="body2">
                    Best Performer
                  </Typography>
                  <Typography variant="h6" component="div" fontWeight="bold">
                    ETH
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'success.main' }}>
                    +24.7%
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.main', width: 48, height: 48 }}>
                  <ShowChart />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom variant="body2">
                    Total Assets
                  </Typography>
                  <Typography variant="h5" component="div" fontWeight="bold">
                    {portfolio.assets.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Cryptocurrencies
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'secondary.main', width: 48, height: 48 }}>
                  <Assessment />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Portfolio Performance Chart */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ height: 400 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Portfolio Performance (30 Days)
              </Typography>
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip 
                    formatter={(value) => [formatCurrency(value), 'Portfolio Value']}
                    labelStyle={{ color: '#fff' }}
                    contentStyle={{ backgroundColor: '#1a1d26', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#00d4ff"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorValue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Asset Allocation */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: 400 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Asset Allocation
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ percentage }) => `${percentage}%`}
                  >
                    {pieChartData?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [formatCurrency(value), 'Value']}
                    contentStyle={{ backgroundColor: '#1a1d26', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <Box sx={{ mt: 2 }}>
                {pieChartData?.map((asset, index) => (
                  <Box key={asset.name} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        backgroundColor: COLORS[index % COLORS.length],
                        borderRadius: '50%',
                        mr: 1,
                      }}
                    />
                    <Typography variant="body2" sx={{ flex: 1 }}>
                      {asset.name}
                    </Typography>
                    <Typography variant="body2" fontWeight="500">
                      {asset.percentage}%
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Holdings Table */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Holdings
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Asset</TableCell>
                      <TableCell align="right">Holdings</TableCell>
                      <TableCell align="right">Avg. Buy Price</TableCell>
                      <TableCell align="right">Current Price</TableCell>
                      <TableCell align="right">Market Value</TableCell>
                      <TableCell align="right">P&L</TableCell>
                      <TableCell align="right">Allocation</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {portfolio.assets.map((asset) => {
                      const allocation = ((asset.value / portfolio.totalValue) * 100);
                      return (
                        <TableRow key={asset.id}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar
                                src={asset.image}
                                alt={asset.name}
                                sx={{ width: 32, height: 32, mr: 2 }}
                              />
                              <Box>
                                <Typography variant="body2" fontWeight="500">
                                  {asset.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {asset.symbol}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight="500">
                              {formatNumber(asset.amount)} {asset.symbol}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2">
                              {formatCurrency(asset.avgBuyPrice)}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2">
                              {formatCurrency(asset.currentPrice)}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight="500">
                              {formatCurrency(asset.value)}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Box>
                              <Typography
                                variant="body2"
                                fontWeight="500"
                                sx={{ color: getColorForPercentage(asset.pnl) }}
                              >
                                {formatCurrency(asset.pnl)}
                              </Typography>
                              <Chip
                                label={`${asset.pnlPercentage >= 0 ? '+' : ''}${asset.pnlPercentage.toFixed(2)}%`}
                                size="small"
                                color={asset.pnlPercentage >= 0 ? 'success' : 'error'}
                                variant="outlined"
                              />
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Box sx={{ width: 100 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="caption">
                                  {allocation.toFixed(1)}%
                                </Typography>
                              </Box>
                              <LinearProgress
                                variant="determinate"
                                value={allocation}
                                sx={{
                                  height: 6,
                                  borderRadius: 3,
                                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                  '& .MuiLinearProgress-bar': {
                                    backgroundColor: COLORS[portfolio.assets.indexOf(asset) % COLORS.length],
                                  }
                                }}
                              />
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Portfolio;