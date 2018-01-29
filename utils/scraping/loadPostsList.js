const fs = require('fs');
const request = require('request-promise');
const trumpet = require('trumpet');
const str = require('string-to-stream');

const BASE_URL = 'http://tema.ru';
const links = [];

function loadPage(link, delay) {
  setTimeout(() => {
    request(`${BASE_URL}${link}`).then(htmlString => {
      const file = fs.createWriteStream(
        `${__dirname}${link.slice(0, -1)}.html`
      );
      str(htmlString).pipe(file);
    });
  }, delay);
}

const tr = trumpet();

tr.selectAll('.main-table p[lang="ru"] a', link => {
  link.getAttribute('href', href => {
    links.push(href);
  });
});

request(`${BASE_URL}/travel/`)
  .then(
    htmlString =>
      new Promise((resolve, reject) => {
        const stream = str(htmlString).pipe(tr);
        stream.on('end', resolve);
        stream.on('error', reject);
      })
  )
  .then(() => {
    links.forEach((url, index) => loadPage(url, index * 300));
  })
  .catch(err => {
    console.error(err);
  });
