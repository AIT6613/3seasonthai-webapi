//Initiallising node modules
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

// Routes
app.use('/api', require('./routes/index'));
app.use('/api/users', require('./routes/user'));
app.use('/api/menus', require('./routes/menu'));
app.use('/api/orders', require('./routes/order'));
app.use('/api/settings', require('./routes/setting'));


//Setting up server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Listening on port ' + port + '...'));
