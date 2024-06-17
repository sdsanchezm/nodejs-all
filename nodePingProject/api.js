const express = require('express');
const app = express();

app.use((req, res, next) => {
    req.visitorIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    next();
});

app.get('/api4/ping1', async (req, res) => {
    const ip = req.visitorIP;
    const ipArray = ip.split(',');
    console.log(`ipArray: ${ipArray}`);
    const ipAddress = req.ip;
    const date1 = new Date();
    date1.setUTCHours(date1.getUTCHours() - 5);
    res.json({
        mainIp: ipArray[0],
        secondaryIp: ipArray[1],
        date: date1,
        yourLocalMachineIp: ipAddress
    });
});

app.get('/api4/ping2', (req, res) => {
    res.json({
        result: "ok",
        data: "ok"
    });
});

app.get('/api4/ping3', (req, res) => {
    res.json({
        test: "ok"
    });
});

const port = 3003;

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});