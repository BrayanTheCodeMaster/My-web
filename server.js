const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Mock database
const users = [];

// Signup endpoint
app.post('/signup', (req, res) => {
    try {
        const { first_name, last_name, username, email, password } = req.body;

        // Basic validation
        if (!first_name || !last_name || !username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required!' });
        }

        // Check if user already exists
        const userExists = users.some(user => user.username === username || user.email === email);
        if (userExists) {
            return res.status(400).json({ message: 'Username or Email already exists!' });
        }

        // Add user to the "database"
        users.push({ first_name, last_name, username, email, password });
        console.log('New user added:', { username, email });
        res.status(200).json({ message: 'User signed up successfully!' });
    } catch (error) {
        console.error('Error in /signup route:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
