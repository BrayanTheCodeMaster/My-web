app.post('/signup', (req, res) => {
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
    res.status(200).json({ message: 'User signed up successfully!' });
});
