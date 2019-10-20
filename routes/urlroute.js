const router = require("express-promise-router")();
const UrlController = require("../controller/urlcontroller");

router
    .route("/url")
    .post((req, res, next) => UrlController.url(req, res, next))
module.exports = router;
