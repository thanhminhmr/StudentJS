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
			mysql.format('SELECT u.id, u.username, u.role, u.fullname, u.class, c.fullname AS classname ' +
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
 * GET LOGOUT
 */
router.get('/logout', function (req, res, next) {
	req.session = null;
	res.redirect('/login');
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
		{ name: 'class', type: 'number', required: true },
		{ name: 'classname', type: 'string', required: true }
	])) {
		next();
	} else {
		req.session = null;
		res.redirect('/login');
	}
});

/**
 * MAIN (FEEDBACK)
 */
router.get('/', function (req, res, next) {
	if (req.session.role === 2) {
		res.redirect('/list');
	} else {
		res.redirect('/form/' + req.session.id);
	}
	/*
	database.query(
		mysql.format('SELECT f.id, f.sender, a.fullname AS sendername, f.relater, b.fullname AS relatername, f.status, f.message ' +
			'FROM feedbacks f INNER JOIN users a ON f.sender = a.id INNER JOIN users b ON f.relater = b.id WHERE f.receiver = ?', [req.session.id]),
		function (error, results, fields) {
			// I fucked up...
			if (error) return next(error);

			// success
			res.render('main', {
				session: req.session,
				data: results
			});
		}
	);
	*/
});

/**
 * STUDENT IN CLASS & FORM LIST
 */
router.get('/list', function (req, res, next) {
	if (req.session.role === 1 || req.session.role === 2) {
		database.query(
			mysql.format('SELECT u.id, u.fullname, f.student, f.status, f.studyingPoint, f.regulationsPoint, f.socialPoint, f.otherPoint ' +
				'FROM users u LEFT JOIN forms f ON u.id = f.student WHERE u.role < 2 AND u.class = ?', [req.session.class]),
			function (error, results, fields) {
				// I fucked up...
				if (error) return next(error);

				// success
				res.render('list', {
					session: req.session,
					data: results
				});
			}
		);
	} else {
		res.redirect('/');
	}
});

/**
 * POST FORM BY USERS.ID
 */
router.post('/form/:id(\\d+)', function (req, res, next) {
	if (req.session.role === 0 && req.session.id == req.params.id) {
		// verify data
		if (verifier(req.body, [
			{ name: 'studyingPoint', type: 'string', required: true },
			{ name: 'regulationsPoint', type: 'string', required: true },
			{ name: 'socialPoint', type: 'string', required: true },
			{ name: 'otherPoint', type: 'string', required: true },
			{ name: 'status', type: 'undefined', required: true },
			{ name: 'approve', type: 'undefined', required: true }
		])) {
			// create & update form
			database.query(
				mysql.format('INSERT INTO forms (student, status, studyingPoint, regulationsPoint, socialPoint, otherPoint) VALUES (?, ?, ?, ?, ?, ?) ' +
					'ON DUPLICATE KEY UPDATE status = ?, studyingPoint = ?, regulationsPoint = ?, socialPoint = ?, otherPoint = ?', [
						req.params.id,
						1, +req.body.studyingPoint, +req.body.regulationsPoint, +req.body.socialPoint, +req.body.otherPoint,
						1, +req.body.studyingPoint, +req.body.regulationsPoint, +req.body.socialPoint, +req.body.otherPoint
					]),
				function (error, results, fields) {
					// I fucked up...
					if (error) return next(error);

					// success
					console.log(results);
					res.redirect('/form/' + req.params.id);
				}
			);
		} else {
			res.redirect('/');
		}
	} else if (req.session.role === 1 || req.session.role === 2) {
		// verify data
		if (verifier(req.body, [
			{ name: 'studyingPoint', type: 'undefined', required: true },
			{ name: 'regulationsPoint', type: 'undefined', required: true },
			{ name: 'socialPoint', type: 'undefined', required: true },
			{ name: 'otherPoint', type: 'undefined', required: true },
			{ name: 'status', type: 'string', required: true },
			{ name: 'approve', type: 'string', required: true }
		])) {
			// update form status
			database.query(
				mysql.format('UPDATE forms SET ? WHERE student = ?', [
					{ status: +req.body.status + (req.body.approve == 1 ? 1 : -1) },
					req.params.id
				]),
				function (error, results, fields) {
					// I fucked up...
					if (error) return next(error);

					// success
					console.log(results);
					res.redirect('/form/' + req.params.id);
				}
			);
		} else {
			res.redirect('/');
		}
	} else {
		res.redirect('/');
	}
});

/**
 * GET FORM BY USERS.ID
 */
router.get('/form/:id(\\d+)', function (req, res, next) {
	if ((req.session.role === 0 && req.session.id == req.params.id) || req.session.role === 1 || req.session.role === 2) {
		next();
	} else {
		res.redirect('/');
	}
}, function (req, res, next) {
	database.query(
		mysql.format('SELECT u.id, u.fullname, f.student, f.status, f.studyingPoint, f.regulationsPoint, f.socialPoint, f.otherPoint ' +
			'FROM users u LEFT JOIN forms f ON u.id = f.student WHERE u.role < 2 AND u.id = ?', [req.params.id]),
		function (error, results, fields) {
			// I fucked up...
			if (error) return next(error);
			// something it's wrong here
			if (results.length > 1) return next(createError(500));

			// not found
			if (results.length === 0) return res.redirect("/");

			// success
			res.locals.form = results[0];
			next();
		}
	);
}, function (req, res, next) {
	database.query(
		mysql.format('SELECT e.id, e.sender, u.fullname AS sendername, e.message FROM feedbacks e INNER JOIN users u ON e.sender = u.id ' +
			'WHERE e.relater = ?', [res.locals.form.id]),
		function (error, results, fields) {
			// I fucked up...
			if (error) return next(error);

			res.render('form', {
				session: req.session,
				form: res.locals.form,
				feedbacks: results
			});
		}
	);
});

/**
 * FEEDBACK
 */
router.post('/feedback/:id(\\d+)', function (req, res, next) {
	if ((req.session.role === 0 && req.session.id == req.params.id) || req.session.role === 1 || req.session.role === 2) {
		// verify data
		if (verifier(req.body, [
			{ name: 'message', type: 'string', required: true }
		])) {
			// create & update form
			database.query(
				mysql.format('INSERT INTO feedbacks (sender, relater, message) VALUES (?, ?, ?)', [
						req.session.id, req.params.id, req.body.message
					]),
				function (error, results, fields) {
					// I fucked up...
					if (error) return next(error);

					// success
					console.log(results);
					res.redirect('/form/' + req.params.id);
				}
			);
		} else {
			res.redirect('/form/' + req.params.id);
		}
	} else {
		res.redirect('/');
	}
});

module.exports = router;
