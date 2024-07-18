const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

let data = [
  { id: 1, name: 'Item 1', value: 'Value 1' },
  { id: 2, name: 'Item 2', value: 'Value 2' },
];

// Read all items
app.get('/api/data', (req, res) => {
  res.status(200).json(data);
});

// Read a single item by ID
app.get('/api/data/:id', (req, res) => {
  const item = data.find(d => d.id === parseInt(req.params.id));
  if (item) {
    res.status(200).json(item);
  } else {
    res.status(404).json({ message: 'Item not found' });
  }
});

// Create a new item
app.post('/api/data', (req, res) => {
  const newItem = {
    id: data.length + 1,
    name: req.body.name,
    value: req.body.value,
  };
  data.push(newItem);
  res.status(201).json(newItem);
});

// Update an existing item
app.put('/api/data/:id', (req, res) => {
  const item = data.find(d => d.id === parseInt(req.params.id));
  if (item) {
    item.name = req.body.name;
    item.value = req.body.value;
    res.status(200).json(item);
  } else {
    res.status(404).json({ message: 'Item not found' });
  }
});

// Delete an item
app.delete('/api/data/:id', (req, res) => {
  data = data.filter(d => d.id !== parseInt(req.params.id));
  res.status(204).send();
});

module.exports = app;
