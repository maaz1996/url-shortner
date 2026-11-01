const UrlServices = require("../services/urlservices");

module.exports = {
  url: async (req, res) => {
    try {
      const baseUrl = `${req.protocol}://${req.get("host")}/api/v1`;
      const response = await UrlServices.urlservices(req.body, baseUrl);
      return res.status(201).json({ data: response });
    } catch (error) {
      const status = error.statusCode || 500;
      return res.status(status).json({
        error: status === 500 ? "Unable to create a short link." : error.message,
      });
    }
  },
  geturl: async (req, res) => {
    try {
      const destination = await UrlServices.geturlservices(req.params.code);
      if (!destination) return res.status(404).send("This short link was not found.");
      return res.redirect(302, destination);
    } catch {
      return res.status(500).send("Unable to resolve this short link.");
    }
  },
};
