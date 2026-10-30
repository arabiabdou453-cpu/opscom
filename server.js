const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = __dirname;
const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp'
};

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  let cleanUrl = req.url.split('?')[0].split('#')[0];
  if (cleanUrl === '/') cleanUrl = '/index.html';

  let filePath = path.join(ROOT_DIR, cleanUrl.replace(/^\/+/, ''));
  if (!fs.existsSync(filePath)) {
    filePath = path.join(ROOT_DIR, 'assets', path.basename(cleanUrl));
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      fs.readFile(path.join(ROOT_DIR, 'index.html'), (err2, data) => {
        if (err2) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('Not Found');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(data);
        }
      });
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`OpsCom server running at http://localhost:${PORT}/`);
});
