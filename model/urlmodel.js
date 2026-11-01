const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
  longurl: { type: String, required: true },
  shorturl: { type: String, required: true },
  urlcode: { type: String, required: true, unique: true, index: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Url", urlSchema);
