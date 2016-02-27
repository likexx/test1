var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var redis = require('redis');
var Promise = require('bluebird');
var app = express();

mongoose.Promise = Promise;
Promise.promisifyAll(mongoose);

Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

mongoose.connect('mongodb://mongo:27017/test1');
mongoose.connection.on('error', () => logger.error('MongoDB Connection Error'));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

console.log('start test');

require('./route')(app);

var server = app.listen(80, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('test server listening at http://%s:%s', host, port);
});
