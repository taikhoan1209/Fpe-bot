import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';

function RiskManagement() {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    fetch('/api/risk/dashboard')
      .then(res => res.json())
      .then(setDashboard);
  }, []);

  return (
    <div>
      <Typography variant="h4">Risk Dashboard</Typography>
      {dashboard && (
        <div>
          <p>Total Trades: {dashboard.totalTrades}</p>
          <p>Win Rate: {Math.round(dashboard.winRate * 100)}%</p>
        </div>
      )}
    </div>
  );
}

export default RiskManagement;
