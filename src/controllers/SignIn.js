const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/User");
const argon2 = require("argon2");

// Load environment variables
dotenv.config();

const SignIn = async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log("Data received:", req.body);
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found! Please Sign Up to continue"});
        }

        // Verify password
        const isMatch = await argon2.verify(user.password, password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials"});
        }

        // Generate a JWT token access token (short-lived)
        const accessToken = jwt.sign(
            { id: user._id, email: user.email }, // Payload
            process.env.JWT_SECRET,              // Secret key
            { expiresIn: "15m"}                  
        );

        // Generate a JWT refresh token (long-lived)
        const refreshToken = jwt.sign(
            { id: user._id, email: user.email }, // Payload
            process.env.JWT_SECRET,             // Secret key
            { expiresIn: "7d"}                  // Longer expiration for refresh token
        );

        // Store the refresh token in an HTTP-only cookie or in the database
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true, // This prevents client-side Javascript from accessing the token
            secure: process.env.NODE_ENV === "production", // Set to true in production
            maxAge: 7 * 24 * 60 * 60 * 1000, // Expiration date of the refresh token
        })
        res.status(200).json({ token: accessToken, message: "Login successful!"});
        //res.status(200).json({ message: "User Found! LogIn will be successful."});

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error"});

    }
};



module.exports =  SignIn;