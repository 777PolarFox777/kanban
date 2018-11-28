const path = require('path');
const mysqlx = require('@mysql/xdevapi');
const passport = require('passport');

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

  app.get('/logout',
    (req, res) => {
      req.logout();
      res.status(401).send('logged out');
    });

  app.get('/', (req, res) => {
    res.sendFile(path.join(baseDir, 'index.html'));
  });

  app.get('/cards', require('connect-ensure-login').ensureLoggedIn(), (req, res) => { // eslint-disable-line global-require
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

  app.post('/addTask', (req, res) => {
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
        + `VALUES (${task.id}, "${task.name}", ${+task.done}, ${req.body.cardId})`)
          .execute();
      })
      .then(() => {
        mysqlSession.sql(`SELECT * FROM tasks WHERE name = "${req.body.task.name}"`).execute((row) => {
          res.json({ id: row[0], ok: '200' });
        });
      })
      .catch((err) => {
        console.log(err); // eslint-disable-line no-console
      });
  });

  app.post('/deleteTask', (req) => {
    let mysqlSession;
    mysqlx
      .getSession(`${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}`)
      .then((mySession) => {
        mysqlSession = mySession;
      })
      .then(() => {
        mysqlSession.sql(`USE ${process.env.DB_NAME}`).execute();
        mysqlSession.sql('DELETE FROM tasks WHERE '
        + `id = ${req.body.taskId}`)
          .execute();
      })
      .catch((err) => {
        console.log(err); // eslint-disable-line no-console
      });
  });

  app.post('/toggleTask', (req) => {
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

  app.get('/images/:name', (req, res) => {
    res.sendFile(path.join(baseDir, `/source/images/${req.params.name}`));
  });
};

module.exports = initRoutes;
