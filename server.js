
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

// Mock database
let users = [];

// Signup endpoint
app.post('/signup', (req, res) => {
    const { first_name, last_name, username, email, password } = req.body;
    const newUser = { first_name, last_name, username, email, password };
    users.push(newUser);
    res.status(200).json({ message: 'User signed up successfully!' });
});

// Start server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
