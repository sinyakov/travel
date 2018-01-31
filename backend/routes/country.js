const express = require('express');
const Country = require('../models/country');

const router = express.Router();

router.post('/', (request, response) => {
  Country.create(request.body, (err, createdCountry) => {
    if (!err && createdCountry) {
      response.status(200).json(createdCountry);
    } else {
      response.status(500).send('Server error');
    }
  });
});

router.get('/all', (request, response) => {
  Country.find({}, (err, country) => {
    if (!err && country) {
      response.status(200).json(country);
    } else {
      response.status(404).send('Not found');
    }
  });
});

router.get('/:id', (request, response) => {
  Country.findById(request.params.id, (err, country) => {
    if (!err && country) {
      response.status(200).json(country);
    } else {
      response.status(404).send('Not found');
    }
  });
});

module.exports = exports = router;
