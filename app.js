var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
// var indexRouter = require('./routes/index');
// var users = require('./routes/users');

var app = express();
mongoose.connect("mongodb://localhost/auth_demo");
mongoose.connection.on('error', error => console.log(error) );
mongoose.Promise = global.Promise;

const UserModel = require('./model/model');
require('./auth/auth');
require('./auth/adminauth')
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
const routes = require('./routes/routes');
const admin = require('./routes/admin')
// app.use('/', indexRouter);
// app.use('/users', usersRouter);
const secureRoute = require('./routes/secure-routes');
const adminRoute = require('./routes/admin-routes');

app.use('/', routes);
//We plugin our jwt strategy as a middleware so only verified users can access this route
app.use('/user', passport.authenticate('jwt', { session : false }), secureRoute );
app.use('/adminpanel', passport.authenticate('jwt', { session : false }), adminRoute );
app.use('/admin',admin );

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
