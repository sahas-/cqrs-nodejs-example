## This is write model for the cqrs example
### Structure
- Receive commands via http endpoints hosted in lambda function
- Use Redis as event store
- Use Redis rudimentary pub/sub for communication with readModel
    - publish to Redis channel
    - expect readModel to subscribe to Redis channel for further processing
### Development
- npm install
- npm start
### commands
- /user-joined
- /user-left