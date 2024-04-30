const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const secretKey = 'Jenesepa426384-Jenesepa426384-Jenesepa426384-';

const users = [
    { id: 1, username: 'user1', password: 'password1', role: 'USER' },
    { id: 2, username: 'admin', password: 'adminpassword', role: 'ADMIN' }
];

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

app.post('/api/login', express.json(), (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign({ user }, secretKey, { expiresIn: '1h' });

    res.json({ token });
});

app.get('/api/common', verifyToken, (req, res) => {
    res.json({ message: 'Common endpoint accessed', user: req.user });
});

app.get('/api/user', verifyToken, (req, res) => {
    if (req.user.role !== 'USER') {
        return res.status(403).json({ message: 'Forbidden' });
    }
    res.json({ message: 'User endpoint accessed', user: req.user });
});

app.get('/api/admin', verifyToken, (req, res) => {
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Forbidden' });
    }
    res.json({ message: 'Admin endpoint accessed', user: req.user });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
