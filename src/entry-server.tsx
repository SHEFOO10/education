import { renderToString } from 'react-dom/server';
import { MotionConfig } from 'framer-motion';
import App from './App';

export interface PrerenderOptions {
  path: string;
  title: string;
  description: string;
  canonical?: string;
  robots?: string;
  publicOrigin?: string;
}

export function renderRoute(options: PrerenderOptions) {
  const origin = options.publicOrigin?.replace(/\/$/, '');
  const canonical = options.canonical && origin ? `${origin}${options.canonical}` : undefined;
  const ogImage = origin ? `${origin}/images/hero-collage.webp` : undefined;
  const head = [
    `<title>${escapeHtml(options.title)}</title>`,
    `<meta name="description" content="${escapeAttribute(options.description)}">`,
    `<meta name="robots" content="${escapeAttribute(options.robots ?? 'index,follow')}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="Knowlect">`,
    `<meta property="og:title" content="${escapeAttribute(options.title)}">`,
    `<meta property="og:description" content="${escapeAttribute(options.description)}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${escapeAttribute(options.title)}">`,
    `<meta name="twitter:description" content="${escapeAttribute(options.description)}">`,
    ...(canonical ? [`<link rel="canonical" href="${escapeAttribute(canonical)}">`, `<meta property="og:url" content="${escapeAttribute(canonical)}">`] : []),
    ...(ogImage ? [`<meta property="og:image" content="${escapeAttribute(ogImage)}">`, `<meta name="twitter:image" content="${escapeAttribute(ogImage)}">`] : []),
  ].join('\n    ');
  const body = renderToString(<MotionConfig reducedMotion="user"><App initialPath={options.path} /></MotionConfig>);
  return { head, body };
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]!);
}

const escapeAttribute = escapeHtml;
