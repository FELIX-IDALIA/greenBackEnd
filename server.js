const connectDB = require('./src/database/Database');
const dotenv = require('dotenv');
const cors = require('cors');
const express = require('express');

const http = require("http");
const { Server } = require("socket.io");

const useRoutes = require("./src/routes/routes");
const streamRoutes = require("./src/routes/streamRoutes");
const streamSocket = require("./src/sockets/streamSocket");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Load env vars first
dotenv.config();

// Verify environment variables are loaded
if (!process.env.PASS_WD) {
    console.error("Database password not found in environment variables");
    process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json());
app.use("/Account", useRoutes);
app.use("/api", streamRoutes);

// Socket.io integration
streamSocket(io);

// Basic route for testing
app.get('/', (req, res) => {
    res.send('Server is running');
});

// Connect to database and start server
const startServer = async () => {
    try {
        await connectDB();
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}...`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();