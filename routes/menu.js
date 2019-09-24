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

  sql.query('SELECT * FROM MENUITEMS', function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'All menu list.' });
  });
});

router.get('/get/menu/:id', (req, res) => {
  var id = req.params.id

  sql.query('SELECT * FROM MENUITEMS WHERE id=' + id, function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'menu detail.' });
  });
});

router.get('/get/menuByType/:menuTypeId', (req, res) => {
  var menuTypeId = req.params.menuTypeId

  sql.query('SELECT * FROM MENUITEMS WHERE menuTypeId=' + menuTypeId, function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'menu list detail.' });
  });
});

// Add a new menu  
router.post('/addNew', function (req, res) {
  let menu = req.body;
  let pictureName = req.body.pictureName;
  if (!pictureName) {
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
router.delete('/delete/:id', function (req, res) {
  let id = req.params.id;
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

// SYMBOL ===============================================================================
// Retrieve all symbol
router.get('/get/all/symbol', (req, res) => {
  sql.query('SELECT * FROM SYMBOLTYPES', function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'All symbol list.' });
  });
});

// Retrived symbol by id
router.get('/get/symbol/:id', (req, res) => {
  var id = req.params.id

  sql.query('SELECT * FROM SYMBOLTYPES WHERE id=' + id, function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'symbol detail.' });
  });
});

// Add a new symbol  
router.post('/addNew/symbol', function (req, res) {
  let symbol = req.body;

  if (!symbol) {
    return res.status(400).send({ error: true, message: 'Please provide symbol' });
  }
  sql.query("INSERT INTO SYMBOLTYPES SET ? ", { name: symbol.name }, function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'New symbol has been created successfully.' });
  });
});

// update symbol
router.put('/update/symbol', function (req, res) {
  let symbolId = req.body.id;
  let symbol = req.body;
  if (!symbolId || !symbol) {
    return res.status(400).send({ error: symbol, message: 'Please provide symbol and symbolId' });
  }
  sql.query("UPDATE SYMBOLTYPES SET ? WHERE id = ?", [{ name: symbol.name }, symbolId], function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'symbol has been updated successfully.' });
  });
});

// delete symbol
router.delete('/delete/symbol/:id', function (req, res) {
  let id = req.params.id
  // check if not have symbol id, return error
  if (!id) {
    return res.status(400).send({ error: true, message: 'Please provide symbol id' });
  }
  // delete record on database by id
  sql.query('DELETE FROM SYMBOLTYPES WHERE id = ?', [id], function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'symbol has been delete successfully.' });
  });
});


// MenuSymbols ===============================================================================
// Retrieve all menu symbol
router.get('/get/all/menuSymbol', (req, res) => {
  sql.query('SELECT * FROM MENUSYMBOLS', function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'All menu symbol list.' });
  });
});

// Retrived menu symbol by id
router.get('/get/menuSymbol/:id', (req, res) => {
  var id = req.params.id

  sql.query('SELECT * FROM MENUSYMBOLS WHERE id=' + id, function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'menu symbol detail.' });
  });
});

// Add a new menu symbol  
router.post('/addNew/menuSymbol', function (req, res) {
  let menuSymbol = req.body;

  if (!menuSymbol) {
    return res.status(400).send({ error: true, message: 'Please provide menu symbol' });
  }
  sql.query("INSERT INTO MENUSYMBOLS SET ? ", { menuItemId: menuSymbol.menuItemId, symbolId: menuSymbol.symbolId }, function (error, results, fields) {
    if (error) {
      return res.status(400).send({ error: true, errorDetail: error });
    }
    return res.send({ error: false, data: results, message: 'New symbol has been created successfully.' });
  });
});

// update menu symbol
router.put('/update/menuSymbol', function (req, res) {
  let menuSymbolId = req.body.id;
  let menuSymbol = req.body;
  if (!menuSymbolId || !menuSymbol) {
    return res.status(400).send({ error: symbol, message: 'Please provide menu menuSymbol and menuSymbolId' });
  }
  sql.query("UPDATE MENUSYMBOLS SET ? WHERE id = ?", [{ menuItemId: menuSymbol.menuItemId, symbolId: menuSymbol.symbolId }, menuSymbolId], function (error, results, fields) {
    if (error) {
      return res.status(400).send({ error: true, errorDetail: error });
    }
    return res.send({ error: false, data: results, message: 'menu symbol has been updated successfully.' });
  });
});

// delete menu symbol
router.delete('/delete/menuSymbol/:id', function (req, res) {
  let id = req.params.id;
  // check if not have symbol id, return error
  if (!id) {
    return res.status(400).send({ error: true, message: 'Please provide menu symbol id' });
  }
  // delete record on database by id
  sql.query('DELETE FROM MENUSYMBOLS WHERE id = ?', [id], function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'symbol has been delete successfully.' });
  });
});

// MEATTYPES ===============================================================================
// Retrieve all meat type 
router.get('/get/all/meatType', (req, res) => {

  sql.query('SELECT * FROM MEATTYPES', function (error, results, fields) {
    if (error) {
      return res.status(400).send({ error: true, errorDetail: error });
    }
    return res.send({ error: false, data: results, message: 'All meat type list.' });
  });
});

// Retrived meat type by id
router.get('/get/meatType/:id', (req, res) => {
  var id = req.params.id

  sql.query('SELECT * FROM MEATTYPES WHERE id=' + id, function (error, results, fields) {
    if (error) {
      return res.status(400).send({ error: true, errorDetail: error });
    }
    return res.send({ error: false, data: results, message: 'meat type detail.' });
  });
});

// Add a new meat type  
router.post('/addNew/meatType', function (req, res) {
  let meatType = req.body;

  if (!meatType) {
    return res.status(400).send({ error: true, message: 'Please provide meaType' });
  }
  sql.query("INSERT INTO MEATTYPES SET ? ", { name: meatType.name }, function (error, results, fields) {
    if (error) {
      return res.status(400).send({ error: true, errorDetail: error });
    }
    return res.send({ error: false, data: results, message: 'New meat type has been created successfully.' });
  });
});

// update meat type
router.put('/update/meatType', function (req, res) {
  let meatTypeId = req.body.id;
  let meatType = req.body;
  if (!meatTypeId || !meatType) {
    return res.status(400).send({ error: meatType, message: 'Please provide meatType and meatTypelId' });
  }
  sql.query("UPDATE MEATTYPES SET ? WHERE id = ?", [{ name: meatType.name }, meatTypeId], function (error, results, fields) {
    if (error) {
      return res.status(400).send({ error: true, errorDetail: error });
    }
    return res.send({ error: false, data: results, message: 'meat type has been updated successfully.' });
  });
});

// delete meat type
router.delete('/delete/meatType/:id', function (req, res) {
  let id = req.params.id;
  // check if not have symbol id, return error
  if (!id) {
    return res.status(400).send({ error: true, message: 'Please provide meat type id' });
  }
  // delete record on database by id
  sql.query('DELETE FROM MEATTYPES WHERE id = ?', [id], function (error, results, fields) {
    if (error) {
      return res.status(400).send({ error: true, errorDetail: error });
    }
    return res.send({ error: false, data: results, message: 'meat type has been delete successfully.' });
  });
});

// MENUCHOICEPRICES ===============================================================================
// Retrieve all menu choice
router.get('/get/all/menuChoice', (req, res) => {

  sql.query('SELECT * FROM MENUCHOICES', function (error, results, fields) {
    if (error) {
      return res.status(400).send({ error: true, errorDetail: error });
    }
    return res.send({ error: false, data: results, message: 'All menu choice list.' });
  });
});

// Retrived menu choice by id
router.get('/get/menuChoice/:id', (req, res) => {
  var id = req.params.id

  sql.query('SELECT * FROM MENUCHOICES WHERE id=' + id, function (error, results, fields) {
    if (error) {
      return res.status(400).send({ error: true, errorDetail: error });
    }
    return res.send({ error: false, data: results, message: 'menu choice detail.' });
  });
});

// Retrived menu choice by menu id
router.get('/get/menuChoiceByMenuId/:id', (req, res) => {
  var id = req.params.id

  sql.query('SELECT * FROM MENUCHOICES WHERE menuId=' + id, function (error, results, fields) {
    if (error) {
      return res.status(400).send({ error: true, errorDetail: error });
    }
    return res.send({ error: false, data: results, message: 'menu choice list filter by menu id.' });
  });
});

// Add a new menu choice
router.post('/addNew/menuChoice', function (req, res) {
  let menuChoice = req.body;

  if (!menuChoice) {
    return res.status(400).send({ error: true, message: 'Please provide menuChoice' });
  }
  sql.query("INSERT INTO MENUCHOICES SET ? ", { menuId: menuChoice.menuId, meatTypeId: menuChoice.meatTypeId, price: menuChoice.price }, function (error, results, fields) {
    if (error) {
      return res.status(400).send({ error: true, errorDetail: error });
    }
    return res.send({ error: false, data: results, message: 'New menu choice has been created successfully.' });
  });
});

// update menu choice
router.put('/update/menuChoice', function (req, res) {
  let menuChoiceId = req.body.id;
  let menuChoice = req.body;
  if (!menuChoiceId || !menuChoice) {
    return res.status(400).send({ error: menuChoice, message: 'Please provide menuChoice and menuChoiceId' });
  }
  sql.query("UPDATE MENUCHOICES SET ? WHERE id = ?", [{ menuId: menuChoice.menuId, meatTypeId: menuChoice.meatTypeId, price: menuChoice.price }, menuChoiceId], function (error, results, fields) {
    if (error) {
      return res.status(400).send({ error: true, errorDetail: error });
    }
    return res.send({ error: false, data: results, message: 'menu choice has been updated successfully.' });
  });
});

// delete menu choice
router.delete('/delete/menuChoice/:id', function (req, res) {
  let id = req.params.id;
  // check if not have symbol id, return error
  if (!id) {
    return res.status(400).send({ error: true, message: 'Please provide menu choice id' });
  }
  // delete record on database by id
  sql.query('DELETE FROM MENUCHOICES WHERE id = ?', [id], function (error, results, fields) {
    if (error) {
      return res.status(400).send({ error: true, errorDetail: error });
    }
    return res.send({ error: false, data: results, message: 'menu choice has been delete successfully.' });
  });
});

// delete menu choice by menu id
router.delete('/delete/menuChoiceByMenuId/:id', function (req, res) {
  let id = req.params.id;
  // check if not have symbol id, return error
  if (!id) {
    return res.status(400).send({ error: true, message: 'Please provide menu choice id' });
  }
  // delete record on database by id
  sql.query('DELETE FROM MENUCHOICES WHERE menuId = ?', [id], function (error, results, fields) {
    if (error) {
      return res.status(400).send({ error: true, errorDetail: error });
    }
    return res.send({ error: false, data: results, message: 'menu choice has been delete by menu id successfully.' });
  });
});


// MENUTYPES ===============================================================================
// Retrieve all munu type 
router.get('/get/all/menuType', (req, res) => {

  sql.query('SELECT * FROM MENUTYPES', function (error, results, fields) {
    if (error) {
      return res.status(400).send({ error: true, errorDetail: error });
    }
    return res.send({ error: false, data: results, message: 'All menu type list.' });
  });
});

// Retrived menu type by id
router.get('/get/menuType/:id', (req, res) => {
  var id = req.params.id

  sql.query('SELECT * FROM MENUTYPES WHERE id=' + id, function (error, results, fields) {
    if (error) {
      return res.status(400).send({ error: true, errorDetail: error });
    }
    return res.send({ error: false, data: results, message: 'menu type detail.' });
  });
});

// Add a new menu type
router.post('/addNew/menuType', function (req, res) {
  let menuType = req.body;

  if (!menuType) {
    return res.status(400).send({ error: true, message: 'Please provide menuType' });
  }
  sql.query("INSERT INTO MENUTYPES SET ? ", { name: menuType.name }, function (error, results, fields) {
    if (error) {
      return res.status(400).send({ error: true, errorDetail: error });
    }
    return res.send({ error: false, data: results, message: 'New menu type has been created successfully.' });
  });
});

// update menu type
router.put('/update/menuType', function (req, res) {
  let menuTypeId = req.body.id;
  let menuType = req.body;
  if (!menuTypeId || !menuType) {
    return res.status(400).send({ error: menuType, message: 'Please provide menuType and menuTypeId' });
  }
  sql.query("UPDATE MENUTYPES SET ? WHERE id = ?", [{ name: menuType.name }, menuTypeId], function (error, results, fields) {
    if (error) {
      return res.status(400).send({ error: true, errorDetail: error });
    }
    return res.send({ error: false, data: results, message: 'menu type has been updated successfully.' });
  });
});

// delete menu type
router.delete('/delete/menuType/:id', function (req, res) {
  let id = req.params.id;
  // check if not have symbol id, return error
  if (!id) {
    return res.status(400).send({ error: true, message: 'Please provide menu type id' });
  }
  // delete record on database by id
  sql.query('DELETE FROM MENUTYPES WHERE id = ?', [id], function (error, results, fields) {
    if (error) {
      return res.status(400).send({ error: true, errorDetail: error });
    }
    return res.send({ error: false, data: results, message: 'menu type has been delete successfully.' });
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