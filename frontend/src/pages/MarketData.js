import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Pagination,
  CircularProgress,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Search,
  Refresh,
  TrendingUp,
  TrendingDown,
  Star,
  StarBorder,
} from '@mui/icons-material';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

function MarketData() {
  const [marketData, setMarketData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(50);
  const [sortBy, setSortBy] = useState('market_cap_desc');
  const [favorites, setFavorites] = useState(new Set());

  const fetchMarketData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/crypto/market?per_page=${perPage}&page=${page}&order=${sortBy}`
      );
      const data = await response.json();
      setMarketData(data);
    } catch (error) {
      console.error('Error fetching market data:', error);
      // Use mock data on error
      setMarketData([
        {
          id: 'bitcoin',
          symbol: 'btc',
          name: 'Bitcoin',
          image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
          current_price: 47900,
          price_change_percentage_24h: 2.5,
          price_change_percentage_7d_in_currency: -1.2,
          price_change_percentage_1h_in_currency: 0.8,
          market_cap: 940000000000,
          market_cap_rank: 1,
          total_volume: 28000000000,
          sparkline_in_7d: { price: [44000, 44500, 45200, 44800, 45500, 47900] }
        },
        {
          id: 'ethereum',
          symbol: 'eth',
          name: 'Ethereum',
          image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
          current_price: 2850,
          price_change_percentage_24h: 4.1,
          price_change_percentage_7d_in_currency: 2.3,
          price_change_percentage_1h_in_currency: 1.2,
          market_cap: 350000000000,
          market_cap_rank: 2,
          total_volume: 16000000000,
          sparkline_in_7d: { price: [2750, 2800, 2850, 2780, 2820, 2850] }
        },
        {
          id: 'binancecoin',
          symbol: 'bnb',
          name: 'BNB',
          image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png',
          current_price: 315,
          price_change_percentage_24h: -0.8,
          price_change_percentage_7d_in_currency: 3.2,
          price_change_percentage_1h_in_currency: -0.3,
          market_cap: 47000000000,
          market_cap_rank: 3,
          total_volume: 1200000000,
          sparkline_in_7d: { price: [310, 318, 322, 315, 320, 315] }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
  }, [page, perPage, sortBy]);

  useEffect(() => {
    const interval = setInterval(fetchMarketData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

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

  const toggleFavorite = (coinId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(coinId)) {
      newFavorites.delete(coinId);
    } else {
      newFavorites.add(coinId);
    }
    setFavorites(newFavorites);
  };

  const filteredData = marketData.filter(coin =>
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const MiniChart = ({ data, positive }) => {
    if (!data || !data.length) return null;
    
    const chartData = data.map((price, index) => ({
      x: index,
      y: price
    }));

    return (
      <ResponsiveContainer width={80} height={40}>
        <LineChart data={chartData}>
          <Line
            type="monotone"
            dataKey="y"
            stroke={positive ? '#00ff88' : '#ff4757'}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  if (loading && marketData.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" color="primary">
          Market Data
        </Typography>
        <IconButton onClick={fetchMarketData} disabled={loading}>
          <Refresh />
        </IconButton>
      </Box>

      {/* Filters and Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search cryptocurrencies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort By"
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <MenuItem value="market_cap_desc">Market Cap (High to Low)</MenuItem>
                  <MenuItem value="market_cap_asc">Market Cap (Low to High)</MenuItem>
                  <MenuItem value="volume_desc">Volume (High to Low)</MenuItem>
                  <MenuItem value="id_asc">Name (A to Z)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Per Page</InputLabel>
                <Select
                  value={perPage}
                  label="Per Page"
                  onChange={(e) => setPerPage(e.target.value)}
                >
                  <MenuItem value={25}>25</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                  <MenuItem value={100}>100</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Market Data Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>#</TableCell>
                <TableCell>Name</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">1h %</TableCell>
                <TableCell align="right">24h %</TableCell>
                <TableCell align="right">7d %</TableCell>
                <TableCell align="right">Market Cap</TableCell>
                <TableCell align="right">Volume (24h)</TableCell>
                <TableCell align="center">Last 7 Days</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((coin) => (
                <TableRow
                  key={coin.id}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    },
                  }}
                >
                  <TableCell>
                    <IconButton size="small" onClick={() => toggleFavorite(coin.id)}>
                      {favorites.has(coin.id) ? <Star color="warning" /> : <StarBorder />}
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {coin.market_cap_rank}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar
                        src={coin.image}
                        alt={coin.name}
                        sx={{ width: 24, height: 24, mr: 2 }}
                      />
                      <Box>
                        <Typography variant="body2" fontWeight="500">
                          {coin.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {coin.symbol.toUpperCase()}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight="500">
                      ${formatPrice(coin.current_price)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Chip
                      label={`${coin.price_change_percentage_1h_in_currency >= 0 ? '+' : ''}${coin.price_change_percentage_1h_in_currency?.toFixed(2) || '0.00'}%`}
                      size="small"
                      color={coin.price_change_percentage_1h_in_currency >= 0 ? 'success' : 'error'}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Chip
                      label={`${coin.price_change_percentage_24h >= 0 ? '+' : ''}${coin.price_change_percentage_24h?.toFixed(2) || '0.00'}%`}
                      size="small"
                      color={coin.price_change_percentage_24h >= 0 ? 'success' : 'error'}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Chip
                      label={`${coin.price_change_percentage_7d_in_currency >= 0 ? '+' : ''}${coin.price_change_percentage_7d_in_currency?.toFixed(2) || '0.00'}%`}
                      size="small"
                      color={coin.price_change_percentage_7d_in_currency >= 0 ? 'success' : 'error'}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">
                      ${formatNumber(coin.market_cap)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">
                      ${formatNumber(coin.total_volume)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <MiniChart
                      data={coin.sparkline_in_7d?.price}
                      positive={coin.price_change_percentage_7d_in_currency >= 0}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination
          count={Math.ceil(100 / perPage)} // Assuming max 100 coins per API call
          page={page}
          onChange={(event, value) => setPage(value)}
          color="primary"
        />
      </Box>
    </Box>
  );
}

export default MarketData;