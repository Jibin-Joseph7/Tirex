require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');
const accountRoutes = require('./src/routes/accountRoutes');
const transactionRoutes = require('./src//routes/transactionRoutes');
const budgetRoutes = require('./src/routes/budgetRoutes');
const investmentRoutes = require('./src/routes/investmentRoutes');


const app = express();
connectDB();

app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'tirex-api' }));
app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/investments', investmentRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Tirex API running on port ${PORT}`));

module.exports = app;