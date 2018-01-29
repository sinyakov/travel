const countries = require('./data/countries.json');
const posts = require('./data/posts.json');

const visitedCountries = {};

posts.forEach(({ country }) => {
  visitedCountries[country] = true;
});

countries.forEach(({ name, web_name }) => {
  console.log(visitedCountries[web_name] ? '+' : '-', name);
});
