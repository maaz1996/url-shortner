const express = require("express");
const morgan = require("morgan");
const path = require("path");
const config = require("./config/index");

const app = express();
app.set("trust proxy", 1);

// middleware
app.use(morgan("dev"));
app.use(express.json({ limit: "10kb" }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/v1", require("./routes/urlroute"));
app.use((req, res) => res.status(404).send("Page not found."));

if (require.main === module) {
  app.listen(config.port, () => {
    console.log(`URL Shortener listening on port ${config.port}`);
  });
}

module.exports = app;
