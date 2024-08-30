const express = require('express')
const bodyparser = require('body-parser')
const bcrypt = require('bcryptjs')
const cors = require('cors')

const app = express()
const PORT = 5000
const users = {} //Storage

app.use(cors())
app.use(bodyparser.json())

app.post('/api/register', async (req, res) => {

    try {
        
        const { name, email, password } = req.body;
        
        // Check if email already exists
        if (users[email]) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Store user information in the in-memory object
        users[email] = {
        name: name,
        email: email,
        password: hashedPassword
    };
    
    // Respond with a success message
    res.status(201).json({ message: 'User registered successfully' });
    
    } catch (error) {
        console.log('Server error - ', error);
        res.status(500).json({ message: 'Server error.' })
    }
});

// Login Endpoint
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email exists
        if (!users[email]) {
            return res.status(400).json({ field: 'email', message: 'Invalid email or password' });
        }

        // Check if password matches
        const isMatch = await bcrypt.compare(password, users[email].password);
        if (!isMatch) {
            return res.status(400).json({ field: 'password', message: 'Invalid email or password' });
        }

         // Respond with a success message and user information
         res.status(200).json({ 
            message: 'Login successful', 
            name: users[email].name 
        });
        
    } catch (error) {
        console.log('Server error - ', error);
        res.status(500).json({ message: 'Server error' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on PORT - http://localhost:${PORT}`);
})
