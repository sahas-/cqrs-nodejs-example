const { redis } = require("./redisConnector");

const
    eventstore = "eventstore", //hash - to store all the events, faster read and write
    eventsSortedSet = "sorted-events.index" // sorted set - index to store the order of the events with arrival timestamp
    channel = "user-stream-channel", // pub/sub channel - for aggregator to subscribe and process the data from eventstore
    stream = "user-stream", // list - for guaranteed delivery. Because redis channels don't retain msg, if subscriber is down
    uuidv1 = require('uuid/v1');

async function publishToEventStore(body) {
    try {
        const _uuid = uuidv1();
        const {id,name,_action,_receivedTimestamp} = body;


        return await redis.multi()
            .incr("total-events")
            .hset(eventstore, _uuid, JSON.stringify(body))
            .zadd(eventsSortedSet,_receivedTimestamp,_uuid)
            .lpush(stream, _uuid)
            .publish(channel, _uuid)
            .exec();
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}

function userCommands() {
    userJoined = async (req, res) => {
        req.body._action = "addUser",
        req.body._command="user-joined",
        req.body._receivedTimestamp = Math.floor((new Date() / 1000)*1000); //to epoch milliseconds
        await _execute(req, res);
    }
    userLeft = async (req, res, next) => {
        req.body._action = "removeUser",
        req.body._command="user-left",        
        req.body._receivedTimestamp = Math.floor((new Date() / 1000)*1000); //to epoch milliseconds        
        await _execute(req, res);
    }

    return {
        userJoined,
        userLeft
    }

    async function _execute(req, res) {
        await publishToEventStore(req.body)
            .then(response => {
                res.status(202).json('ack');
            })
            .catch(error => {
                res.status(400).json('error occured, checkout logs');
            });
    }
}
module.exports = userCommands;