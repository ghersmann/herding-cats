const express = require('express');
const path = require('path');
const {
  MongoClient
} = require('mongodb');
const cors = require('cors');
require('dotenv').config();
require('@babel/register')({
  presets: ['@babel/preset-env']
});
const app = express();
const PORT = process.env.PORT || 5001;
app.use(cors());
app.use(express.json()); // Parse incoming JSON data

// MongoDB Connection Setup
const uri = process.env.MONGO_URI;
async function startServer() {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log('MongoDB connected successfully! Yay!');
    const db = client.db('herding-cats');

    // Attach DB to all incoming requests
    app.use((req, res, next) => {
      req.db = db;
      next();
    });

    // Mount routes AFTER DB is ready
    const eventRoutes = require('../routes/eventRoutes');
    const userRoutes = require('../routes/userRoutes');
    app.use('/api', eventRoutes);
    app.use('/api', userRoutes);

    // Serve frontend
    app.use(express.static(path.join(__dirname, '../dist')));

    // Catch-all (must come LAST)
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../dist/index.html'));
    });
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Error starting server:', err);
  }
}
startServer(); // Call the startup