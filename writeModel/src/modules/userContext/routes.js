const userCommands = require('./userCommands')();
const userCommandRoutes = (app) =>{
    app.route('/user-joined')
        .post(userCommands.userJoined)
    app.route('/user-left')
        .post(userCommands.userLeft)
}
module.exports = userCommandRoutes;