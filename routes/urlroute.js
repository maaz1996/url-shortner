const router = require("express-promise-router")();
const UrlController = require("../controller/urlcontroller");

router
    .route("/url")
    .post((req, res, next) => UrlController.url(req, res, next))
router
    .route("/:code")
    .get((req, res, next) => UrlController.geturl(req, res, next))
module.exports = router;
