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
  res.send('Menus');
});


// Retrieve all product 
router.get('/get/all', (req, res) => {
  //if (!req.body.token || req.body.token != webToken) throw "You don't have permission";

  sql.query('SELECT * FROM MENUITEMS', function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'All menu list.' });
  });
});

// Retrieve all munu type 
router.get('/get/all/menuType', (req, res) => {
  //if (!req.body.token || req.body.token != webToken) throw "You don't have permission";

  sql.query('SELECT * FROM MENUTYPES', function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'All menu type list.' });
  });
});

// Retrieve all meat type 
router.get('/get/all/meatType', (req, res) => {
  //if (!req.body.token || req.body.token != webToken) throw "You don't have permission";

  sql.query('SELECT * FROM MEATTYPES', function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'All meat type list.' });
  });
});

router.get('/get/menu/:id', (req, res) => {
  //if (!req.body.token || req.body.token != webToken) throw "You don't have permission";
  var id = req.params.id

  sql.query('SELECT * FROM MENUITEMS WHERE id=' + id, function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'menu detail.' });
  });
});

router.get('/get/menuByType/:menuTypeId', (req, res) => {
  //if (!req.body.token || req.body.token != webToken) throw "You don't have permission";
  var menuTypeId = req.params.menuTypeId

  sql.query('SELECT * FROM MENUITEMS WHERE menuTypeId=' + menuTypeId, function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'menu list detail.' });
  });
});

// Add a new product  
router.post('/addNew', function (req, res) {
  let menu = req.body;
  let pictureName = req.body.pictureName;
  if (!pictureName)
  {
    pictureName = "";
  }
  
  console.log(menu);
  if (!menu) {
    return res.status(400).send({ error: true, message: 'Please provide product' });
  }
  sql.query("INSERT INTO MENUITEMS SET ? ", { name: menu.name, description: menu.description, pictureName: pictureName, price: menu.price, isAvailable: menu.isAvailable, isSelectMeatChoice: menu.isSelectMeatChoice, menuTypeId: menu.menuTypeId }, function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'New menu has been created successfully.' });
  });
});

// update product
router.put('/update', function (req, res) {
  let menuId = req.body.id;
  let menu = req.body;
  if (!menuId || !menu) {
    return res.status(400).send({ error: menu, message: 'Please provide menu and menuId' });
  }
  sql.query("UPDATE MENUITEMS SET ? WHERE id = ?", [{ name: menu.name, description: menu.description, pictureName: menu.pictureName, price: menu.price, isAvailable: menu.isAvailable, isSelectMeatChoice: menu.isSelectMeatChoice, menuTypeId: menu.menuTypeId }, menuId], function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'menu has been updated successfully.' });
   });
  });

// delete product
router.delete('/delete', function (req, res) {
  let id = req.body.id;
  // check if not have product id, return error
  if (!id) {
    return res.status(400).send({ error: true, message: 'Please provide productId' });
  }
  // delete record on database by id
  sql.query('DELETE FROM MENUITEMS WHERE id = ?', [id], function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'Product has been delete successfully.' });
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