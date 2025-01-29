const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: "Authentication required" });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.id;    // Payload is (user._id from signIn)
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
}
    

module.exports = authMiddleware;