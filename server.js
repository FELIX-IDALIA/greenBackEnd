//const NodeMediaServer = require("node-media-server");
const connectDB = require('./src/database/Database');
const dotenv = require('dotenv');
const cors = require('cors');
const express = require('express');

// Import the nms instance instead of requiring the module
require("./src/utils/streamHelper");

const useRoutes = require("./src/routes/routes");
const streamRoutes = require("./src/routes/streamRoutes");

const app = express();

// Home routes
const profileRoute = require("./src/routes/profileRoute");

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
app.use("/home", profileRoute); 
app.use("/", streamRoutes);

// Basic route for testing
app.get('/', (req, res) => {
    res.send('Server is running...');
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