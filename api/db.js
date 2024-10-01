import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { pathname, id } = req.query; // Extract pathname and id from query params
  const filePath = path.join(process.cwd(), 'database.json');
  
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Error reading the database file' });
      return;
    }

    const db = JSON.parse(data);
    
    // Handle fetching specific data based on pathname
    if (pathname === 'events') {
      if (id) {
        // If an ID is provided, find the specific event
        const event = db.events.find(event => event.id === id);
        if (event) {
          res.status(200).json(event);
        } else {
          res.status(404).json({ error: 'Event not found' });
        }
      } else {
        // If no ID is provided, return all events
        res.status(200).json(db.events);
      }
    } else if (pathname === 'users') {
      // Fetch all users
      res.status(200).json(db.users);
    } else {
      res.status(404).json({ error: 'Invalid pathname' });
    }
  });
}

