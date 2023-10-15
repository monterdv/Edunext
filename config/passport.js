var passport = require('passport');
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id)
    .then(user => {
      done(null, user);
    })
    .catch(err => {
      done(err, null);
    });
});


passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
  }, function (req, email, password, done) {
    req.checkBody('email', 'Invalid email').notEmpty().isEmail();
    req.checkBody('password', 'Password must be at least 4 characters').notEmpty().isLength({ min: 4 });
    var errors = req.validationErrors();
    if (errors) {
        // Validation errors occurred; flash the error messages and redirect back to the registration page
        errors.forEach(function (error) {
          req.flash('error', error.msg);
        });
        return done(null, false);
      }
    User.findOne({ 'email': email })
      .then(user => {
        if (user) {
          req.flash('error', 'Email is already in use');
          return done(null, false);
        }
  
        var newUser = new User();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        newUser.save()
          .then(result => {
            return done(null, newUser);
          })
          .catch(err => {
            return done(err);
          });
      })
      .catch(err => {
        return done(err);
      });
  }));

  passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
  }, function (req, email, password, done) {
    req.checkBody('email', 'Invalid email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid Password').notEmpty();
  
    const errors = req.validationErrors();
  
    if (errors) {
      errors.forEach(function (error) {
        req.flash('error', error.msg);
      });
      return done(null, false);
    }
  
    User.findOne({ 'email': email })
      .then(user => {
        if (!user) {
          req.flash('error', 'No User Found.');
          return done(null, false);
        }
        
        if (!user.validPassword(password)) {
          req.flash('error', 'Wrong Password.');
          return done(null, false);
        }
  
        return done(null, user);
      })
      .catch(err => {
        return done(err);
      });
  }));