const fs = require('fs');
const request = require('request-promise');
const trumpet = require('trumpet');
const str = require('string-to-stream');
const h2p = require('html2plaintext');
const { JSDOM } = require('jsdom');
const { document } = new JSDOM().window;

const postsByCountries = require('./data/postsByCountries.json');

const BASE_URL = 'http://tema.ru';

function strip(html) {
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

const monthIndex = [
  'января',
  'февраля',
  'марта',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря'
].reduce((acc, curr, index) => Object.assign(acc, { [curr]: index }), {});

function parseDate(dateStr) {
  dateStr = dateStr.replace('\n', '');
  const arr = dateStr.split(/&nbsp;| /);
  return new Date(arr.pop(), monthIndex[arr.pop()], parseInt(arr.pop(), 10));
}

function parseHtml(filename) {
  const page = filename.slice(0, -5);
  const file = fs.createReadStream(`${__dirname}/travel/${filename}`);
  const tr = trumpet();

  let markdown = '';
  let title = '';
  let dateRaw = '';

  let country = '';

  Object.keys(postsByCountries).forEach(c => {
    if (postsByCountries[c].some(x => x === page)) {
      country = c;
    }
  });

  tr.select(`.main_title[lang="ru"]`, elem => {
    elem.createReadStream().on('data', buff => {
      title = buff.toString('utf8');
    });
  });

  tr.selectAll(`p.body[lang="ru"]`, elem => {
    elem.createReadStream().on('data', buff => {
      const attr = strip(buff.toString('utf8'));
      markdown += `${attr}`;
    });
  });

  tr.selectAll(`h2.title[lang="ru"]`, elem => {
    elem.createReadStream().on('data', buff => {
      const attr = strip(buff.toString('utf8')).slice(1);
      markdown += `## ${attr}`;
    });
  });

  tr.selectAll(`.image img`, elem => {
    elem.getAttribute(
      'src',
      attr => (markdown += `\n![](${BASE_URL}/travel/${page}/${attr})\n`)
    );
  });

  tr.select(`.body_smaller`, elem => {
    elem.createReadStream().on('data', buff => {
      dateRaw = buff.toString('utf8');
    });
  });

  file.pipe(tr).on('end', () => {
    const date = parseDate(dateRaw);
    const json = JSON.stringify({ title, country, date, markdown });
    fs.writeFile(`${__dirname}/out/${page}.json`, json, err =>
      console.log('Ошибка при записи')
    );
    // fs.writeFile(`${__dirname}/out/${page}.md`, markdown);
  });
}

const dirName = './travel';

fs.readdir(dirName, (err, files) => {
  if (err) {
    console.log('Ошибка при чтении');
    return;
  }
  files.forEach(file => {
    parseHtml(file);
  });
});
