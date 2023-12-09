const express = require("express");
const router = express.Router();
const fileMiddleware = require("../middleware/fileUpload.middleware");
const authControllers = require("../controllers/Auth.controllers");

router.post("/register", fileMiddleware.uploadFiles, authControllers.register);
router.post("/login", authControllers.login);
router.post("/addPhoto", fileMiddleware.uploadFiles, authControllers.addPhoto);

module.exports = router;
