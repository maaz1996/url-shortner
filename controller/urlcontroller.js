const UrlServices = require("../services/urlservices")()
module.exports = {

    url: async (req, res) => {
        payload = req.body;
        const response = await UrlServices.urlservices({ payload })
        res.status(200).json({
            status: 200,
            result: response
        });
    },
}