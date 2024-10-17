const express = require('express');
const router = express.Router();

// GET user by either id or email
router.get('/users', async (req, res) => {
  const { id, email } = req.query; // Destructure both id and email from query parameters
  console.log('Request to find user with:', id ? `ID: ${id}` : `Email: ${email}`);

  try {
    let user;

    // Query by id if id is provided, otherwise query by email
    if (id) {
      user = await req.db.collection('users').findOne({ id });
    } else if (email) {
      user = await req.db.collection('users').findOne({ email });
    } else {
      return res.status(400).json({ message: 'Please provide either an ID or an email' });
    }

    console.log('User found in DB:', user);

    if (user) {
      res.json(user); // Return user data if found
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST create a new user
router.post('/users', async (req, res) => {
  let collection = await req.db.collection('users')
  let newUser = req.body; // Get the new user data from the request body
  if (newUser._id) {
    delete newUser._id;
  }
  newUser.date = new Date();

  try {
    let result = await collection.insertOne(newUser); // Insert the new user into the 'users' collection
    res.send(result).status(204);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(400).json({ error: 'Failed to create user' });
  }
});

// PUT update userData
router.put('/users', async (req, res) => {
  const { id } = req.query; // Get user ID from query parameters
  let userData = req.body;   // Get updated user data from the request body
  console.log('PUT request to update user with ID:', id);

  try {
    // Remove _id from the userData to prevent modification of the immutable field
    if (userData._id) {
      delete userData._id;
    }

    const updatedUser = await req.db.collection('users').updateOne(
      { id },  // Querying with the user ID
      { $set: userData }, // Set the new data, excluding _id
    );

     // Check if the update was successful
    if (updatedUser.matchedCount === 0) {
      // No document matched the provided ID
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
     
    if (updatedUser.modifiedCount === 0) {
      // The document was found but no changes were made.
      return res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: userData // Return the updated user directly
    });
  }

      // If matched and modified, return success
      console.log('User updated:', updatedUser);
      return res.status(200).json({
        success: true,
        message: 'Trip updated successfully',
        data: userData // Return the updated user data
      });

  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while updating user',
      error: error.message
    });
  }
});


// DELETE /users - Delete a user by ID
router.delete('/users', async (req, res) => {
  const { id } = req.query; // Get user ID from query parameters
  console.log('DELETE request to remove user with ID:', id);

  try {
    const result = await req.db.collection('users').deleteOne({ id }); // Query with user ID
    if (result) {
      console.log('User deleted:', result);
      res.json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
