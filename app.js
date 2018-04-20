var createError = require('http-errors');
var path = require('path');
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
app.use(require('morgan')('dev'));

/**
 * STATIC FILES
 */
app.use(express.static(path.join(__dirname, 'public')));

/**
 * PARSER
 */
// cookie parser
app.use(require('cookie-parser')());
// json parser
app.use(express.json());
// urlencoded parser
app.use(express.urlencoded({ extended: false }));

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
