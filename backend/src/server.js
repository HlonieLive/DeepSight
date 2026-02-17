const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require("socket.io");
const monitor = require('./monitor'); // Assuming monitor.js exports a singleton instance

const port = process.env.PORT || 3001;

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins for now
        methods: ["GET", "POST"]
    }
});

// Endpoint for static system info
app.get('/api/info', async (req, res) => {
    try {
        const info = await monitor.getStaticData();
        res.json(info);
    } catch (err) {
        console.error("Error retrieving static info:", err);
        res.status(500).json({ error: "Failed to retrieve static info" });
    }
});

// Endpoint for forced refresh (optional)
app.get('/api/refresh', async (req, res) => {
    try {
        const data = await monitor.getFormattedData();
        res.json(data);
    } catch (err) {
        console.error("Error retrieving dynamic data:", err);
        res.status(500).json({ error: "Failed to retrieve dynamic data" });
    }
});

io.on('connection', (socket) => {
    console.log('A user connected');

    // Send initial static data on connection
    monitor.getStaticData().then((info) => {
        socket.emit('system-info', info);
    }).catch(err => console.error("Error sending initial static info:", err));

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Broadcast dynamic data every 2 seconds
setInterval(async () => {
    try {
        const dynamicData = await monitor.getFormattedData();
        if (dynamicData) {
            console.log("--- System Update ---");
            console.log(JSON.stringify(dynamicData, null, 2));
            io.emit('system-update', dynamicData);
        }
    } catch (err) {
        console.error("Error retrieving/broadcasting dynamic data:", err);
    }
}, 2000);

server.listen(port, () => {
    console.log(`DeepSight Backend Server listening on port ${port}`);
});
