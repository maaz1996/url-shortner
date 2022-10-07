const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const config = require('./config/index');
// mongoose.set('useNewUrlParser', true);
// mongoose.set('useFindAndModify', false);
// mongoose.set('useCreateIndex', true);
// mongoose.set('useUnifiedTopology', true);

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

db = mongoose.connect(
  `mongodb+srv://${config["dbusername"]}:${config["dbpassword"]}@${config["dbcluster"]}/${config["dbname"]}?retryWrites=true&w=majority`,
  options,
  function (error) {
    if (error) {
      console.log(error);
      mongoose.connect(
        `mongodb://localhost:27017/${config["dbname"]}`,
        options,
        function (error) {
          if (error) console.log(error);
          else console.log("connected to local mongodb");
        }
      );
    } else console.log("connected to atlas mongo");
  }
);

// middleware
app.use(morgan('dev'));
app.use(bodyParser.json());

// CORS Headers
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE,');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// @Routes /api/v1/url
const Routes = require('./routes/urlroute');
app.use('/api/v1', Routes);



app.listen(config['port'], () => {
  console.log(`Server listening on port: ${config['port']}`);
});
