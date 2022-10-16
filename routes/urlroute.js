const express = require("express");
const router = express.Router();
const UrlController = require("../controller/urlcontroller");
const middleware = require("../config/auth");
router.post("/url", middleware.auth, UrlController.url);
router.get("/:code", UrlController.geturl);
module.exports = router;
