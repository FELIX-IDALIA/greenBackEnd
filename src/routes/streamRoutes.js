const { createStream, getActiveStreams } = require("../controllers/streamController/streamController");
const express = require("express");

const router = express.Router();

// Express route streams management
router.post("/streams", createStream);
router.get("/streams", getActiveStreams);

module.exports = router;

