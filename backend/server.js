// backend/server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));


// Schema
const Money = require('./money.model');

// Serve static files (index.js, style.css, etc.) from the 'frontend' directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Rendering HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

// Routes
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
  
// PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

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
})