// refresh access Token
const refreshAccessToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(403).json({ message: "Refresh token is required" });
    }

    try {
        // Verify the refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

        // Generate a new access token
        const accessToken = jwt.sign(
            { id: decoded.id, email: decoded.email },
            process.env.JWT_SECRET, 
            { expiresIn: "15m"}

        );

        res.status(200).json({ token: accessToken });
    } catch (error) {
        console.error(error);
        res.status(403).json({ message: "Invalid refresh token "});
    }
};

module.exports = refreshAccessToken;

