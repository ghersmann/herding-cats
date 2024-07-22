import express from 'express';
import db from '../db/db';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

app.get('/users', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM users');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/events/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM events WHERE id = $1', [id]);
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default app;
