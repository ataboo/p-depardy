module.exports = function(env) {
  var redis = require('redis');

  var redisClient = redis.createClient(6379, 'localhost', {
    password: process.env.REDIS_SECRET
  });

  redisClient.on('error', function(err) {
    console.log("Redis error: " + err);
  })

  return redisClient;
}
