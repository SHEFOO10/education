import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { MotionConfig } from 'framer-motion';
import App from './App';
import './styles.css';

document.documentElement.classList.remove('no-js');
const root = document.getElementById('root')!;
const app = (
  <React.StrictMode>
    <MotionConfig reducedMotion="user">
      <App initialPath={window.location.pathname} />
    </MotionConfig>
  </React.StrictMode>
);

if (root.hasChildNodes()) {
  hydrateRoot(root, app);
} else {
  createRoot(root).render(app);
}
