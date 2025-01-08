const Stream = require("../models/Stream");

module.exports = (io) => {
    io.on("connection", (socket) => {
    socket.on("startStream", async ({ userId, streamId }) => {
        try {
            const stream = await Stream.findById(streamId);
            if (!stream || stream.user.toString() !== userId) {
                socket.emit("error", "Invalid stream");
                return;
            }

            socket.join(streamId);
            io.emit("streamStarted", await stream.getStreamInfo());
        } catch (error) {
            socket.emit("error", error.message);
        }
    });

    socket.on("streamData", async ({ streamId, userId, chunk }) => {
        try {
            const stream = await Stream.findById(streamId);
            if (!stream || stream.user.toString() !== userId) {
                return;
            }
            socket.to(streamId).emit("streamUpdate", chunk);
        } catch (error) {
            socket.emit("error", error.message);
        }
    });

    socket.on("joinStream", async (streamId) => {
        try {
            const stream = await Stream.findById(streamId);
            if (!stream || !stream.isLive) {
                socket.emit("error", "stream not available");
                return;
            }

            socket.join(streamId);
            await Stream.findByIdAndUpdate(streamId, { $inc: { viewers: 1}});
            io.to(streamId).emit("viewerUpdate", stream.viewers + 1);

        } catch (error) {
            socket.emit("error", error.message);
        }
    });
});
}

