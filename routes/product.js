//Initiallising node modules
const Joi = require('joi'); // use for validation
const express = require("express");
const router = express.Router();

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
  res.send('Products');
});


// Retrieve all users 
router.get('/get/all', (req, res) => {
  //if (!req.body.token || req.body.token != webToken) throw "You don't have permission";

  sql.query('SELECT * FROM MENUITEMS', function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'product list.' });
  });
});

router.get('/get/product/:id', (req, res) => {
  //if (!req.body.token || req.body.token != webToken) throw "You don't have permission";
  var productId = req.params.id

  sql.query('SELECT * FROM MENUITEMS WHERE id=' + productId, function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'product list.' });
  });
});

// Add a new product  
router.post('/addNew', function (req, res) {
  let product = req.body;
  console.log(product);
  if (!product) {
    return res.status(400).send({ error: true, message: 'Please provide product' });
  }
  sql.query("INSERT INTO MENUITEMS SET ? ", { name: product.name, description: product.description, pictureName: product.pictureName, price: product.price, isAvailable: product.isAvailable }, function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'New product has been created successfully.' });
  });
});

// update product
router.put('/update', function (req, res) {
  let productId = req.body.id;
  let product = req.body;
  if (!productId || !product) {
    return res.status(400).send({ error: product, message: 'Please provide product and productId' });
  }
  sql.query("UPDATE MENUITEMS SET ? WHERE id = ?", [{ name: product.name, description: product.description, pictureName: product.pictureName, price: product.price, isAvailable: product.isAvailable }, productId], function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'product has been updated successfully.' });
   });
  });

// delete product
router.delete('/delete', function (req, res) {
  let productId = req.body.id;
  // check if not have product id, return error
  if (!productId) {
    return res.status(400).send({ error: true, message: 'Please provide productId' });
  }
  // delete record on database by id
  sql.query('DELETE FROM MENUITEMS WHERE id = ?', [productId], function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'Product has been updated successfully.' });
  });
});


/*
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