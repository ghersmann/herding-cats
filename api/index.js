// index.js

const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

app.use(express.json());

// Routes
const usersRouter = require('./routes/users');
const eventsRouter = require('./routes/events.js');

app.use('/api/users', usersRouter(pool));
app.use('/api/events', eventsRouter(pool));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
