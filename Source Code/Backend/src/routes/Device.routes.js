const express = require("express");
const router = express.Router();

const deviceControllers = require("../controllers/Device.controllers");

router.post("/add", deviceControllers.addDevice);


module.exports = router;
