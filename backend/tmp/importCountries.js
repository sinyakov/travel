const data = require('../../utils/scraping/data/countries.json');
const Country = require('../models/country');

module.exports = exports = () => {
  data.forEach(obj => {
    console.log(obj.slug, 'read');
    const country = new Country(obj);
    country.save(err => {
      if (err) {
        throw err;
      }
      console.log(obj.slug, '>>> saved to db');
    });
  });
};
