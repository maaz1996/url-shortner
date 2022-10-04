
const dotenv = require("dotenv");
dotenv.config();
module.exports = {
  JWT_SECRET: 'authentication',
  port: 5001,
  BaseUrl: "http://localhost:5001",
  dbusername: process.env.DBUSERNAME,
  dbpassword:process.env.DBPASSWORD,
  dbcluster:process.env.DBCLUSTER,
  dbname:process.env.DBNAME,
};
