const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Read the local JSON file
const dataFilePath = path.join(__dirname, 'db.json');
const rawData = fs.readFileSync(dataFilePath);
const data = JSON.parse(rawData);

// Define the API endpoint
const apiEndpoint = 'https://herding-cats.vercel.app/api/data';

// Function to transfer data
const transferData = async () => {
  for (const item of data) {
    try {
      const response = await axios.post(apiEndpoint, item);
      console.log(`Item added: ${response.data.name}`);
    } catch (error) {
      console.error(`Error adding item: ${error.message}`);
    }
  }
};

// Run the transfer
transferData();
