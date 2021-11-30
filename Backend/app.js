const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const routes = require('./routes');
const expressSession = require('express-session');

require('dotenv').config();

//Express app
const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(express.json());
//Cors chillt in der Middleware
app.use(cors());
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
const PORT = 2410;
app.listen(PORT, () => {
  console.log(`Node-Server hört auf Port: ${PORT}`);
});
