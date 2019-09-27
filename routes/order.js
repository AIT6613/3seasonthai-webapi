//Initiallising node modules
const Joi = require('joi'); // use for validation
const express = require("express");
const router = express.Router();
const moment = require("moment");

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
  res.send('Orders');
});


// Retrieve all order 
router.get('/get/all/order', (req, res) => {

  sql.query('SELECT * FROM ORDERS', function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'order list.' });
  });
});

// retrived order summary by date
// Retrieve all order list
router.get('/get/summaryOrder/:year/:month', (req, res) => {
  var y = req.params.year;
  var m = req.params.month;
  
  sql.query('SELECT DATE_FORMAT(orderDate,"%d-%m-%Y") AS orderDate, SUM(totalAmount) AS sumTotalAmount FROM `ORDERS` WHERE MONTH(orderDate)=' + m + ' AND YEAR(orderDate)='+y+' GROUP By DATE_FORMAT(orderDate,"%d-%m-%Y") ORDER BY orderDate', function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'order list.' });
  });
  
});

// Retrieve all order list
router.get('/get/all/activeOrder', (req, res) => {
  //var d = getShortDateYYYYMMDD();
  
  /*
  sql.query('SELECT * FROM ORDERS WHERE DATE_FORMAT(ORDERS.orderDate, "%Y-%m-%d") = "'+d+'" AND (status<>"Finish" AND status<>"Cancel")', function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'order list.' });
  });
  */

  sql.query('SELECT * FROM ORDERS WHERE status<>"Finish" AND status<>"Cancel"', function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'order list.' });
  });
});

// Retrieve all order by date
router.get('/get/orderByDate/:searchDate', (req, res) => {
  var d = moment(req.params.searchDate).format("DD-MM-YYYY");
  console.log(d);

  sql.query('SELECT * FROM ORDERS WHERE DATE_FORMAT(ORDERS.orderDate, "%d-%m-%Y") = "'+d+'"', function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'order list.' });
  });
  
});

router.get('/get/order/:id', (req, res) => {

  var orderId = req.params.id

  sql.query('SELECT * FROM ORDERS WHERE id=' + orderId, function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'order detail.' });
  });
});

// Add a new order  
router.post('/addNew/order', function (req, res) {
  let order = req.body;
  let orderStatus = 'New Order';
  console.log(order);
  if (!order) {
    return res.status(400).send({ error: true, message: 'Please provide order' });
  }
  sql.query("INSERT INTO ORDERS SET ? ", { totalAmount: order.totalAmount, status: orderStatus }, function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'New order has been created successfully.' });
  });
});

// update order
router.put('/update/order', function (req, res) {
  let orderId = req.body.id;
  let order = req.body;
  //fix data time format
  order.orderDate = moment(order.orderDate).format("YYYY-MM-DD HH:mm:ss");
  console.log(order.orderDate);

  if (!orderId || !order) {
    return res.status(400).send({ error: order, message: 'Please provide order and orderId' });
  }
  sql.query("UPDATE ORDERS SET ? WHERE id = ?", [{ orderDate: order.orderDate, totalAmount: order.totalAmount, deliveryAddressId: order.deliveryAddressId }, orderId], function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'order has been updated successfully.' });
  });
});

// update order status
router.put('/update/orderStatus', function (req, res) {
  let orderId = req.body.id;
  let status = req.body.status;
  if (!orderId || !status) {
    return res.status(400).send({ error: order, message: 'Please provide orderId and status' });
  }
  sql.query("UPDATE ORDERS SET ? WHERE id = ?", [{ status: status }, orderId], function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'Order status has been updated successfully.' });
  });
});

// delete order
router.delete('/delete/order', function (req, res) {
  let orderId = req.body.id;
  // check if not have product id, return error
  if (!orderId) {
    return res.status(400).send({ error: true, message: 'Please provide orderId' });
  }
  // delete record on database by id
  sql.query('DELETE FROM ORDERS WHERE id = ?', [orderId], function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'Order has been updated successfully.' });
  });
});




// Retrieve all order details
router.get('/get/all/orderDetail', (req, res) => {

  sql.query('SELECT * FROM ORDERDETAILS', function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'order detail list.' });
  });
});

// Retrieve all order list
router.get('/get/all/orderList', (req, res) => {

  sql.query('SELECT ORDERDETAILS.id, ORDERDETAILS.orderId, ORDERDETAILS.menuId, ORDERDETAILS.meatTypeId, ORDERDETAILS.qty, ORDERDETAILS.price, ORDERDETAILS.amount, MENUITEMS.name as menuName, MEATTYPES.name as meatTypeName FROM ORDERDETAILS INNER JOIN MENUITEMS ON ORDERDETAILS.menuId = MENUITEMS.id LEFT JOIN MEATTYPES ON ORDERDETAILS.meatTypeId = MEATTYPES.id', function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'order detail list.' });
  });
});

router.get('/get/orderDetail/:orderId', (req, res) => {
  var orderId = req.params.orderId

  sql.query('SELECT * FROM ORDERDETAILS WHERE orderId=' + orderId, function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'order detail list by order id.' });
  });
});

// Add a new orderDetail  
router.post('/addNew/orderDetail', function (req, res) {
  let orderDetail = req.body;
  let orderId = req.body.orderId;
  let menuId = req.body.menuId;
  console.log(orderDetail);
  if (!orderDetail || !orderId || !menuId) {
    return res.status(400).send({ error: true, message: 'Please provide orderId, menuId and order detail' });
  }
  sql.query("INSERT INTO ORDERDETAILS SET ? ", { orderId: orderId, menuId: menuId, meatTypeId: orderDetail.meatTypeId, qty: orderDetail.qty, price: orderDetail.price, amount: orderDetail.amount }, function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'New order details has been created successfully.' });
  });
});

// update order detail
router.put('/update/orderDetail', function (req, res) {
  let orderDetailId = req.body.id;
  let orderDetail = req.body;
  if (!orderDetailId || !orderDetail) {
    return res.status(400).send({ error: order, message: 'Please provide orderDetail and orderDetailId' });
  }
  sql.query("UPDATE ORDERDETAILS SET ? WHERE id = ?", [{ orderId: orderDetail.orderId, menuId: orderDetail.menuId, meatTypeId: orderDetail.meatTypeId, qty: orderDetail.qty, price: orderDetail.price, amount: orderDetail.amount }, orderDetailId], function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'order detail has been updated successfully.' });
  });
});

// delete orderdetail
router.delete('/delete/orderDetail', function (req, res) {
  let orderDetailId = req.body.id;
  // check if not have product id, return error
  if (!orderDetailId) {
    return res.status(400).send({ error: true, message: 'Please provide orderDetailId' });
  }
  // delete record on database by id
  sql.query('DELETE FROM ORDERDETAILS WHERE id = ?', [orderDetailId], function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'Order detail has been delete successfully.' });
  });
});

//  delete ordrdetail by orderId
router.delete('/delete/orderDetailByOrderId', function (req, res) {
  let orderId = req.body.id;
  // check if not have product id, return error
  if (!orderId) {
    return res.status(400).send({ error: true, message: 'Please provide orderId' });
  }
  // delete record on database by id
  sql.query('DELETE FROM ORDERDETAILS WHERE orderId = ?', [orderId], function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'Order detail has been delete by order id successfully.' });
  });


});



// Delivery Address
// Retrieve all delivery address
router.get('/get/all/deliveryAddress', (req, res) => {
  //if (!req.body.token || req.body.token != webToken) throw "You don't have permission";

  sql.query('SELECT * FROM DELIVERYADDRESSES', function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'order delivery address.' });
  });
});

router.get('/get/deliveryAddress/:deliveryAddressId', (req, res) => {
  //if (!req.body.token || req.body.token != webToken) throw "You don't have permission";
  var deliveryAddressId = req.params.deliveryAddressId

  sql.query('SELECT * FROM DELIVERYADDRESSES WHERE deliveryAddressId=' + deliveryAddressId, function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'delivery address list by order id.' });
  });
});

// Add a new delivery address  
router.post('/addNew/deliveryAddress', function (req, res) {
  let deliveryAddress = req.body;

  console.log(deliveryAddress);
  if (!deliveryAddress) {
    return res.status(400).send({ error: true, message: 'Please provide delivery address' });
  }
  sql.query("INSERT INTO DELIVERYADDRESSES SET ? ", { address: deliveryAddress.address, contactName: deliveryAddress.contactName, telephone: deliveryAddress.telephone}, function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'New delivery address has been created successfully.' });
  });
});

// update delivery address
router.put('/update/deliveryAddress', function (req, res) {
  let deliveryAddressId = req.body.id;
  let deliveryAddress = req.body;
  if (!deliveryAddressId || !deliveryAddress) {
    return res.status(400).send({ error: order, message: 'Please provide deliveryAddress and deliveryAddressId' });
  }
  sql.query("UPDATE DELIVERYADDRESSES SET ? WHERE id = ?", [{ address: deliveryAddress.address, contactName: deliveryAddress.contactName, telephone: deliveryAddress.telephone }, deliveryAddressId], function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'delivery address has been updated successfully.' });
  });
});

// delete delivery address
router.delete('/delete/deliveryAddress', function (req, res) {
  let deliveryAddressId = req.body.id;
  // check if not have delivery address id, return error
  if (!deliveryAddressId) {
    return res.status(400).send({ error: true, message: 'Please provide deliveryAddressId' });
  }
  // delete record on database by id
  sql.query('DELETE FROM DELIVERYADDRESSES WHERE id = ?', [deliveryAddressId], function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'Delivery address has been delete successfully.' });
  });
});

function getShortDateYYYYMMDD() {
  var shortDate;
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1;

  var yyyy = today.getFullYear();
  shortDate = yyyy.toString();
  if (mm < 10) {
    shortDate += '-0' + mm;
  } else {
    shortDate += '-' + mm;
  }
  if (dd < 10) {
    shortDate += '-0' + dd;
  } else {
    shortDate += '-' + dd;
  }

  return shortDate;
}




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