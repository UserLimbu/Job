const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const path = require('path');
const dburl = require('./url'); // Adjust this path if needed

const client = new MongoClient(dburl);
const dbname = 'jagir';
const app = express();
const port = 3000;

app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON request bodies

// Function to register user details in MongoDB
const registerDetail = async (collectionName, value) => {
  try {
    await client.connect();
    console.log(`Connected to ${dbname} database.`);

    const db = client.db(dbname);
    const collection = db.collection(collectionName);

    const add = await collection.insertOne(value);
    console.log(`Document was inserted with the id: ${add.insertedId}`);
  } catch (err) {
    console.error(`Error Occured: ${err}`);
    throw err;
  } finally {
    await client.close();
  }
};

// Handle form submission
app.post('/register', async (req, res) => {
  const { userType, name, email, password } = req.body;

  if (!userType || !name || !email || !password) {
    return res.status(400).send('Please, fill up the form properly');
  }

  const collection = 'register_data';
  const value = { userType, name, email, password };

  try {
    await registerDetail(collection, value);
    res.status(200).json({ message: 'Entry added successfully', redirectTo: '/register' });
  } catch (error) {
    res.status(500).send('Failed to add entry');
  }
});

// Serve the register page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'register.html'));
});

// Serve the login page
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
