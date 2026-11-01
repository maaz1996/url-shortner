const express = require("express");
const router = express.Router();
const UrlController = require("../controller/urlcontroller");
const database = require("../config/database");

router.post("/url", database.connect, UrlController.url);
router.get("/:code", database.connect, UrlController.geturl);

module.exports = router;
