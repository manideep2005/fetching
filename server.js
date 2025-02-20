require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5504;

app.use(cors());
app.use(express.json());

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Gmanideep1802$',
  database: 'userdb'
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

// Route to add user
app.post('/add-user', (req, res) => {
  const { unique_id, name, age, email, phone, address } = req.body;
  if (!unique_id || !name || !age || !email || !phone || !address) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const query = 'INSERT INTO users (unique_id, name, age, email, phone, address) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(query, [unique_id, name, age, email, phone, address], (err) => {
    if (err) {
      console.error('Error inserting user:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ message: 'User added successfully!' });
  });
});

// Route to fetch user details
app.get('/get-user/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM users WHERE unique_id = ?';

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error fetching user:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result[0]);
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
