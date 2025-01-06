const User = require("../models/User");
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const password = encodeURIComponent(process.env.PASS_WD);
const dbUsername = encodeURIComponent(process.env.DB_USERNAME);
const MONGO_URI = `mongodb+srv://${dbUsername}:${password}@practise0.h4clk.mongodb.net/Green?retryWrites=true&w=majority&appName=Practise0`;

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(MONGO_URI);
        await User.createIndexes();
        console.log("Database connected successfully:", connection.connection.host);

    } catch (error) {
        console.error("Failed to connect to the database:", error);
        process.exit(1)  // Exit the process an error occurs
    }
};

module.exports = connectDB;