const express = require('express');
const mongoose = require('mongoose');

const country = require('./routes/country');

mongoose
  .connect('mongodb://127.0.0.1:27017/travel')
  .then(() => console.log('Connect'))
  .catch(err => console.log('Error'));

const app = express();

app.use('/country', country);

app.get('/', (req, res) => res.send('Hello!'));

app.listen(3300, () => console.log('Server started!'));
