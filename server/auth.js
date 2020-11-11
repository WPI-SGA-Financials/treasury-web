const express = require('express');
const passport = require('passport');
let router = express.Router();

router.get('/login',
  (req, res, next) => {
    passport.authenticate('azuread-openidconnect',
      {
        response: res,
        prompt: 'login',
        session: false,
        failureRedirect: '/',
        failureFlash: true,
        successRedirect: '/'
      }
    )(req,res,next);
  }
);

router.post('/callback',
  (req, res, next) => {
    console.log(req.params);

    passport.authenticate('azuread-openidconnect',
      {
        response: res,
        session: false,
        failureRedirect: '/',
        successRedirect: '/',
        failureFlash: true
      }
    )(req,res,next);
  },
  (req, res) => {
    console.log("Token")
    // TEMPORARY!
    // Flash the access token for testing purposes
    req.flash('error_msg', {message: 'Access token', debug: req.user.accessToken});
    res.redirect('/');
  }
);

router.get('/logout',
  (req, res) => {
    req.session.destroy(function(err) {
      req.logout();
      res.redirect('/');
    });
  }
);

module.exports = router;