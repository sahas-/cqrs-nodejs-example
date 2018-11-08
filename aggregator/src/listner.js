'use strict';
const { readDB,writeDB, subscriber } = require("./redisConnector");
const
  sourceList = "user-stream", // list - where message reference is retained for pickup
  processingList = "processingList", // list - intermediary data structure to make sure a message is processed only once
  eventStore = "eventstore", // write model event store
  loggedInUsers = "loggedInUsers"; // final data structure for read model
const actionTypes = {
  adduser: "adduser",
  removeuser: "removeuser"
};
subscriber.on('message', function (channel, message) {
  console.log('Received message %s from channel %s', message, channel);
  processMsg(message)
    .then(response => {
      //0 - response for moving to processingList command
      //1 - response for hmget command
      //2 - response for lrem command
      //each array will have 2 inner string arrays null,[actual data]
      const _response = response[1];
      const { id, name, _receivedTimestamp, _action,_command } = JSON.parse(_response[1]);
      const userKey=`${id}:${name}`;
      const activityLog=`${_receivedTimestamp}:${_command}`;    
      buildUserActivityLog(userKey,activityLog);
      console.log(`identified action: ${_action.toLowerCase()}`);            
      switch (_action.toLowerCase()) {
        case actionTypes.adduser:
          addUser(_receivedTimestamp, userKey);
          break;
        case actionTypes.removeuser:
          removeUser(userKey);
          break;
        default:
          console.log("invalid case");
          break;
      }
    })
    .catch(console.error);
});

async function processMsg(message) {
  console.log(`processing message ${message}`);
  try {
    return await readDB.multi()
      .rpoplpush(sourceList, processingList)
      .hmget(eventStore, message)
      .lrem(processingList, 1, message)
      .exec();
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}

async function addUser(ts, payload) {
  console.log(`adding user ${payload} to loggedIn users set`);
  try {
    return await writeDB.multi()
      .zadd(loggedInUsers, ts, payload)
      .exec();
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}
async function removeUser(payload) {
  console.log(`removing user ${payload} from loggedIn users set`);
  try {
    return await writeDB.multi()
      .zrem(loggedInUsers, payload)
      .exec();
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}
async function buildUserActivityLog(user,log){
  console.log(`logging activity for user ${user}`);
  try {
    return await writeDB.multi()
      .rpush(user,log)
      .exec();
  } catch (error) {
    console.error(error);
    throw new Error(error);
  } 
}
