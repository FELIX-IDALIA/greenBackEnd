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
        required: true,
        trim: true
    }, 
    description: {
        type: String,
        trim: true
    }, 
    streamKey: {
        type: String,
        unique: true,
        required: true
    },
    isLive: {
        type: Boolean,
        default: false
    },
    startTime: Date,
    endTime: Date,
    viewerCount: {
        type: Number,
        default: 0
    },
    tags:[String],
    thumbnails: String,
    status: {
        type: String,
        enum: ["pending", "live", "ended", "error"],
        default: "pending"
    }
}, { 
    timestamps: true,
    toJSON: { virtuals: true }
});

const Stream = mongoose.model("Stream", streamSchema);

module.exports = Stream;