var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var database = require('./database');

var verifier = function (obj, struct) {
	return typeof obj === 'object' &&
		struct.every(element => {
			return typeof obj[element.name] === element.type ||
				!element.required && typeof obj[element.name] === 'undefined';
		});
}

var purifier = function (obj, struct) {
	let ret = {};
	if (typeof obj === 'object' &&
		struct.every(element => {
			if (typeof obj[element.name] === element.type ||
				!element.required && typeof obj[element.name] === 'undefined') {

				if (typeof obj[element.name] !== 'undefined') ret[element.name] = obj[element.name];
				return true;
			}
			return false;
		})) {
		return ret;
	}
	return false;
}

/**
 * TEST
 */
router.get('/test', function (req, res, next) {
	console.log(req.session.isPopulated);
	res.end();
});

/**
 * GET LOGIN
 */
router.get('/login', function (req, res, next) {
	res.render('login', { error: false });
});

/**
 * POST LOGIN
 */
router.post('/login', function (req, res, next) {
	// verify data
	if (verifier(req.body, [
		{ name: 'username', type: 'string', required: true },
		{ name: 'password', type: 'string', required: true }
	])
		&& /^\w{4,63}$/.test(req.body.username)
		&& /^[ -~]{6,63}$/.test(req.body.password)) {

		// verified data
		database.query(
			mysql.format('SELECT u.id, u.username, u.role, u.fullname, c.id AS classid, c.fullname AS classname ' +
				'FROM users u INNER JOIN classes c ON u.class = c.id WHERE u.username = ? AND u.password = ?',
				[req.body.username, req.body.password]),
			function (error, results, fields) {
				// I fucked up...
				if (error) return next(error);
				// something it's wrong here
				if (results.length > 1) return next(createError(500));

				// login failed
				if (results.length == 0) return res.render('login', { error: true });

				// login success
				req.session = results[0];
				res.redirect('/');
			}
		);
	} else {
		res.render('login', { error: true });
	}
});

/**
 * REQUIRE LOGIN
 */
router.use(function (req, res, next) {
	if (req.session.isPopulated && verifier(req.session, [
		{ name: 'id', type: 'number', required: true },
		{ name: 'username', type: 'string', required: true },
		{ name: 'role', type: 'number', required: true },
		{ name: 'fullname', type: 'string', required: true },
		{ name: 'classid', type: 'number', required: true },
		{ name: 'classname', type: 'string', required: true }
	])) {
		next();
	} else {
		req.session = null;
		res.redirect('/login');
	}
});

/**
 * WEBSITE MAIN (NOTIFICATION)
 */
router.get('/', function (req, res, next) {
	database.query(
		mysql.format('SELECT f.id, f.sender, a.fullname AS sendername, f.relater, b.fullname AS relatername, f.status, f.message ' +
			'FROM feedbacks f INNER JOIN users a ON f.sender = a.id INNER JOIN users b ON f.relater = b.id WHERE f.receiver = ?', [req.session.id]),
		function (error, results, fields) {
			// I fucked up...
			if (error) return next(error);

			// success
			res.render('main', {
				username: req.session.username,
				fullname: req.session.fullname,
				role: req.session.role,
				classname: req.session.classname,
				feedbacks: results
			});
		}
	);
});

/**
 * WEBSITE LIST
 */
router.get('/list', function (req, res, next) {
	if (req.session.role === 1 || req.session.role === 2) {
		database.query(
			mysql.format('SELECT f.id, f.sender, a.fullname AS sendername, f.relater, b.fullname AS relatername, f.status, f.message ' +
				'FROM feedbacks f INNER JOIN users a ON f.sender = a.id INNER JOIN users b ON f.relater = b.id WHERE f.receiver = ?', [req.session.id]),
			function (error, results, fields) {
				// I fucked up...
				if (error) return next(error);

				// success
				res.render('main', {
					username: req.session.username,
					fullname: req.session.fullname,
					role: req.session.role,
					classname: req.session.classname,
					feedbacks: results
				});
			}
		);
	} else {
		res.redirect('/');
	}
});

module.exports = router;
