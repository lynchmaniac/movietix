import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { extname, join } from 'path';
import { fileURLToPath } from 'url';

const PORT = process.env.PORT || 3000;
const ROOT = fileURLToPath(new URL('.', import.meta.url));

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.ico':  'image/x-icon',
  '.png':  'image/png',
  '.svg':  'image/svg+xml',
};

createServer(async (req, res) => {
  // Strip query string and decode URI
  const pathname = decodeURIComponent(req.url.split('?')[0]);

  // Serve index.html for root
  const filePath = join(ROOT, pathname === '/' ? 'index.html' : pathname);

  try {
    const data = await readFile(filePath);
    const mime = MIME[extname(filePath)] ?? 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': mime });
    res.end(data);
  } catch {
    // Fall back to index.html for unknown paths (SPA)
    try {
      const data = await readFile(join(ROOT, 'index.html'));
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(data);
    } catch {
      res.writeHead(500);
      res.end('Server error');
    }
  }
}).listen(PORT, () => {
  console.log(`\n🎬  Movietix est prêt !`);
  console.log(`    → http://localhost:${PORT}\n`);
});
