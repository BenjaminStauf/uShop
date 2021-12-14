const express = require('express');
const morgan = require('morgan');
// const helmet = require('helmet');
const path = require('path');
const cors = require('cors');
const routes = require('./routes');
const expressSession = require('express-session');

require('dotenv').config();

//Express app
const app = express();

app.use(morgan('dev'));
// app.use(helmet());
app.use(express.json());
//Cors chillt in der Middleware
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
//Express-Session
app.use(
  expressSession({
    secret: 'uShopSecretKey',
    name: 'uShopSession',
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 2 * 1000 * 60 * 60,
      httpOnly: false,
      sameSite: true,
    },
  }),
);
//Routen
app.use('/', routes);

//Port
const PORT = process.env.PORT || 2410;
app.listen(PORT, () => {
  console.log(`Node-Server hört auf Port: ${PORT}`);
});
