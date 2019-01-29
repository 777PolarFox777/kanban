const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const mysql = require('mysql');

const connection = mysql.createConnection(process.env.CLEARDB_DATABASE_URL);

const findUser = (username, callback) => {
  const user = { username: null, passwordHash: null };
  connection.query('SELECT * FROM users WHERE '
          + `username = "${username}"`, (error, result) => {
    if (error) callback(error);

    user.username = result[0].username; // eslint-disable-line prefer-destructuring
    user.passwordHash = result[0].password; // eslint-disable-line prefer-destructuring

    if (username === user.username) {
      return callback(null, user);
    }
    return callback(null);
  });
};

passport.serializeUser((user, cb) => {
  cb(null, user.username);
});

passport.deserializeUser((username, cb) => {
  findUser(username, cb);
});

const initPassport = () => {
  passport.use(new LocalStrategy(
    (username, password, done) => {
      findUser(username, (err, user) => {
        if (err) {
          return done('Unknown error');
        }

        // User not found
        if (!user) {
          console.log('User not found'); // eslint-disable-line no-console
          return done(null, false);
        }

        // Always use hashed passwords and fixed time comparison
        bcrypt.compare(password, user.passwordHash, (errc, isValid) => {
          if (errc) {
            return done(errc);
          }
          if (!isValid) {
            return done('Incorrect password!', false);
          }
          return done(null, user);
        });

        return null;
      });
    },
  ));
};

module.exports = initPassport;
