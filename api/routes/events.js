// routes/events.js

const express = require('express');

const eventsRouter = (pool) => {
  const router = express.Router();

  router.get('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query('SELECT * FROM events WHERE id = $1', [id]);
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });

  return router;
};

module.exports = eventsRouter;
