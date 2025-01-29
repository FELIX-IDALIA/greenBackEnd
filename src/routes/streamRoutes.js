const { createStream, startStream } = require("../controllers/streamController/streamController");
const authMiddleware = require("../middleware/authMiddleware");
const express = require("express");

const router = express.Router();

// Express route streams management
router.post("/home/api/create/stream", authMiddleware, createStream);
router.post("/home/api/start/stream", authMiddleware, startStream);


module.exports = router;

