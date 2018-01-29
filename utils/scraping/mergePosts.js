const fs = require('fs');

const dirName = './out';
const posts = [];

fs.readdir(dirName, (err, files) => {
  if (err) {
    console.log('Ошибка при чтении');
    return;
  }
  files.forEach(file => {
    const post = JSON.parse(
      fs.readFileSync(`${__dirname}/out/${file}`, 'utf8')
    );
    if (post.country && post.date) {
      posts.push(post);
    }
  });

  fs.writeFile(`${__dirname}/data/posts.json`, JSON.stringify(posts));
});
