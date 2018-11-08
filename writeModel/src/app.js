'use strict';
const devEnv = process.env.devEnv === "true";

if (devEnv) {
    require('dotenv').config({ path: 'config/.env' });
}

const express = require('express'),
      bodyParser = require('body-parser'),
      path = require('path'),
      cors = require('cors'),
      awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');

const userContext = require('./modules/userContext/routes');

const port = process.env.PORT || 3000;

const app = express();

// Enable middleware for parsing incoming request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Enable CORS support
app.use(cors());
// Enable middleware to map custom authorizer context
app.use(awsServerlessExpressMiddleware.eventContext());
// Configure static content directory
app.use(express.static(path.join(__dirname, 'public')));
// Set up routes
userContext(app);
// Global error handling
app.use((err, req, res, next) => {
    res.status(500);
    res.json({ error: err.toString() });
});
// Mock custom authorizer context
if (devEnv) {
    app.use((req, res, next) => {
        req.apiGateway = {
            event: {
                requestContext: {
                    authorizer: {
                        roles: req.headers['authorizer-roles'],
                        username: req.headers['authorizer-username'],
                        uid: req.headers['authorizer-uid']
                    }
                }
            }
        };
        next();
    });
}
// Start server for local development
if (devEnv) {
    app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
}

module.exports = app;
