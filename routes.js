var express = require('express');
var router = express.Router();

/**
 * MIDDLEWARE
 */
// var middlewareLogin = require('./middleware/login');
// router.use('/', middlewareLogin.login);


/**
 * API
 */


/**
 * WEBSITE
 */
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('main');
});

/* GET users listing. */
router.get('/login/', function(req, res, next) {
  res.render('login', { error: false });
});

module.exports = router;
