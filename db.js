'user strict';

var mysql = require('mysql');

// get database config
var config = {
  host: require('./configs/key').dbServer,
	user: require('./configs/key').dbUser,
	password: require('./configs/key').dbPassword,
  database: require('./configs/key').dbDatabase,
  port: require('./configs/key').dbPort,
}

//msql db connection
var dbConn = mysql.createConnection(config);

dbConn.connect(function(err) {
    if (err) throw err;
});

module.exports = dbConn;