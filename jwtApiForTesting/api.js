// this node api is only for testing purposes
// is not a real/production api
// the idea is 
const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
// Jamecho-The-Dog-426384 -> B64
const secretKey = 'SmFtZWNoby1UaGUtRG9nLTQyNjM4NA==';


// hardcoded database
const users = [
    { id: 1, username: 'user1', password: 'password1', role: 'USER' },
    { id: 2, username: 'admin', password: 'adminpassword', role: 'ADMIN' }
];

// middleware to validate the jwt token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        req.user = decoded.user;
        next();
    });
};

// login endpoing, send in the body the username and pwrt:
// {
//     "username": "user",
//     "password": "password1"
// }
// the jwt token generated, will have to be sent as a Bearer token
app.post('/api/login', express.json(), (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign({ user }, secretKey, { expiresIn: '1h' });

    res.json({ token });
});

// general endpoint
app.get('/api/common', verifyToken, (req, res) => {
    res.json({ message: 'endpoint /common accessed', user: req.user });
});

// user endpoint
app.get('/api/user', verifyToken, (req, res) => {
    if (req.user.role !== 'USER') {
        return res.status(403).json({ message: 'Forbidden' });
    }
    res.json({ message: 'endpoint /user accessed', user: req.user });
});

// admin endpoint
app.get('/api/admin', verifyToken, (req, res) => {
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Forbidden' });
    }
    res.json({ message: 'endpoint /admin accessed', user: req.user });
});

// server up!
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server up on port ${PORT}`);
});
