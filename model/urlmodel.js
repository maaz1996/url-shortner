const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-type-url');

const urlschema = new Schema({
    longurl: {
        type: String,
    },
    shorturl: {
        type: String,
    },
    urlcode: {
        type: String
    },
    date: {
        type: Date
    }
});

const urlmodel = mongoose.model('Url', urlschema);
module.exports = urlmodel;
