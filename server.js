const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex')({
  client: 'pg',
  connection: 'postgres://vagrant:vagrant@127.0.0.1:5432/smart-brain',
});

// console.log(JSON.stringify(knex.client.config.connection));

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send(db.users);
});

app.post('/signin', (req, res) => {
  knex
    .select()
    .from('login')
    .where({ email: req.body.email })
    .then((users) => {
      if (users.length > 0) {
        const isUser = bcrypt.compareSync(req.body.password, users[0].hash);
        if (isUser) {
          res.json('logged in');
        } else {
          res.status(400).json('wrong credentials.');
        }
      } else {
        res.status(400).json('Error signing in.');
      }
    })
    .catch((err) => console.log('wrong credentials.'));
});

app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  const hash = bcrypt.hashSync(password);

  knex.transaction((trx) => {
    trx
      .insert({
        hash: hash,
        email: email,
      })
      .into('login')
      .returning('email')
      .then((loginEmail) => {
        trx
          .insert({
            name: name,
            email: loginEmail[0].email,
            joined: new Date(),
          })
          .into('users')
          .returning('*')
          .then((user) => res.json(user[0]))
          .catch((err) =>
            res.status(400).json('There was an error during registration.')
          );
      })
      .then(trx.commit)
      .catch(trx.rollback);
  });
});

app.get('/profile/:id', (req, res) => {
  let { id } = req.params;
  id = parseInt(id);
  knex
    .select()
    .from('users')
    .where({ id })
    .then((user) => {
      user.length > 0
        ? res.json(user[0])
        : res.status(400).json('User not found.');
    })
    .catch((err) => res.status(400).json('Error retrieving user.'));
});

app.put('/image', (req, res) => {
  let { id } = req.body;
  id = parseInt(id);
  knex('users')
    .returning('*')
    .where({ id })
    .increment('entries', 1)
    .then((user) => {
      user.length > 0
        ? res.json(user[0])
        : res.status(400).json('User not found');
    })
    .catch((err) => res.status(400).json('Error incrementing entries.'));
});

app.listen(3000, () => {
  console.log('app is running on port 3000');
});
