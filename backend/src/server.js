require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
connectDB();

app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'tirex-api' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Tirex API running on port ${PORT}`));

module.exports = app;