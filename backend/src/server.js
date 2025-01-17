const express = require('express');
const path = require('path');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
require('@babel/register')({
  presets: ['@babel/preset-env']
});


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Parse incoming JSON data

app.use(express.static(path.join(__dirname, '../dist')))

// MongoDB Connection Setup
const uri = process.env.MONGO_URI; // Use the same URI as you used for MongoClient in your test

let db; // This will store the reference to the connected database

async function connectToDB() {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log('MongoDB connected successfully! Yay!');
    db = client.db('herding-cats'); // Specify the database you are using
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}

// Call the function to connect to the database
connectToDB();

// Import routes and pass the `db` to route handlers
const eventRoutes = require('../routes/eventRoutes');
const userRoutes = require('../routes/userRoutes');

// Use the routes and pass the database as a parameter
app.use((req, res, next) => {
  req.db = db; // Attach the database to the request object
  next();
});

app.use('/api', eventRoutes); // All routes are prefixed with '/api'
app.use('/api', userRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;