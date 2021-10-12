const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const path = require('path');
const cors = require('cors');
const routes = require('./routes');
require('dotenv').config();

//Express app
const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(express.json());
//Cors chillt in der Middleware
app.use(cors());
//Routen
app.use('/', routes);

//Port
const PORT = 2410;
console.log('Port: ' + PORT);
app.listen(PORT);
