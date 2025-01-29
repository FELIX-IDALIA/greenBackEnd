const User = require("../models/User");

const profile = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("email name"); // Assuming "name" exists
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    }  catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
}

module.exports = profile;