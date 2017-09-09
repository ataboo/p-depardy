require('dotenv').config();
let path = require('path');
let redis = require('redis');

let redisClient = redis.createClient({
	host: 'localhost',
	port: 6379,
	password: process.env.REDIS_SECRET
});

let user = require('../models/user')(redisClient);

user.create('araboud', 'supersecret', function(err, res) {
  if(err) {
    console.log('failed seed with: '.err);
  } else {
    console.log('great success!!!');
  }
});

process.exit();
