const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const morgan = require('morgan');
const passport = require('passport');
var AzureAdOAuth2Strategy  = require("passport-azure-ad-oauth2");
const azuread = require("passport-azure-ad");
const cors = require('cors');

// Load DB and SSO Credentials
const dotenv = require('dotenv')
const credentials = dotenv.config({path: './server/.env'})

// Can't start without credentials
if(credentials.error) {
  console.error("Failed to load .env. Your env vars better be set!")
} else {
  console.log("Loaded .env successfully");
}

// Verify environment
const reqEnv = [
    process.env.DB_HOST, 
    process.env.DB_USER, 
    process.env.DB_PASSWORD, 
    process.env.DB_NAME
  ];
if(reqEnv.includes(undefined)) {
  throw new Error("Config Error: Missing required environment variable");
} else {
  console.log("All required env vars are set");
}

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
app.use(cors());
// Config
const PORT = process.env.PORT || 8000;

// REST API
app.use('/api', require('./api'));

// OAUTH
app.use('/auth', require('./auth'));

// Passport calls serializeUser and deserializeUser to
// manage users
passport.serializeUser(function(user, done) {
  // Use the OID property of the user as a key
  users[user.profile.oid] = user;
  done (null, user.profile.oid);
});

passport.deserializeUser(function(id, done) {
  done(null, users[id]);
});

async function signInComplete(iss, sub, profile, accessToken, refreshToken, params, done) {
  if (!profile.oid) {
    return done(new Error("No OID found in user profile."));
  }

  // Save the profile and tokens in user storage
  // users[profile.oid] = { profile, accessToken };
  return done(null, users[profile.oid]);
}

passport.use(new azuread.OIDCStrategy({
  identityMetadata: 'https://login.microsoftonline.com/wpi.edu/v2.0/.well-known/openid-configuration',
  clientID: process.env.OAUTH_CLIENT_ID,
  responseType: 'code id_token',
  responseMode: 'form_post',
  redirectUrl: process.env.OAUTH_CALLBACK_URL,
  allowHttpForRedirectUrl: process.env.OAUTH_CALLBACK_URL.includes("http://localhost"),
  clientSecret: process.env.OAUTH_SECRET,
  validateIssuer: false,
  passReqToCallback: false,
  scope: ['profile', 'user.read'],
  useCookieInsteadOfSession: true,  // use cookie, not session
  cookieEncryptionKeys: [ { key: '12345678901234567890123456789012', 'iv': '123456789012' }]
},
signInComplete
));

// Init
app.use(passport.initialize());
app.use(passport.session());

// Serve frontend
// app.use("/", express.static("dist"));

// Start the server
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log(`If running in development mode, use parcel server port instead`);
    console.log("Press Ctrl+C to quit.");
});