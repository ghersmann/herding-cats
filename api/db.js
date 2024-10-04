import { promises as fs } from 'fs';
import path from 'path';

// Helper to parse the body using the native stream approach
async function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';

    // Collect data from the request stream
    req.on('data', chunk => {
      body += chunk.toString();  // Convert binary data to string
    });

    // Once the entire body has been received
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));  // Parse and resolve the JSON
      } catch (err) {
        reject({ error: 'Invalid JSON' });  // Reject if parsing fails
      }
    });

    // Handle any errors during the data stream
    req.on('error', (err) => {
      reject({ error: 'Error reading body' });
    });
  });
}

export default async function handler(req, res) {
  const { pathname, id } = req.query;
  const filePath = path.join(process.cwd(), 'database.json');

  console.log('-----------------');
  console.log(Date().toString());
  console.log('Start of db.js Received request: ', req.method, pathname, id);

  try {
    // Read the database file asynchronously
    const data = await fs.readFile(filePath, 'utf8');
    const db = JSON.parse(data);

    // Handle GET requests
    if (req.method === 'GET') {
      if (pathname === 'events') {
        if (id) {
          const event = db.events.find(event => event.id === id);
          if (event) {
            return res.status(200).json(event);
          } else {
            return res.status(404).json({ error: 'Event not found' });
          }
        } else {
          return res.status(200).json(db.events);
        }
      } else if (pathname === 'users') {
        return res.status(200).json(db.users);
      } else {
        return res.status(404).json({ error: 'Invalid pathname' });
      }
    }

    // Handle POST requests
    else if (req.method === 'POST') {
      console.log('POST request received');

      const newEvent = await parseBody(req);  // Parsing the body

      if (!newEvent || typeof newEvent !== 'object') {
        return res.status(400).json({ error: 'Invalid or missing JSON body' });
      }

      if (pathname === 'events') {
        db.events.push(newEvent);

        // Write the updated data back to the file
        await fs.writeFile(filePath, JSON.stringify(db, null, 2));
        return res.status(201).json(newEvent);
      } else {
        return res.status(404).json({ error: 'Invalid pathname' });
      }
    }

    // Handle PUT requests
    else if (req.method === 'PUT') {
      console.log('PUT request received');

      if (!id) {
        return res.status(404).json({ error: 'Missing ID in query parameters' });
      }

      const updatedItem = await parseBody(req);  // Parsing the body

      let itemIndex;

      if (pathname === 'events') {
        itemIndex = db.events.findIndex(event => event.id === id.toString());

        if (itemIndex === -1) {
          return res.status(404).json({ error: 'Event not found' });
        }

        db.events[itemIndex] = updatedItem;
      } else if (pathname === 'users') {
        itemIndex = db.users.findIndex(user => user.id === id);

        if (itemIndex === -1) {
          return res.status(404).json({ error: 'User not found' });
        }

        db.users[itemIndex] = updatedItem;
      } else {
        return res.status(404).json({ error: 'Invalid pathname' });
      }

      // Write the updated data back to the file
      await fs.writeFile(filePath, JSON.stringify(db, null, 2));
      return res.status(200).json(updatedItem);
    }

    // Handle DELETE requests
    else if (req.method === 'DELETE') {
      if (!id) {
        return res.status(404).json({ error: 'Missing ID in query parameters' });
      }

      if (pathname === 'events') {
        const eventIndex = db.events.findIndex(event => event.id === id);
        if (eventIndex === -1) {
          return res.status(404).json({ error: 'Event not found' });
        }
        db.events.splice(eventIndex, 1);
      } else if (pathname === 'users') {
        const userIndex = db.users.findIndex(user => user.id === id);
        if (userIndex === -1) {
          return res.status(404).json({ error: 'User not found' });
        }
        db.users.splice(userIndex, 1);
      } else {
        return res.status(404).json({ error: 'Invalid pathname' });
      }

      // Write the updated data back to the file
      await fs.writeFile(filePath, JSON.stringify(db, null, 2));
      return res.status(200).json({ message: `${pathname} deleted successfully` });
    }

    // Handle unsupported methods
    else {
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error occurred' });
  }
}
