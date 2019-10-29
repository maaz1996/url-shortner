const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const config = require('./config/index');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

db = mongoose.connect('mongodb+srv://admin:dbadmin@cluster0-dweca.mongodb.net/mydb?retryWrites=true&w=majority', { useNewUrlParser: true })

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
