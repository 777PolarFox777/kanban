const path = require('path');
const mysql = require('mysql');
const passport = require('passport');
const ensureLogin = require('connect-ensure-login');
const bcrypt = require('bcrypt');

const baseDir = path.join(__dirname, '../../../');

const connection = mysql.createConnection(process.env.CLEARDB_DATABASE_URL);

const initRoutes = (app) => {
  app.post('/login',
    (req, res) => {
      passport.authenticate('local', (err, user) => {
        if (err) {
          console.log(err);
          return res.json({ error: err });
        }
        if (!user) {
          console.log(err);
          return res.json({ error: 'No such user!' });
        }
        req.logIn(user, (errc) => {
          if (errc) {
            return res.json({ error: err });
          }
          console.log(req.user);
          return res.json({ user: req.user.username });
        });
        return null;
      })(req, res);
    });

  app.get('/login', (req, res) => {
    console.log('GET LOGIN');
    res.redirect('/');
  });

  app.get('/logout',
    (req, res) => {
      req.logout();
      res.status(401).send('logged out');
    });

  app.post('/register', (req, res) => {
    // Generate Password
    const saltRounds = 10;
    const myPlaintextPassword = req.body.password;
    const salt = bcrypt.genSaltSync(saltRounds);
    const passwordHash = bcrypt.hashSync(myPlaintextPassword, salt);

    connection.query('INSERT INTO users (id, username, password) '
        + `VALUES (0, "${req.body.username}", "${passwordHash}")`, (error) => {
      if (error) throw error;
      // connected!
      res.json({ ok: '200' });
    });
  });

  app.get('/', (req, res) => {
    console.log('GET /');
    res.sendFile(path.join(baseDir, 'index.html'));
  });

  app.get('/cards', ensureLogin.ensureLoggedIn(), (req, res) => {
    const formedJson = [];
    const tasks = [];
    const { username } = req.user;

    connection.query('SELECT * FROM tasks '
       + 'LEFT JOIN cards ON tasks.card_id = cards.id '
        + 'LEFT JOIN users ON cards.user_id = users.id '
         + `WHERE username = "${username}"`, (error, result) => {
      if (error) throw error;
      // connected!
      result.forEach((task) => {
        tasks.push({
          id: task.id,
          name: task.name,
          done: task.done,
          card_id: task.card_id,
        });
      });

      connection.query('SELECT * FROM cards '
     + 'LEFT JOIN users ON cards.user_id = users.id '
       + `WHERE username = "${username}"`, (err, row) => {
        if (err) throw error;

        row.forEach((card) => {
          formedJson.push({
            id: card.id,
            title: card.title,
            description: card.description,
            status: card.status,
            tasks: tasks.filter(el => el.card_id === card.id),
          });
        });

        res.json({ cards: formedJson, user: username });
      });
    });
  });

  app.post('/createCard', ensureLogin.ensureLoggedIn(), (req, res) => {
    connection.query('SELECT id FROM users '
        + `WHERE username = "${req.user.username}"`, (error, row) => {
      if (error) throw error;
      // connected!
      req.body.userId = row[0].id;

      const { card } = req.body;

      connection.query('INSERT INTO cards (id, title, description, status, user_id) '
        + `VALUES (0, "${card.title}", "${card.description}", "${card.status}", ${req.body.userId})`, (err) => {
        if (err) throw err;

        connection.query('SELECT id FROM cards ORDER BY id DESC LIMIT 1', (errr, result) => {
          if (errr) throw errr;

          req.body.cardId = result[0].id;

          res.json({ id: req.body.cardId, ok: '200' });
        });
      });
    });
  });

  app.post('/deleteCard', ensureLogin.ensureLoggedIn(), (req, res) => {
    connection.query('DELETE FROM cards '
        + `WHERE id = "${req.body.cardId}"`, (error) => {
      if (error) throw error;

      res.json({ ok: '200' });
    });
  });

  app.post('/addTask', ensureLogin.ensureLoggedIn(), (req, res) => {
    const { task } = req.body;

    connection.query('INSERT INTO tasks (id, name, done, card_id) '
        + `VALUES (0, "${task.name}", ${+task.done}, ${req.body.cardId})`, (error) => {
      if (error) throw error;

      res.json({ ok: '200' });

      connection.query('SELECT id FROM tasks ORDER BY id DESC LIMIT 1', (err, row) => {
        if (err) throw err;

        res.json({ id: row[0], ok: '200' });
      });
    });
  });

  app.post('/deleteTask', ensureLogin.ensureLoggedIn(), (req, res) => {
    connection.query('DELETE FROM tasks '
        + `WHERE id = ${req.body.taskId}`, (error) => {
      if (error) throw error;

      res.json({ ok: '200' });
    });
  });

  app.post('/toggleTask', ensureLogin.ensureLoggedIn(), (req, res) => {
    connection.query('UPDATE tasks SET '
       + `done = ${req.body.newDoneValue} `
        + `WHERE id = ${req.body.taskId}`, (err) => {
      if (err) throw err;

      connection.query('UPDATE cards SET '
       + `status = "${req.body.status}" `
        + `WHERE id = ${req.body.cardId}`, (error) => {
        if (error) throw error;

        res.json({ ok: '200' });
      });
    });
  });

  app.get('/images/:name', ensureLogin.ensureLoggedIn(), (req, res) => {
    res.sendFile(path.join(baseDir, `/source/images/${req.params.name}`));
  });

  app.get('/docs', (req, res) => {
    res.sendFile(path.join(baseDir, '/docs.html'));
  });

  app.get('/docs-style.css', (req, res) => {
    res.sendFile(path.join(baseDir, '/docs-style.css'));
  });
};

module.exports = initRoutes;
