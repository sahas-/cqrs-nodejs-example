This is aggregator logic that subscribes to channel where writeModel publishes the msg and creates normalized read data (LoggedInUsers) for readModel to consume

### Structure
- Subscribe to Redis channel to process the data
### Development
- npm install
- npm start
### 
Below are the finalized data available for read model
- loggedInUsers sorted set contains final set of users who are presently loggedIn
- a list with id:name (e.g. 1:sahas) corresponding to each user contains activity log for each user

