const User = require('../models/User');
const argon2 = require("argon2");

const SignUp = async (req, res) => {
    try {
        console.log("Received data is:", req.body); // Debug: Incoming data 

        // Hash the password using Argon2
        req.body.password = await argon2.hash(req.body.password);

        const user = new User(req.body);
        console.log("UserPersonalData to save:", user); // Debug: created instance

        await user.save();

        return res.status(201).json({
            message: "Account created successfully!"
        });

    } catch (error) {
        if (error.code === 11000) {
            // Extract duplicate field  and value from the error
            const field  = Object.keys(error.keyPattern)[0];
            const duplicateValue = error.keyValue[field];

            console.error(`Duplicate field error: ${field} = "${duplicateValue}"`);
            return res.status(400).json({
                message: `${field} "${duplicateValue}" is already in use`
            });

        }

        if (error.name === "ValidationError") {
            console.error("Validation error:", error.message);
            return res.status(400).json({
                message: error.message
            });
        }

        console.error("Unexpected error during submission:", error);
        res.status(500).json({
            message: "Internal server error. Please try again later."
        });
    }
};

module.exports = SignUp;