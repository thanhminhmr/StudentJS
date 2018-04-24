
var path = require('path');
var createError = require('http-errors');
var logger = require('morgan');
var cookieParser = require('cookie-parser')
var cookieSession = require('cookie-session');
var express = require('express');

var app = express();

/**
 * VIEW ENGINE
 */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/**
 * LOGGER
 */
app.use(logger('dev'));

/**
 * STATIC FILES
 */
app.use('/static/', express.static(path.join(__dirname, 'public')));

/**
 * PARSER
 */
// cookie parser
app.use(cookieParser());
// json parser
app.use(express.json());
// urlencoded parser
app.use(express.urlencoded({ extended: false }));

/**
 * SESSION
 */
app.use(cookieSession({
  name: 'session',
  secret: 'someRandomSecretString',
  // Cookie Options
  maxAge: 60 * 60 * 1000 // 1 hour
}));

/**
 * ROUTER
 */
// router
app.use('/', require('./routes'));


/**
 * ERROR HANDLING
 */

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
