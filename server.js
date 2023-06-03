const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex')({
  client: 'pg',
  connection:
    'postgres://smartbrain_8da7_user:4MCkewaa2wdjsL7GTnYl80VaAr2coYq7@dpg-chscchjhp8u4o31dditg-a.ohio-postgres.render.com:5432/smartbrain_8da7?ssl=true',
});

const { handleRegister } = require('./controllers/register');
const { handleSignIn } = require('./controllers/signin');
const { handleImage, retrieveImageData } = require('./controllers/image');

console.log(JSON.stringify(knex.client.config.connection));

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post('/signin', (req, res) => {
  handleSignIn(req, res, knex, bcrypt);
});
app.post('/register', (req, res) => handleRegister(req, res, knex, bcrypt));
app.get('/profile/:id', (req, res) => handleProfile(req, res, knex));
app.put('/image', (req, res) => handleImage(req, res, knex));
app.post('/image_data', (req, res) => retrieveImageData(req, res));

app.listen(3000, () => {
  console.log('app is running on port 3000');
});
