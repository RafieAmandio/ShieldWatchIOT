const express = require("express");
const router = express.Router();

const alghControllers = require("../controllers/Algh.controllers");

router.post('/compare',alghControllers.compare);

module.exports = router;
