const readDBConfig={
    host:"0.0.0.0",
    port: 6379,
    db:0
};
const writeDBConfig={
    host:"0.0.0.0",
    port: 6379,
    db:1
};
const Redis = require('ioredis'),
    readDB = new Redis(readDBConfig),
    subscriber = new Redis(readDBConfig),
    writeDB = new Redis(writeDBConfig);
const channel = "user-stream-channel";

console.log(`readDB connection status -> ${readDB.status}`);
console.log(`writeDB connection status -> ${writeDB.status}`);
//connect to db
readDB.on("connect", function () {
    console.log("connected to readDB");
});
readDB.on("error", function (err) {
    console.error("failed to connect to readDB " + err);
});
writeDB.on("connect", function () {
    console.log("connected to writeDB");
});
writeDB.on("error", function (err) {
    console.error("failed to connect to writeDB " + err);
});
//subscribe to channel
subscriber.subscribe(channel, function (err, count) {
    console.log(`subscribed to channel ${channel}`);
});
//exports.Redis = Redis;
exports.readDB = readDB;
exports.writeDB = writeDB;
exports.subscriber = subscriber;
