const express = require("express");
const router = express.Router();
const signIn = require("../controllers/SignIn");
const signUp = require("../controllers/SignUp");

// sign In
router.post("/SignIn", signIn);

// sign Up
router.post("/SignUp", signUp);

module.exports = router;