//Initiallising node modules
const Joi = require('joi'); // use for validation
const express = require("express");
const router = express.Router();
var md5 = require('md5');

var sql = require('../db.js');
var webToken = require('../configs/key').webToken;

// Body Parser Middleware
router.use(express.json());

// this function use for enable CORS on ExpressJS if get problem 
// Access to XMLHttpRequest at 'http://localhost:5000/Students' from origin 'http://localhost:4200' 
// has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested
// resource.
//CORS Middleware
router.use(function (req, res, next) {
	//Enabling CORS 
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
	next();
});

router.get('/', (req, res) => {
	res.send('Users');
});

// Retrieve all users 
router.get('/get/all', (req, res) => {
	sql.query('SELECT * FROM OWNERS', function (error, results, fields) {
		if (error) throw error;
		return res.send({ error: false, data: results, message: 'users list.' });
	});
});

// check permission
router.post('/checkPermission', function (req, res) {
	let user = req.body;
	if (!user) {
		return res.status(400).send({ error: user, message: 'Please provide user' });
	}

	var username = user.username;
	var password = md5(user.password);


	sql.query('SELECT * FROM OWNERS WHERE username = ? AND password = ?', [username, password], function (error, results, fields) {
		if (error) throw error;

		if (results.length > 0)
			return res.send({ error: false, permission: true, message: 'check permission.' });
		else
			return res.send({ error: false, permission: false, message: 'check permission.' });

	});

});


// update password
router.put('/update/password', function (req, res) {
	let user = req.body;
	if (!user) {
		return res.status(400).send({ error: user, message: 'Please provide user' });
	}

	var hash = md5(user.password);
	console.log(hash);

	sql.query("UPDATE OWNERS SET ? WHERE id = ?", [{ username: user.username, password: hash }, user.id], function (error, results, fields) {
		if (error) throw error;
		return res.send({ error: false, data: results, message: 'user has been updated successfully.' });
	});
});


module.exports = router;