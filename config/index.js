const dotenv = require("dotenv");
dotenv.config();
module.exports = {
  port: Number(process.env.PORT) || 5001,
  mongoUri: process.env.MONGODB_URI,
  dbusername: process.env.DBUSERNAME,
  dbpassword: process.env.DBPASSWORD,
  dbcluster: process.env.DBCLUSTER,
  dbname: process.env.DBNAME || "url-shortner",
};
