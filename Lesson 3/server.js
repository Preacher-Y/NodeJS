const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  console.log(`Request url: ${req.url}, Request Method: ${req.method}`);
  res.setHeader('Content-Type', 'text/html');

  let path = './';
  switch (req.url) {
    case '/':
      path += 'index.html';
      res.statusCode = 200;
      break;
    case '/project':
      path += 'project.html';
      res.statusCode = 200;
      break;
    default:
      path += '404.html';
      res.statusCode = 404;
      break;
  }

  fs.readFile(path, (err, data) => {
    if (err) {
      console.log(err);
      res.end('<h1>Something went wrong.</h1>');
    } else {
      res.end(data);
    }
  });
});

server.listen(3000, 'localhost', () => {
  console.log('Listening on port 3000');
});
