import fs from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'vite';

const projectRoot = process.cwd();
const distDir = path.join(projectRoot, 'dist');
const indexPath = path.join(distDir, 'index.html');
const template = await fs.readFile(indexPath, 'utf8');
const markerHead = '<!--site-head-->';
const markerRoot = '<div id="root"></div>';
if (!template.includes(markerHead) || !template.includes(markerRoot)) throw new Error('Vite index.html is missing the expected prerender placeholders.');

const vite = await createServer({
  configFile: path.join(projectRoot, 'vite.config.ts'),
  config: { appType: 'custom' },
  server: { middlewareMode: true },
  logLevel: 'error',
});

try {
  const [{ renderRoute }, { allPrerenderedRoutes }] = await Promise.all([
    vite.ssrLoadModule('/src/entry-server.tsx'),
    vite.ssrLoadModule('/src/routes.tsx'),
  ]);
  const originValue = process.env.PUBLIC_SITE_ORIGIN?.trim().replace(/\/$/, '');
  let publicOrigin;
  if (originValue) {
    const parsed = new URL(originValue);
    if (parsed.protocol !== 'https:' || parsed.username || parsed.password) throw new Error('PUBLIC_SITE_ORIGIN must be an HTTPS origin without credentials.');
    publicOrigin = parsed.origin;
  }

  const routes = allPrerenderedRoutes();
  for (const route of routes) {
    const { head, body } = renderRoute({ ...route, publicOrigin, canonical: route.path });
    const html = template.replace(markerHead, head).replace(markerRoot, `<div id="root">${body}</div>`);
    const target = route.path === '/404'
      ? path.join(distDir, '404.html')
      : route.path === '/'
        ? indexPath
        : path.join(distDir, route.path.slice(1), 'index.html');
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, html);
  }

  if (publicOrigin) {
    const entries = routes.filter(route => route.robots !== 'noindex,nofollow').map(route => `  <url><loc>${escapeXml(publicOrigin + route.path)}</loc></url>`).join('\n');
    await fs.writeFile(path.join(distDir, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`);
    const sitemapUrl = `${publicOrigin}/sitemap.xml`;
    await fs.writeFile(path.join(distDir, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${sitemapUrl}\n`);
  }
  console.log(`Prerendered ${routes.length} public HTML routes${publicOrigin ? ' with canonical and sitemap metadata' : ' without guessed public-domain URLs'}.`);
} finally {
  await vite.close();
}

function escapeXml(value) {
  return value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[char]);
}
