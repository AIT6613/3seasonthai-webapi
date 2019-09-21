//Initiallising node modules
const Joi = require('joi'); // use for validation
const express = require("express");
const router = express.Router();

var sql = require('../db.js');

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
  res.send('Setting');
});


// Retrieve all order 
router.get('/get/settingDetail', (req, res) => {

  sql.query('SELECT * FROM OPENINGHOURS', function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'opening hour.' });
  });
});

// update open/close status
router.put('/update/onlineStatus', function (req, res) {
  let isOpen = req.body.status;
  console.log(isOpen);
  if (!isOpen) {
    return res.status(400).send({ error: isOpen, message: 'Please provide online status with integer number 0=close or 1=open' });
  }
  sql.query("UPDATE OPENINGHOURS SET ? WHERE id = ?", [{ isOpen: isOpen }, 1], function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'order has been updated successfully.' });
  });
});

module.exports = router;