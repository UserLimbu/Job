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

const findUser = async (email, password, userType) => {
  try {
    await client.connect();
    console.log(`Connected to ${dbname} database.`);
    
    const db = client.db(dbname);
    const collection = db.collection('register_data');

    // Query based on email, password, and userType
    const user = await collection.findOne({ email, password, userType });
    
    return user;
  } catch (err) {
    console.error("Error occurred:", err);
    throw err;
  } finally {
    await client.close();
  }
};

app.post('/login', async (req, res) => {
  const { email, password, userType } = req.body;

  if (!email || !password || !userType) {
    return res.status(400).json({ error: 'Missing credentials' });
  }

  try {
    const user = await findUser(email, password, userType);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Assuming successful login, you can send user data or a token for authentication
    res.status(200).json({ message: 'Login successful', user });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve the employee.html page
app.get('/employee.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'front', 'employee.html'));
});

// Serve the employer.html page
app.get('/employer.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'front', 'employer.html'));
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
});
