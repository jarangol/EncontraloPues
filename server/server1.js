var mongoose = require('mongoose');

var mongodbUri = 'mongodb://user:user@ds035776.mlab.com:35776/encontralopues';

mongoose.connect(mongodbUri);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
