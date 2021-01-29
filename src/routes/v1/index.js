const express = require("express");
const acronymRoute = require("./acronym.route");

const router = express.Router();

router.use("/acronym", acronymRoute);

module.exports = router;
