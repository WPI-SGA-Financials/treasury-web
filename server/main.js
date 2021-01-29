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

// Serve frontend
let staticHandler = express.static("dist");

if(process.env.IS_DEV) {
    console.log("Starting Parcel dev server...")
    // If dev, use Parcel for HMR
    const Bundler = require('parcel-bundler');
    const bundler = new Bundler('client/index.html', {
        hmr: false, // HMR does not work with HTTPS (thanks, MSAL)
    });
    staticHandler = bundler.middleware();

    // We need a localtunnel for SSO to work, since MSAL uses PKCE which doesn't work via localhost
    console.log("Starting dev https tunnel...")
    const localtunnel = require('localtunnel');

    (async () => {
      const tunnel = await localtunnel({ 
          port: PORT, 
          subdomain: process.env.LT_SUB || undefined 
        });

      console.log("\nLocaltunnel active at URL: " + tunnel.url);

      tunnel.on('close', () => {
        console.log("https tunnel closed")
      });
    })();
}

app.use("/", staticHandler);

// Start the server
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log(`If running in development mode, use parcel server port instead`);
    console.log("Press Ctrl+C to quit.");
});