const mongoose = require("mongoose");
const config = require("./index");

let databaseConnection;

function getMongoUri() {
  if (config.mongoUri) return config.mongoUri;

  const { dbusername, dbpassword, dbcluster, dbname } = config;
  if (dbusername && dbpassword && dbcluster) {
    return `mongodb+srv://${encodeURIComponent(dbusername)}:${encodeURIComponent(
      dbpassword
    )}@${dbcluster}/${dbname}?retryWrites=true&w=majority`;
  }

  return `mongodb://127.0.0.1:27017/${dbname}`;
}

async function connect(req, res, next) {
  if (mongoose.connection.readyState === 1) return next();

  if (!databaseConnection || mongoose.connection.readyState === 0) {
    databaseConnection = mongoose.connect(getMongoUri()).catch((error) => {
      databaseConnection = null;
      throw error;
    });
  }

  try {
    await databaseConnection;
    return next();
  } catch {
    return res.status(503).json({ error: "The database is unavailable." });
  }
}

module.exports = { connect };