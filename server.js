if (process.env.NODE_ENV === 'development') {
  require('dotenv').load(); // eslint-disable-line global-require
}

const express = require('express');
const path = require('path');

const app = express();
const passport = require('passport');
app.use(require('cookie-parser')());
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const bodyParser = require('body-parser');

require('./source/server/auth').init(app);

const options = {
  host: process.env.DB_HOST,
  port: 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

const sessionStore = new MySQLStore(options);

app.use(session({
  key: process.env.SESSION_KEY,
  secret: process.env.SESSION_SECRET,
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());

app.use(passport.session());

app.use(express.static(path.join(`${__dirname}/source`)));

app.use(express.static(path.join(`${__dirname}/dist`)));

app.use(bodyParser.json());

require('./source/server/routes').init(app);

app.listen(3000, () => {
  console.log('Example app listening on port 3000!'); // eslint-disable-line no-console
});
