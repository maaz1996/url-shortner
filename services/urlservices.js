const { randomBytes } = require("crypto");
const Url = require("../model/urlmodel");

const urlservices = async (payload, baseUrl) => {
  const longurl = payload?.longurl;
  let parsedUrl;

  try {
    parsedUrl = new URL(longurl);
  } catch {
    const error = new Error("Enter a valid URL beginning with http:// or https://.");
    error.statusCode = 400;
    throw error;
  }

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    const error = new Error("Only HTTP and HTTPS URLs can be shortened.");
    error.statusCode = 400;
    throw error;
  }

  const existingUrl = await Url.findOne({ longurl });
  if (existingUrl) {
    existingUrl.shorturl = `${baseUrl}/${existingUrl.urlcode}`;
    return existingUrl.save();
  }

  const urlcode = randomBytes(6).toString("base64url");
  return Url.create({
    longurl,
    shorturl: `${baseUrl}/${urlcode}`,
    urlcode,
  });
};

const geturlservices = async (urlcode) => {
  const url = await Url.findOne({ urlcode });
  return url?.longurl || null;
};

module.exports = {
  urlservices,
  geturlservices,
};
