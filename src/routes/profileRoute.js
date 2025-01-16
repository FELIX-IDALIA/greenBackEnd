const express = require("express");
const router = express.Router();
const profile = require("../homeBack/profile");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/profile", authMiddleware, profile);

module.exports = router;