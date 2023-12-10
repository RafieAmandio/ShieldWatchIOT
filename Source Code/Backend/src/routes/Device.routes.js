const express = require("express");
const router = express.Router();

const deviceControllers = require("../controllers/Device.controllers");

router.post("/add", deviceControllers.addDevice);
router.post("/latest", deviceControllers.latest);

module.exports = router;
