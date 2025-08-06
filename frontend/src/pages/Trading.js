import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Switch,
  FormControlLabel,
  Divider,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  AccountBalanceWallet,
  History,
  SwapHoriz,
} from '@mui/icons-material';

function Trading() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedCoin, setSelectedCoin] = useState('bitcoin');
  const [orderType, setOrderType] = useState('market');
  const [tradeType, setTradeType] = useState('buy');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [total, setTotal] = useState('');
  const [isAdvanced, setIsAdvanced] = useState(false);
  const [leverage, setLeverage] = useState(1);
  const [trades, setTrades] = useState([]);
  const [balance, setBalance] = useState({
    usd: 50000,
    btc: 1.2,
    eth: 5.5,
  });

  const coins = [
    { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', price: 47900, image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png' },
    { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', price: 2850, image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png' },
    { id: 'binancecoin', symbol: 'BNB', name: 'BNB', price: 315, image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png' },
  ];

  const selectedCoinData = coins.find(coin => coin.id === selectedCoin);

  useEffect(() => {
    if (amount && selectedCoinData && tradeType === 'buy') {
      if (orderType === 'market') {
        setTotal((parseFloat(amount) * selectedCoinData.price).toFixed(2));
      } else {
        setTotal((parseFloat(amount) * parseFloat(price || selectedCoinData.price)).toFixed(2));
      }
    } else if (amount && selectedCoinData && tradeType === 'sell') {
      if (orderType === 'market') {
        setTotal((parseFloat(amount) * selectedCoinData.price).toFixed(2));
      } else {
        setTotal((parseFloat(amount) * parseFloat(price || selectedCoinData.price)).toFixed(2));
      }
    }
  }, [amount, price, selectedCoinData, orderType, tradeType]);

  const handleTrade = async () => {
    if (!amount || (!price && orderType === 'limit')) {
      return;
    }

    const tradeData = {
      type: tradeType,
      symbol: selectedCoinData.symbol,
      amount: parseFloat(amount),
      price: orderType === 'market' ? selectedCoinData.price : parseFloat(price),
    };

    try {
      const response = await fetch('http://localhost:5000/api/crypto/trade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tradeData),
      });

      const result = await response.json();
      
      if (response.ok) {
        setTrades([result, ...trades]);
        
        // Update balance (mock)
        const newBalance = { ...balance };
        if (tradeType === 'buy') {
          newBalance.usd -= result.total;
          newBalance[selectedCoinData.symbol.toLowerCase()] = (newBalance[selectedCoinData.symbol.toLowerCase()] || 0) + result.amount;
        } else {
          newBalance.usd += result.total;
          newBalance[selectedCoinData.symbol.toLowerCase()] -= result.amount;
        }
        setBalance(newBalance);
        
        // Reset form
        setAmount('');
        setPrice('');
        setTotal('');
      }
    } catch (error) {
      console.error('Trade error:', error);
    }
  };

  const getBalanceForCoin = (symbol) => {
    return balance[symbol.toLowerCase()] || 0;
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(num);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
        Trading
      </Typography>

      <Grid container spacing={3}>
        {/* Trading Panel */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: 'fit-content' }}>
            <CardContent>
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)}>
                  <Tab label="Spot Trading" />
                  <Tab label="Futures" disabled />
                </Tabs>
              </Box>

              {/* Coin Selection */}
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Select Cryptocurrency</InputLabel>
                <Select
                  value={selectedCoin}
                  label="Select Cryptocurrency"
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

              {selectedCoinData && (
                <Box sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                  <Typography variant="h6" fontWeight="bold">
                    ${formatNumber(selectedCoinData.price)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Current {selectedCoinData.symbol} Price
                  </Typography>
                </Box>
              )}

              {/* Buy/Sell Toggle */}
              <Box sx={{ display: 'flex', mb: 2 }}>
                <Button
                  fullWidth
                  variant={tradeType === 'buy' ? 'contained' : 'outlined'}
                  color="success"
                  onClick={() => setTradeType('buy')}
                  sx={{ mr: 1 }}
                >
                  Buy
                </Button>
                <Button
                  fullWidth
                  variant={tradeType === 'sell' ? 'contained' : 'outlined'}
                  color="error"
                  onClick={() => setTradeType('sell')}
                >
                  Sell
                </Button>
              </Box>

              {/* Order Type */}
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Order Type</InputLabel>
                <Select
                  value={orderType}
                  label="Order Type"
                  onChange={(e) => setOrderType(e.target.value)}
                >
                  <MenuItem value="market">Market Order</MenuItem>
                  <MenuItem value="limit">Limit Order</MenuItem>
                </Select>
              </FormControl>

              {/* Amount Input */}
              <TextField
                fullWidth
                label={`Amount (${selectedCoinData?.symbol})`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                type="number"
                sx={{ mb: 2 }}
                helperText={`Available: ${formatNumber(getBalanceForCoin(tradeType === 'buy' ? 'usd' : selectedCoinData?.symbol))} ${tradeType === 'buy' ? 'USD' : selectedCoinData?.symbol}`}
              />

              {/* Price Input (for limit orders) */}
              {orderType === 'limit' && (
                <TextField
                  fullWidth
                  label="Price (USD)"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  type="number"
                  sx={{ mb: 2 }}
                />
              )}

              {/* Total */}
              <TextField
                fullWidth
                label="Total (USD)"
                value={total}
                InputProps={{ readOnly: true }}
                sx={{ mb: 2 }}
              />

              {/* Advanced Options */}
              <FormControlLabel
                control={
                  <Switch
                    checked={isAdvanced}
                    onChange={(e) => setIsAdvanced(e.target.checked)}
                  />
                }
                label="Advanced Options"
                sx={{ mb: 2 }}
              />

              {isAdvanced && (
                <Box sx={{ mb: 2 }}>
                  <Typography gutterBottom>
                    Leverage: {leverage}x
                  </Typography>
                  <Slider
                    value={leverage}
                    onChange={(e, newValue) => setLeverage(newValue)}
                    min={1}
                    max={10}
                    step={1}
                    marks
                    valueLabelDisplay="auto"
                  />
                </Box>
              )}

              {/* Trade Button */}
              <Button
                fullWidth
                variant="contained"
                size="large"
                color={tradeType === 'buy' ? 'success' : 'error'}
                onClick={handleTrade}
                disabled={!amount || (!price && orderType === 'limit')}
                sx={{ mb: 2 }}
              >
                {tradeType === 'buy' ? 'Buy' : 'Sell'} {selectedCoinData?.symbol}
              </Button>

              <Alert severity="info" sx={{ mt: 2 }}>
                This is a demo trading interface. No real trades are executed.
              </Alert>
            </CardContent>
          </Card>
        </Grid>

        {/* Portfolio & History */}
        <Grid item xs={12} lg={8}>
          <Grid container spacing={3}>
            {/* Portfolio Balance */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <AccountBalanceWallet sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Portfolio Balance
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                        <Typography variant="h5" fontWeight="bold" color="primary">
                          ${formatNumber(balance.usd)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          USD Balance
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                        <Typography variant="h5" fontWeight="bold" color="warning.main">
                          {formatNumber(balance.btc)} BTC
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Bitcoin Balance
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                        <Typography variant="h5" fontWeight="bold" color="secondary.main">
                          {formatNumber(balance.eth)} ETH
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Ethereum Balance
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Trade History */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <History sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Recent Trades
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Time</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell>Pair</TableCell>
                          <TableCell align="right">Amount</TableCell>
                          <TableCell align="right">Price</TableCell>
                          <TableCell align="right">Total</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {trades.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} align="center">
                              <Typography color="text.secondary">
                                No trades yet. Start trading to see your history here.
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ) : (
                          trades.map((trade) => (
                            <TableRow key={trade.id}>
                              <TableCell>
                                {new Date(trade.timestamp).toLocaleTimeString()}
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={trade.type.toUpperCase()}
                                  size="small"
                                  color={trade.type === 'buy' ? 'success' : 'error'}
                                  variant="outlined"
                                />
                              </TableCell>
                              <TableCell>{trade.symbol}/USD</TableCell>
                              <TableCell align="right">{formatNumber(trade.amount)}</TableCell>
                              <TableCell align="right">${formatNumber(trade.price)}</TableCell>
                              <TableCell align="right">${formatNumber(trade.total)}</TableCell>
                              <TableCell>
                                <Chip
                                  label={trade.status}
                                  size="small"
                                  color="success"
                                  variant="outlined"
                                />
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Trading;