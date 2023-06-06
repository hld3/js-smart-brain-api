import bcrypt from 'bcrypt-nodejs';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import knex from 'knex';

const db = knex(process.env.DB_CONNECTION);

import { handleImage, retrieveImageData } from './controllers/image.js';
import { handleRegister } from './controllers/register.js';
import { handleSignIn } from './controllers/signin.js';

console.log(JSON.stringify(db.client.config.connection));

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post('/signin', (req, res) => {
  handleSignIn(req, res, db, bcrypt);
});
app.post('/register', (req, res) => handleRegister(req, res, db, bcrypt));
app.get('/profile/:id', (req, res) => handleProfile(req, res, db));
app.put('/image', (req, res) => handleImage(req, res, db));
app.post('/image_data', (req, res) => retrieveImageData(req, res));

app.listen(3000, () => {
  console.log('app is running on port 3000');
});
