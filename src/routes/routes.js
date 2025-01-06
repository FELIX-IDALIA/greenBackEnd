const express = require("express");
const router = express.Router();
const signIn = require("../controllers/SignIn");
const signUp = require("../controllers/SignUp");

// sign In
router.post("/signin", signIn);

// sign Up
router.post("/signup", signUp);

module.exports = router;