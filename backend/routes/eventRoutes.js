const express = require('express');
const router = express.Router();

// GET /events/ids - Get only the trip IDs
router.get('/events/ids', async (req, res) => {
  try {
    console.log('Request to get all tripIds')
    const tripIds = await req.db.collection('events').find({}, { projection: { id: 1, _id: 0 } }).toArray(); // Fetch only the 'id' field
    const ids = tripIds.map(trip => trip.id); // Extract the IDs into an array
    res.json(ids);
  } catch (error) {
    console.error('Error fetching trip IDs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /events - Get a trip by ID
router.get('/events', async (req, res) => {
  const { id } = req.query;
  console.log('Request to find trip with ID:', id);

  try {
    const trip = await req.db.collection('events').findOne({ id }); // Query MongoDB for the trip
    console.log('Trip found in DB:', trip);

    if (trip) {
      res.json(trip);
    } else {
      res.status(404).json({ message: 'Trip not found' });
    }
  } catch (error) {
    console.error('Error fetching trip:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /events - Create a new trip
router.post('/events', async (req, res) => {
  let collection = await req.db.collection("events");
  let tripData = req.body;
  if (tripData._id) {
    delete tripData._id;
  }
  tripData.date = new Date();
  console.log('POST request for new trip: ', tripData.id)
  
  try {
    let result = await collection.insertOne(tripData);
    res.send(result).status(204);
    console.log(`A document was inserted with the _id: ${result.insertedId}`)
  } catch (error) {
    console.error('Error creating trip:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// PUT /events - Update a trip by ID
router.put('/events', async (req, res) => {
  const { id } = req.query; // Get trip ID from query parameters
  let tripData = req.body; // Get updated trip data from the request body
  console.log('PUT request to update trip with ID:', id);
  try {
    // Remove _id from the tripData to prevent modification of the immutable field
    if (tripData._id) {
      delete tripData._id;
    }

    const updatedTrip = await req.db.collection('events').updateOne(
      { id: id }, // Querying with string ID
      { $set: tripData },
    );

    // Check if the update was successful
    if (updatedTrip.matchedCount === 0) {
      // No document matched the provided ID
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    if (updatedTrip.modifiedCount === 0) {
      // The document was found but no changes were made.
      return res.status(200).json({
        success: true,
        message: 'No changes made to the trip',
        data: tripData
      });
    }

    // If matched and modified, return success
    console.log('Trip updated:', updatedTrip);
    return res.status(200).json({
      success: true,
      message: 'Trip updated successfully',
      data: tripData // Return the updated trip data
    });

  } catch (error) {
    console.error('Error updating trip:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while updating trip',
      error: error.message
    });
  }
});


// DELETE /events - Delete a trip by ID
router.delete('/events', async (req, res) => {
  const { id } = req.query; // Get trip ID from query parameters
  console.log('DELETE request to remove trip with ID:', id);

  try {
    const result = await req.db.collection('events').deleteOne({ id: id }); // Query with string ID
    if (result) {
      console.log('Trip deleted:', result);
      res.json({ message: 'Trip deleted successfully' });
    } else {
      console.log('Trip not found for deletion');
      res.status(404).json({ message: 'Trip not found' });
    }
  } catch (error) {
    console.error('Error deleting trip:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
