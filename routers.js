var express = require('express');
var router = express.Router();

/**
 * MIDDLEWARE
 */
var middlewareLogin = require('./middleware/login');
router.use('/', middlewareLogin.login);


/**
 * API
 */


/**
 * WEBSITE
 */
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET users listing. */
router.get('/users/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
