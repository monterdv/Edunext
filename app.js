var createError = require('http-errors');
var express = require('express');
var app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const expressHandlebars = require('express-handlebars');
var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');
var productsRouter = require('./routes/products');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var expressValidator = require('express-validator');
// const methodOverride = require('method-override');

//connect mongoDB
mongoose.connect('mongodb://localhost:27017/project_dev');
require('./config/passport');
// Event listeners for the connection
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error(`MongoDB connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('Disconnected from MongoDB');
});

// Check if the application is terminated, and close the database connection
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  });
});




// view engine setup
app.engine('.hbs', expressHandlebars.engine({ extname: '.hbs', defaultLayout: "layout",handlebars: require('handlebars').create({ noEscape: true })}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', '.hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());
app.use(session({secret:'mysupersecret', resave: false, saveUninitialized: false}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(methodOverride('_method'));


app.use(function(req,res,next){
    res.locals.login = req.isAuthenticated();
    next();
});
app.use('/products/:id/', productsRouter);
app.use('/products', productsRouter);
app.use('/users', userRouter);
app.use('/', indexRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
