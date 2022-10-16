const express = require('express');
const router = express.Router();
const UrlController = require("../controller/urlcontroller");
// const middleware = require('../config/middlewares/checkauth');

// const auth = 

// router.get('/lead/leadDetails', middleware.auth, middleware.roleAuth, lead.leadDetails);

router
    .post("/url",UrlController.url)
router
    .get("/:code",UrlController.geturl)
module.exports = router;
