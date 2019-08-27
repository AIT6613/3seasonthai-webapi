//Initiallising node modules
const express = require("express");
const app = express();
const bodyParser = require('body-parser');

// Routes
app.use('/api', require('./routes/index'));
//app.use('/api/states', require('./routes/states'));


//Setting up server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Listening on port ' + port + '...'));
