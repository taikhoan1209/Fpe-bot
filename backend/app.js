const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const cryptoRoutes = require('./routes/crypto');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', routes);
app.use('/api/crypto', cryptoRoutes);

module.exports = app;
