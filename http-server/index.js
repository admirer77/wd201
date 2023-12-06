const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const minimist = require('minimist');

// Parse command line arguments
const args = minimist(process.argv.slice(2));
const port = args.port || process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Handle home page
  if (pathname === '/' || pathname === '/home') {
    serveFile(res, 'home.html');
  }
  // Handle project page
  else if (pathname === '/project') {
    serveFile(res, 'project.html');
  }
  // Handle registration page
  else if (pathname === '/registration') {
    serveFile(res, 'registration.html');
  }
  // Handle other pages or files
  else {
    serveFile(res, pathname.substr(1)); // Remove leading slash
  }
});

function serveFile(res, filename) {
  const filePath = path.join('.', filename);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File not found');
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    }
  });
}

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
