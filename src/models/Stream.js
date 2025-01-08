const mongoose = require("mongoose");

// Modified Stream Schema with user reference
const streamSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }, 
    title: {
        type: String,
        required: true
    }, 
    isLive: {
        type: Boolean,
        default: false
    }, 
    startTime: {
        type: Data,
        default: Date.now
    },
    endTime: {
        type: Date
    },
    viewers: {
        type: Number,
        default: 0
    }, 
    description: String,
    tags: [String]
}, { timestamps: true });

// Add methods to the Stream schema
streamSchema.methods.getStreamInfo = async function() {
    await this.populate("user", "username email");
    return {
        id: this._id,
        title: this.title,
        streamer: this.user.username,
        isLive: this.isLive,
        viewers: this.viewers
    };
};

const Stream = mongoose.model("Stream", streamSchema);

module.exports = Stream;