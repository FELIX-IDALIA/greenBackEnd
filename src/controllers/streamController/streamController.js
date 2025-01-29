const Stream = require("../../models/Stream");
const crypto = require("crypto");
const { validateStream } = require("../../utils/validators");

exports.createStream = async (req, res) => {
    try {

        const { error } = validateStream(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message});
        }

        const { title, description, tags } = req.body;
        const streamKey = crypto.randomBytes(20).toString("hex");

        const stream = new Stream({
            user: req.userId,
            title,
            description,
            tags,
            streamKey,
            status: "pending"
        });

        await stream.save();

        res.status(201).json({
            stream: await stream.populate("user", "username email"),
            rtmpUrl: `rtmp://${process.env.STREAM_SERVER}/live`,
            streamKey
        });
    } catch (error) {
        console.error("Stream creation error:", error);
        res.status(500).json({ error: "Failed to create stream" });
    }
};

exports.startStream = async (req, res) => {
    try {
        const stream = await Stream.findById(req.params.id);

        if (!stream) {
            return res.status(404).json({ error: "Stream not found" });
        }

        if (stream.user.toString() !== req.userId.toString()) {
            return res.status(403).json({ error: "Unauthorized" });
        }

        if (stream.isLive) {
            return res.status(400).json({ error: "Stream is already live"});
        }

        stream.isLive = true;
        stream.status = "live";
        stream.startTime = new Date();
        await stream.save();

        res.json({ message: "Stream started successfully", stream});
    } catch (error) {
        console.error("Start stream error:", error);
        res.status(500).json({ error: "Failed to start stream" });
    }
};