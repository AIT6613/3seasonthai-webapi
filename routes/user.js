//Initiallising node modules
const Joi = require('joi'); // use for validation
const express = require("express");
const router = express.Router();

var config = {
	user: require('../configs/key').dbUser,
	password: require('../configs/key').dbPassword,
	database: require('../configs/key').dbDatabase,
	server: require('../configs/key').dbServer
}

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

/*
function query(sql, callback) {
	var mssql = require('mysql');

	new mssql.ConnectionPool(config).connect().then(pool => {
		return pool.request().query(sql)
	}).then(result => {
		callback(result);
		mssql.close();
	}).catch(err => {
		console.log(err);
		mssql.close();
	});
}
*/

router.get('/', (req, res) => {
	res.send('Enrolments');
});

/*
router.get('/get/all', (req, res) => {
	// create sql command
	var sql = "SELECT * FROM Enrolments";
	// query data
	query(sql, function (record) {
		// create dataset from  callback data
		var data = record.recordset;
		// send data back
		res.send(data);
	});
});

router.get('/get/enrolmentLists', (req, res) => {
	// create sql command
	var sql = "SELECT Enrolments.id, Enrolments.createDate, Students.studentNumber AS studentID, Students.givenName AS studentGivenName, Students.familyName AS studentFamilyName, Courses.name AS courseName, Enrolments.startDate AS courseStart, Enrolments.endDate AS courseFinish, Enrolments.status, OfferLetterDetails.offerLetter_id AS offerLetterId FROM Enrolments INNER JOIN Students ON Enrolments.studentId = Students.id INNER JOIN Courses ON Enrolments.courseId = Courses.id INNER JOIN OfferLetterDetails ON Enrolments.offerLetterDetailId = OfferLetterDetails.id";
	// query data
	query(sql, function (record) {
		// create dataset from  callback data
		var data = record.recordset;
		// send data back
		res.send(data);
	});
});

router.get('/get/enrolment/:id', (req, res) => {
	// get parameter from request
	var id = req.params.id;
	// create sql command
	var sql = "SELECT * " +
		"FROM Enrolments " +
		"WHERE id = " + id;

	// query data
	query(sql, function (data) {
		// if record not found, send error back
		if (data.length <= 0) return res.status(404).send('The enrolment with the given ID was not found');

		res.status(200).send(data.recordset)
	});
});

router.get('/get/productChoices/:offerLetterId', (req, res) => {
	// get parameter from request
	var offerLetterId = req.params.offerLetterId;
	// create sql command
	var sql = "SELECT        OfferLetterDetails.id AS offerLetterDetailId, Products.id AS productId, Products.name AS productName, Courses.id AS courseId, Courses.name AS courseName, Courses.weeks AS weeks, Courses.terms AS terms, OfferLetterDetails.courseStart AS courseStart, OfferLetterDetails.courseFinish AS courseFinish FROM Courses INNER JOIN Products INNER JOIN OfferLetters INNER JOIN OfferLetterDetails ON OfferLetters.id = OfferLetterDetails.offerLetter_id ON Products.id = OfferLetterDetails.product_id ON Courses.id = Products.course_id WHERE        (OfferLetters.id = " + offerLetterId + ")";

	// query data
	query(sql, function (data) {
		// if record not found, send error back
		if (data.length <= 0) return res.status(404).send('The offer letter detail with the given ID was not found');

		res.status(200).send(data.recordset)
	});
});

router.post('/addNew/enrolment', (req, res) => {

	// Validate
	const { error } = validateEnrolment(req.body); // getting result.error

	// if invalid, return 400 - Bad request
	if (error) {
		res.status(400).send(error.details[0].message);
		return;
	}

	let enrolment = req.body;

	var mssql = require('mssql');
	new mssql.ConnectionPool(config).connect().then(pool => {
		// =========
		var request = pool.request()

		// input variable
		request.input('offerLetterDetailId', mssql.Int, enrolment.offerLetterDetailId);
		request.input('studentId', mssql.Int, enrolment.studentId);
		request.input('courseId', mssql.Int, enrolment.courseId);
		request.input('tasId', mssql.Int, enrolment.tasId);
		request.input('startDate', mssql.DateTime2, enrolment.startDate);
		request.input('endDate', mssql.DateTime2, enrolment.endDate);
		request.input('status', mssql.VarChar, enrolment.status);
		request.input('weeks', mssql.Int, enrolment.weeks);
		request.input('durationHours', mssql.Int, enrolment.durationHours);
		request.input('note', mssql.VarChar, enrolment.note);

		// execute
		request.query('insert into Enrolments \
			(offerLetterDetailId,studentId,courseId,tasId,startDate,endDate,status,weeks,durationHours,note) \
			values (@offerLetterDetailId,@studentId,@courseId,@tasId,@startDate,@endDate,@status,@weeks,@durationHours,@note) SELECT SCOPE_IDENTITY() as id'
		).then(result => {

			// return row affected back
			res.status(200).set("Insert OK");
			res.send(result.recordset);

			mssql.close();
		}).catch(error => {
			console.log(error);
			mssql.close();
		})


	});
});

router.put('/update', (req, res) => {
	// Validate
	const { error } = validateEnrolment(req.body); // getting result.error

	// if invalid, return 400 - Bad request
	if (error) {
		res.status(400).send(error.details[0].message);
		return;
	}

	// get params from request body
	let enrolment = req.body;
	console.log('update enrolment.');

	var mssql = require('mssql');
	new mssql.ConnectionPool(config).connect().then(pool => {
		// =========
		var request = pool.request()

		// input variable
		request.input('id', mssql.Int, enrolment.id);
		request.input('offerLetterDetailId', mssql.Int, enrolment.offerLetterDetailId);
		request.input('studentId', mssql.Int, enrolment.studentId);
		request.input('courseId', mssql.Int, enrolment.courseId);
		request.input('tasId', mssql.Int, enrolment.tasId);
		request.input('startDate', mssql.DateTime2, enrolment.startDate);
		request.input('endDate', mssql.DateTime2, enrolment.endDate);
		request.input('status', mssql.VarChar, enrolment.status);
		request.input('weeks', mssql.Int, enrolment.weeks);
		request.input('durationHours', mssql.Int, enrolment.durationHours);
		request.input('note', mssql.VarChar, enrolment.note);

		// execute
		request.query('UPDATE Enrolments \
			SET offerLetterDetailId=@offerLetterDetailId,courseId=@courseId,tasId=@tasId,startDate=@startDate,endDate=@endDate,status=@status,weeks=@weeks,durationHours=@durationHours,note=@note \
			WHERE id=@id')
			.then(result => {
				
				// if record not found, send error back
				if (result.rowsAffected <= 0) return res.status(404).send('The enrolment with the given ID was not found');

				// return row affected back
				res.status(200).set("Update OK");
				res.send(result.rowsAffected);

				mssql.close();
			}).catch(error => {
				console.log(error);
				mssql.close();
			})
	});

});

router.delete('/delete/enrolment/:id', (req, res) => {
	// get parameter from request
	var id = req.params.id;

	console.log('Delele Enrolment by id.');

	// validate data
	if (!id) {
		res.status(400).send('Need id to delete in Enrolment');
		return;
	}

	// create sql command
	sql = "DELETE FROM Enrolments WHERE id = " + id;
	// query data
	query(sql, function (record) {
		// if record not found, send error back
		console.log(record.rowsAffected);
		if (record.rowsAffected <= 0) return res.status(404).send('The Enrolment with the given ID was not found');
		// send status back
		res.status(200).set("OK");
		// send row affected back
		res.send(record.rowsAffected);
	});
});

function validateEnrolment(enrolment) {
	// set schema to check for each variable. each variable can set different validation
	const schema = {
		id: Joi.optional(),
		offerLetterDetailId: Joi.required(),
		studentId: Joi.required(),
		courseId: Joi.required(),
		tasId: Joi.optional(),
		startDate: Joi.optional(),
		endDate: Joi.optional(),
		status: Joi.required(),
		weeks: Joi.optional(),
		durationHours: Joi.optional(),
		note: Joi.optional(),
		createDate: Joi.optional()
	};
	// return ressult of validation to result
	return Joi.validate(enrolment, schema);
}
*/

module.exports = router;