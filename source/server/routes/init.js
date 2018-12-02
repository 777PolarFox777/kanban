const path = require('path');
const mysqlx = require('@mysql/xdevapi');
const passport = require('passport');
const ensureLogin = require('connect-ensure-login');

const baseDir = path.join(__dirname, '../../../');

const initRoutes = (app) => {
  app.post('/login',
    (req, res) => {
      passport.authenticate('local', (err, user) => {
        if (err) {
          return res.json({ error: err });
        }
        if (!user) {
          return res.json({ error: 'No such user' });
        }
        req.logIn(user, (errc) => {
          if (errc) {
            return res.json({ error: err });
          }
          return res.json({ user: req.user.username });
        });
        return null;
      })(req, res);
    });

  app.get('/login', (req, res) => {
    res.redirect('/');
  });

  app.get('/logout',
    (req, res) => {
      req.logout();
      res.status(401).send('logged out');
    });

  app.get('/', (req, res) => {
    res.sendFile(path.join(baseDir, 'index.html'));
  });

  app.get('/cards', ensureLogin.ensureLoggedIn(), (req, res) => {
    const formedJson = [];
    const tasks = [];
    const { username } = req.user;
    let mysqlSession;
    mysqlx
      .getSession(`${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}`)
      .then((mySession) => {
        mysqlSession = mySession;
      })
      .then(() => {
        mysqlSession.sql(`USE ${process.env.DB_NAME}`).execute();
        mysqlSession.sql('SELECT * FROM tasks '
       + 'LEFT JOIN cards ON tasks.card_id = cards.id '
        + 'LEFT JOIN users ON cards.user_id = users.id '
         + `WHERE username = "${username}"`)
          .execute((row) => {
            tasks.push({
              id: row[0],
              name: row[1],
              done: row[2],
              card_id: row[3],
            });
          });
      })
      .then(() => mysqlSession.sql('SELECT * FROM cards '
     + 'LEFT JOIN users ON cards.user_id = users.id '
       + `WHERE username = "${username}"`)
        .execute((row) => {
          formedJson.push({
            id: row[0],
            title: row[1],
            description: row[2],
            status: row[3],
            tasks: tasks.filter(el => el.card_id === row[0]),
          });
        }))
      .then(() => {
        res.json({ cards: formedJson, user: username });
      })
      .catch((err) => {
        console.log(err); // eslint-disable-line no-console
      });
  });

  app.post('/createCard', ensureLogin.ensureLoggedIn(), (req, res) => {
    let mysqlSession;
    mysqlx
      .getSession(`${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}`)
      .then((mySession) => {
        mysqlSession = mySession;
      })
      .then(() => {
        mysqlSession.sql(`USE ${process.env.DB_NAME}`).execute();
        return mysqlSession.sql('SELECT id FROM users '
        + `WHERE username = "${req.user.username}"`)
          .execute((row) => {
            [req.body.userId] = row;
          });
      })
      .then(() => {
        const { card } = req.body;
        return mysqlSession.sql('INSERT INTO cards (id, title, description, status, user_id) '
        + `VALUES (0, "${card.title}", "${card.description}", "${card.status}", ${req.body.userId})`)
          .execute();
      })
      .then(() => mysqlSession.sql('SELECT id FROM cards ORDER BY id DESC LIMIT 1')
        .execute((row) => {
          [req.body.cardId] = row;
        }))
      .then(() => {
        res.json({ id: req.body.cardId, ok: '200' });
      })
      .catch((err) => {
        console.log(err); // eslint-disable-line no-console
      });
  });

  app.post('/deleteCard', ensureLogin.ensureLoggedIn(), (req, res) => {
    let mysqlSession;
    mysqlx
      .getSession(`${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}`)
      .then((mySession) => {
        mysqlSession = mySession;
      })
      .then(() => mysqlSession.sql(`USE ${process.env.DB_NAME}`).execute())
      .then(() => mysqlSession.sql('DELETE FROM cards '
        + `WHERE id = "${req.body.cardId}"`)
        .execute())
      .then(() => {
        res.json({ ok: '200' });
      })
      .catch((err) => {
        console.log(err); // eslint-disable-line no-console
      });
  });

  app.post('/addTask', ensureLogin.ensureLoggedIn(), (req, res) => {
    let mysqlSession;
    mysqlx
      .getSession(`${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}`)
      .then((mySession) => {
        mysqlSession = mySession;
      })
      .then(() => {
        mysqlSession.sql(`USE ${process.env.DB_NAME}`).execute();
        const { task } = req.body;
        mysqlSession.sql('INSERT INTO tasks (id, name, done, card_id) '
        + `VALUES (0, "${task.name}", ${+task.done}, ${req.body.cardId})`)
          .execute();
      })
      .then(() => {
        mysqlSession.sql('SELECT id FROM tasks ORDER BY id DESC LIMIT 1')
          .execute((row) => {
            res.json({ id: row[0], ok: '200' });
          });
      })
      .catch((err) => {
        console.log(err); // eslint-disable-line no-console
      });
  });

  app.post('/deleteTask', ensureLogin.ensureLoggedIn(), (req) => {
    let mysqlSession;
    mysqlx
      .getSession(`${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}`)
      .then((mySession) => {
        mysqlSession = mySession;
      })
      .then(() => {
        mysqlSession.sql(`USE ${process.env.DB_NAME}`).execute();
        mysqlSession.sql('DELETE FROM tasks '
        + `WHERE id = ${req.body.taskId}`)
          .execute();
      })
      .catch((err) => {
        console.log(err); // eslint-disable-line no-console
      });
  });

  app.post('/toggleTask', ensureLogin.ensureLoggedIn(), (req) => {
    let mysqlSession;
    mysqlx
      .getSession(`${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}`)
      .then((mySession) => {
        mysqlSession = mySession;
      })
      .then(() => {
        mysqlSession.sql(`USE ${process.env.DB_NAME}`).execute();
        mysqlSession.sql('UPDATE tasks SET '
       + `done = ${req.body.newDoneValue} `
        + `WHERE id = ${req.body.taskId}`)
          .execute();
        mysqlSession.sql('UPDATE cards SET '
       + `status = "${req.body.status}" `
        + `WHERE id = ${req.body.cardId}`)
          .execute();
      })
      .catch((err) => {
        console.log(err); // eslint-disable-line no-console
      });
  });

  app.get('/images/:name', ensureLogin.ensureLoggedIn(), (req, res) => {
    res.sendFile(path.join(baseDir, `/source/images/${req.params.name}`));
  });
};

module.exports = initRoutes;
