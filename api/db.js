/* const db = require('../db.json');

export default function handler(req, res) {
  res.status(200).json(db);
}
 */

// api/db.js

import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  // Define the path to your db.json file
  const filePath = path.join(process.cwd(), '../db.json');
  
  // Read the file asynchronously
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Error reading the database file' });
      return;
    }

    // Send the JSON response
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(JSON.parse(data));
  });
}
