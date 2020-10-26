const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const morgan = require('morgan');

const options = {
    definition: {
      info: {
        title: 'Treasury API',
        version: '1.0.0',
        description: 'API to expose WPI SGA Financial Data'
      },
      basePath: '/api',
    },
    // Path to the API docs
    apis: ['server/api.js', 'server/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(morgan('dev'));

// Config
const PORT = process.env.PORT || 8000;

// REST API
app.use('/api', require('./api'));

//TODO: oauth

// Serve frontend
// app.use("/", express.static("dist"));

// Start the server
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log(`If running in development mode, use parcel server port instead`);
    console.log("Press Ctrl+C to quit.");
});