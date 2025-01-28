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

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Schema
const Money = require('./money.model');

// Time-gate middleware - apply to ALL routes except /404 and /admin12345
app.use((req, res, next) => {
  if (req.path === '/404' || req.path === '/admin12345') {
    return next();
  }

  const launchDate = new Date('2025-01-28T23:55:00+07:00');
  const now = new Date();
  
  if (now < launchDate) {
    return res.redirect('/404');
  }
  
  next();
});

// 404 route MUST be before static files
app.get('/404', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', '404.html'));
});

// Static files after middleware but before routes
app.use(express.static(path.join(__dirname, '../frontend')));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

app.post('/api/money', async (req, res) => {
    try {
      const { name, lucky } = req.body;
      const money = new Money({ name, lucky });
      await money.save();
      res.status(201).json({ message: 'Sent!' });
    } catch (error) {
      res.status(500).json({ error: 'Error!!!' });
    }
});

app.get('/admin12345', async (req, res) => {
  try {
    const money = await Money.find();
    res.send(money);
  } catch (error) {
    res.status(500).json({ error: 'Error!!!' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});