const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const authorization = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Get token from header

    if (!token) {
        return res.status(401).json({ message: "Unauthorized"});
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET); // Verify token
        req.user = decoded; // Attach user info from token to request
        next(); // Allow request to continue
        
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

module.exports = authorization;