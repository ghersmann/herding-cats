import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { pathname, id } = req.query; // Extract pathname and id from query params
  const filePath = path.join(process.cwd(), 'database.json');

  console.log('-----------------');
  console.log(Date().toString());
  console.log('Start of db.js Received request: ', req.method, pathname, id);

  // Read the database file
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Error reading the database file' });
      return;
    }

    const db = JSON.parse(data);

    // Handle GET requests
    if (req.method === 'GET') {
      if (pathname === 'events') {
        if (id) {
          const event = db.events.find(event => event.id === id);
          if (event) {
            res.status(200).json(event);
          } else {
            res.status(404).json({ error: 'Event not found' });
          }
        } else {
          res.status(200).json(db.events);
        }
      } else if (pathname === 'users') {
        res.status(200).json(db.users);
      } else {
        res.status(404).json({ error: 'Invalid pathname' });
      }
    }

    //Handle POST requests
    else if (req.method === 'POST') {
      console.log('POST request received');
      
      try {
        if (!req.body || typeof req.body !== 'object') {
          return res.status(400).json({ error: 'Invalid or missing JSON body' });
        }
    
        const newEvent = req.body;
        console.log('New Event:', newEvent);
    
        if (pathname === 'events') {
          db.events.push(newEvent); // Add the new event to the database
    
          // Write the updated data back to the file
          fs.writeFile(filePath, JSON.stringify(db, null, 2), (writeErr) => {
            if (writeErr) {
              throw new Error('Failed to write to database file');
            }
            res.status(201).json(newEvent); // Respond with the newly created event
          });
        } else {
          res.status(404).json({ error: 'Invalid pathname' });
        }
    
      } catch (error) {
        console.error('POST request error:', error);
        res.status(500).json({ error: 'Server error occurred' });
      }
    }
    

    // Handle PUT requests for both events and users
    else if (req.method === 'PUT') {
      console.log('PUT request received');
      console.log('Query params:', req.query);

      if (id) {
        let updatedItem;
        let itemIndex;

        if (pathname.toLowerCase() === 'events') {
          updatedItem = req.body;
          itemIndex = db.events.findIndex(event => event.id === id.toString());

          if (itemIndex === -1) {
            res.status(404).json({ error: 'Event not found' });
            return;
          }

          // Update the event data
          db.events[itemIndex] = updatedItem;

        } else if (pathname.toLowerCase() === 'users') {
          updatedItem = req.body;
          itemIndex = db.users.findIndex(user => user.id === id);

          if (itemIndex === -1) {
            res.status(404).json({ error: 'User not found' });
            return;
          }

          // Update the user data
          db.users[itemIndex] = updatedItem;
        } else {
          res.status(404).json({ error: 'Invalid pathname' });
          return;
        }

        // Write the updated data back to the file
        fs.writeFile(filePath, JSON.stringify(db, null, 2), (writeErr) => {
          if (writeErr) {
            res.status(500).json({ error: 'Error writing to the database file' });
            return;
          }
          res.status(200).json(updatedItem); // Respond with the updated item
        });

      } else {
        res.status(404).json({ error: 'Missing ID in query parameters' });
      }
    }

    // Handle DELETE requests to delete events or users
    else if (req.method === 'DELETE') {
      if (pathname === 'events' && id) {
        const eventIndex = db.events.findIndex(event => event.id === id);

        if (eventIndex === -1) {
          res.status(404).json({ error: 'Event not found' });
          return;
        }

        // Remove the event from the database
        db.events.splice(eventIndex, 1);

        // Write the updated data back to the file
        fs.writeFile(filePath, JSON.stringify(db, null, 2), (writeErr) => {
          if (writeErr) {
            res.status(500).json({ error: 'Error writing to the database file' });
            return;
          }
          res.status(200).json({ message: 'Event deleted successfully' });
        });
      } else if (pathname === 'users' && id) {
        const userIndex = db.users.findIndex(user => user.id === id);

        if (userIndex === -1) {
          res.status(404).json({ error: 'User not found' });
          return;
        }

        // Remove the user from the database
        db.users.splice(userIndex, 1);

        // Write the updated data back to the file
        fs.writeFile(filePath, JSON.stringify(db, null, 2), (writeErr) => {
          if (writeErr) {
            res.status(500).json({ error: 'Error writing to the database file' });
            return;
          }
          res.status(200).json({ message: 'User deleted successfully' });
        });
      } else {
        res.status(404).json({ error: 'Invalid pathname or missing ID' });
      }
    }

    // Handle unsupported methods
    else {
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
  });
}
