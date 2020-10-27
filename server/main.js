const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const morgan = require('morgan');
const passport = require('passport');
const azuread = require('passport-azure-ad');

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

// Config
const PORT = process.env.PORT || 8000;

// REST API
app.use('/api', require('./api'));

// OAUTH
passport.use(new azuread.OIDCStrategy({
  identityMetadata: 'https://login.microsoftonline.com/wpi.edu/.well-known/openid-configuration',
  clientID: process.env.OAUTH_CLIENT_ID,
  responseType: 'id_token code',
  responseMode: 'form_post',
  redirectUrl: 'http://localhost:1234/login/callback/',
  allowHttpForRedirectUrl: true,
  clientSecret: process.env.OAUTH_SECRET,
  scope: ['profile', 'user.read'],
},
function(iss, sub, profile, accessToken, refreshToken, done) {
  if (!profile.oid) {
    return done(new Error("No oid found"), null);
  }
  // asynchronous verification, for effect...
  process.nextTick(function () {
    console.log("find by oid")
    findByOid(profile.oid, function(err, user) {
      console.log("check err")
      if (err) {
        return done(err);
      }
      if (!user) {
        console.log("no usr")
        // "Auto-registration"
        users.push(profile);
        return done(null, profile);
      }
      console.log("yes usr")
      return done(null, user);
    });
  });
}
));


app.use(passport.initialize());
app.use(passport.session());

function regenerateSessionAfterAuthentication(req, res, next) {
  var passportInstance = req.session.passport;
  return req.session.regenerate(function (err){
    if (err) {
      return next(err);
    }
    req.session.passport = passportInstance;
    return req.session.save(next);
  });
}

app.post('/login',
  passport.authenticate('azuread-openidconnect', { failureRedirect: '/' }),
  regenerateSessionAfterAuthentication,
  function(req, res) { 
    res.redirect('/');
});

app.get('/login', 
  passport.authenticate('azuread-openidconnect', { failureRedirect: '/' }));

app.post('/login/callback',
  passport.authenticate('azuread-openidconnect', { failureRedirect: '/' }),
  function(req, res) {
    console.log('Login Success');
    res.redirect('/');
});

app.get('/login/callback', 
  passport.authenticate('azure_ad_oauth2', { failureRedirect: '/' }),
  function (req, res) {
    // Successful authentication, redirect home.
    console.log('Auth success');
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

// Serve frontend
// app.use("/", express.static("dist"));

// Start the server
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log(`If running in development mode, use parcel server port instead`);
    console.log("Press Ctrl+C to quit.");
});