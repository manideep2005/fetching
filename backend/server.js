const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5503;

app.use(cors());
app.use(bodyParser.json());

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
    console.log('Connected to MySQL Database');
  }
});

// Insert User Data
app.post('/add-user', (req, res) => {
  const { unique_id, name, age, email, phone, address } = req.body;

  const query = 'INSERT INTO users (unique_id, name, age, email, phone, address) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(query, [unique_id, name, age, email, phone, address], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ message: 'User added successfully' });
  });
});

// Fetch User Data by Unique ID
app.get('/get-user/:unique_id', (req, res) => {
  const unique_id = req.params.unique_id;

  db.query('SELECT * FROM users WHERE unique_id = ?', [unique_id], (err, result) => {
    if (err || result.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result[0]);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
