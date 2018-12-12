const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const mysqlx = require('@mysql/xdevapi');


const findUser = (username, callback) => {
  const user = { username: null, passwordHash: null };
  let mysqlSession;
  console.log(username);
  mysqlx
    .getSession(process.env.JAWSDB_URL)
    .then((session) => {
      console.log(session);
      mysqlSession = session;
      session.sql(`USE ${process.env.DB_NAME}`).execute();
      return session.sql('SELECT * FROM users WHERE '
          + `username = "${username}"`)
        .execute((row) => {
          user.username = row[1]; // eslint-disable-line prefer-destructuring
          user.passwordHash = row[2]; // eslint-disable-line prefer-destructuring
        })
        .then(() => {
          if (username === user.username) {
            return callback(null, user);
          }
          return callback(null);
        });
    })
    .then(() => mysqlSession.close())
    .catch((err) => {
      callback(err);
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
