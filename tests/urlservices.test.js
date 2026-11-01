const assert = require("node:assert/strict");
const test = require("node:test");
const { urlservices } = require("../services/urlservices");

test("rejects malformed destinations before accessing the database", async () => {
  await assert.rejects(
    urlservices({ longurl: "not a URL" }, "https://short.example/api/v1"),
    { statusCode: 400, message: "Enter a valid URL beginning with http:// or https://." }
  );
});

test("rejects non-web URL protocols", async () => {
  await assert.rejects(
    urlservices({ longurl: "javascript:alert(1)" }, "https://short.example/api/v1"),
    { statusCode: 400, message: "Only HTTP and HTTPS URLs can be shortened." }
  );
});