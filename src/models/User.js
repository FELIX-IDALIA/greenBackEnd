const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{ type: String, required: true },
    username:{ type: String, trim: true, lowercase: true, required: true },
    email:{ type: String, trim: true, lowercase: true, required: true },
    password:{ type: String, required: true }
}, { timestamps: true }
);

// Create a compound index for all unque fields
userSchema.index({ username: 1}, { unique: true });
userSchema.index({ email: 1 }, { unique: true });

const User = mongoose.model("User", userSchema);

module.exports = User;