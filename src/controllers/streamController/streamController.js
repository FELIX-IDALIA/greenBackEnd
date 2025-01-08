const Stream = require("../../models/Stream");
const User = require("../../models/User");

exports.createStream = async (req, res) => {
    try {
        const { userId, title, description, tags } = req.body;

        // Verify user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found"})
        }

        // Check if user already has an active stream
        const activeStream = await Stream.findOne({
            user: userId,
            isLive: true
        });

        if (activeStream) {
            return res.status(400).json({ error: "User already has an active stream"});
        }

        const stream = new Stream({
            user: userId,
            title,
            description,
            tags,
            isLive: true
        });

        await stream.save();
        await stream.populate("user", "username email");

        res.status(201).json(await stream.getStreamInfo());

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get active streams
exports.getActiveStreams = async (req, res) => {
    try {
        const streams = await Stream.find({ isLive: true })
            .populate("user", "username email")
            .sort("-startTime");
        
        const streamInfo = await Promise.all(
            streams.map(stream => stream.getStreamInfo())
        );

        res.json(streamInfo);

    } catch (error) {
        res.status(500).json( { error: error.message });
    }
};
