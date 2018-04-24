
// Database setup
module.exports = require('mysql').createPool({
	connectionLimit : 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'studentjs'
});
