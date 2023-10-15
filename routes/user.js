var express = require('express');
var router = express.Router();
var csrf = require('csurf');
const passport = require('passport');


var csurfProtection = csrf();
router.use(csurfProtection);


router.get('/profile',isLoggedIn , async function(req, res, next) {
    res.render('users/profile');
  });

  router.get("/logout",isLoggedIn, (req, res) => {
    req.logout(req.user, err => {
      if(err) return next(err);
      res.redirect("/");
    });
  });

router.get('/',notLoggedIn , async function(req, res, next) {
    next();
  });

router.get('/signup', async function(req, res, next) {
    var messages = req.flash('error');
    console.log(messages); // Thêm dòng này cho mục đích gỡ lỗi
    res.render('users/signup' ,{ csrfToken: req.csrfToken(), messages, hasErrors: messages.length > 0 });
  });
  
  
  router.post('/signup', passport.authenticate('local.signup',{
    successRedirect: '/users/profile',
    failureRedirect: '/users/signup',
    failureFlash: true, 
  }) );
  
  router.get('/signin', async function(req, res, next) {
    var messages = req.flash('error');
    console.log(messages); // Thêm dòng này cho mục đích gỡ lỗi
    res.render('users/signin' ,{ csrfToken: req.csrfToken(), messages, hasErrors: messages.length > 0 });
  });
  
  router.post('/signin', passport.authenticate('local.signin',{
    successRedirect: '/users/profile',
    failureRedirect: '/users/signin',
    failureFlash: true, 
  }));
  
  module.exports = router;


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}

function notLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}