const express = require('express');
const path = require('path');

const app = express();
const mysqlx = require('@mysql/xdevapi');
const bodyParser = require('body-parser');

app.use(express.static(path.join(`${__dirname}/source`)));
app.use(express.static(path.join(`${__dirname}/dist`)));
app.use(bodyParser.json());

const cardJSON = {
  id: 3,
  title: 'Start learn JS',
  description: 'Start learning JavaScript by reading tutorials and making exercises',
  status: 'done',
  color: '#3A7E28',
  tasks:
        [{
          id: 1,
          name: 'Find good web site to learn',
          done: true,
        },
        {
          id: 2,
          name: 'Finnish reading basic tutorials',
          done: true,
        },
        {
          id: 3,
          name: 'Start writing kanban board',
          done: true,
        }],
};
const cardJSON2 = {
  id: 2,
  title: 'Write some code',
  description: 'Code along with the samples in the book. The complete source can be found at [github](https://github.com/pro-react)',
  status: 'todo',
  color: '#a90a00',
  tasks: [
    {
      id: 1,
      name: 'ContactList Example',
      done: false,
    },
    {
      id: 2,
      name: 'Kanban Example',
      done: false,
    },
    {
      id: 3,
      name: 'My own experiments',
      done: false,
    },
  ],
};
const cardJSON3 = {
  id: 1,
  title: 'Read the Book',
  description: 'I should read the **whole** book',
  status: 'in-progress',
  color: '#BD8D31',
  tasks: [
    {
      id: 1,
      name: 'Buy a book in the shop',
      done: true,
    },
    {
      id: 2,
      name: 'Sit and open a book',
      done: false,
    },
    {
      id: 3,
      name: 'Finnish reading the book',
      done: false,
    },
  ],
};
const newJson = {
  email: 'Andrew5282011@gmail.com',
  password: 'AndrewEnglish12',
  cards: [
    cardJSON3,
    cardJSON2,
    cardJSON,
  ],
};

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/cards', (req, res) => {
  let formJson = {};
  mysqlx
    .getSession('root:AndrewEnglish12@localhost')
    .then(mySession => mySession.getSchema('mydb'))
    .then(schema => schema.getCollection('cardsCollection'))
    .then(collesction => Promise
      .all([

      ])
      .then(() => collesction
        .find()
        .limit(1)
        .execute((doc) => {
          formJson = Object.assign({}, doc);
          // Print document
        })))
    .then(() => {
      // res.json(formJson);
      res.json(formJson);
    })
    .catch((err) => {
      console.log(err); // eslint-disable-line no-console
    });
});

app.post('/changeCards', (req, res) => {
  mysqlx
    .getSession('root:AndrewEnglish12@localhost')
    .then(mySession => mySession.getSchema('mydb'))
    .then(schema => schema.getCollection('cardsCollection'))
    .then(collesction => Promise
      .all([
        collesction.add(newJson).execute(),
      ])
      .then(() => {
        collesction
          .modify('true')
          .set('cards', req.body)
          .limit(1)
          .execute();
      })
      .then(() => {
        /* return collesction
                    .find()
                    .execute((row) => {
                        console.log(row);
                    }); */
        // Find a document
      }))
    .then(() => {
      res.json({ ok: 200 });
    })
    .catch((err) => {
      console.log(err); // eslint-disable-line no-console
    });
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!'); // eslint-disable-line no-console
});
