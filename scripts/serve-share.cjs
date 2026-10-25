const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(process.env.SCOTTY_WEB_ROOT || path.join(__dirname, '../web-dist'));
const port = Number(process.env.PORT || 8090);
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.ttf': 'font/ttf', '.woff': 'font/woff', '.woff2': 'font/woff2', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.xml': 'application/xml' };
http.createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405); res.end(); return; }
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
  catch { res.writeHead(400); res.end('Invalid URL'); return; }
  const target = path.resolve(root, '.' + pathname);
  if (!target.startsWith(root + path.sep) && target !== root) { res.writeHead(403); res.end(); return; }
  let file = [target, target + '.html', path.join(target, 'index.html')].find(candidate => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
  const appRoutes = ['/', '/find', '/trips', '/wallet', '/explore', '/settings', '/brand-guide'];
  if (!file && appRoutes.includes(pathname.replace(/\/$/, '') || '/')) file = path.join(root, 'index.html');
  const status = file ? 200 : 404;
  file ||= path.join(root, '+not-found.html');
  if (!fs.existsSync(file)) { res.writeHead(404); res.end('Not found'); return; }
  res.writeHead(status, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'strict-origin-when-cross-origin', 'Cache-Control': path.extname(file) === '.html' ? 'no-cache' : 'public, max-age=3600' });
  if (req.method === 'HEAD') { res.end(); return; }
  fs.createReadStream(file).pipe(res);
}).listen(port, '127.0.0.1', () => console.log(`Scotty preview: http://localhost:${port}`));
