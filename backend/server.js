// backend/server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = express();

// Middleware
app.use(cors({
  origin: ['https://lixi2025.onrender.com', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Time-gate middleware
const timeGateMiddleware = (req, res, next) => {
  // Create date object for GMT+7
  const bangkokTime = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }));
  
  // Set launch time to January 28, 2025, 23:55:00 GMT+7
  const launchTime = new Date('2025-01-28T23:55:00+07:00');

  if (bangkokTime < launchTime) {
    // Before launch time - redirect to 404
    return res.sendFile(path.join(__dirname, '../frontend', '404.html'));
  }
  next();
};

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Schema
const Money = require('./money.model');

// Serve static files (index.js, style.css, etc.) from the 'frontend' directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Apply time-gate middleware to main route only
app.get('/', timeGateMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

// Routes
app.post('/api/money', timeGateMiddleware, async (req, res) => {
    try {
      const { name, lucky } = req.body;
      const money = new Money({ name, lucky });
      await money.save();
      res.status(201).json({ message: 'Sent!' });
    } catch (error) {
      res.status(500).json({ error: 'Error!!!' });
    }
});

// Admin route - not time-gated
app.get('/admin12345', async (req, res) => {
  try {
    const money = await Money.find();
    res.send(money);
  } catch (error) {
    res.status(500).json({ error: 'Error!!!' });
  }
});

app.get('/404', (req, res) =>{
  res.sendFile(path.join(__dirname, '../frontend', '404.html'));
});

// PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});