const Redis = require('ioredis'), redis = new Redis({
    host:"0.0.0.0",
    port: 6379,
    db: 0
});
exports.Redis = Redis;
exports.redis = redis;
console.log(`redis connection status -> ${redis.status}`);
redis.on("connect", function () {
    console.log("connected to redis");
});
redis.on("error", function (err) {
    console.error("failed to connect to redis " + err);
});