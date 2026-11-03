import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './site.css';

// Mount once with the final typefaces already loaded, before any entrance motion.
// If fonts cannot load, keep a stable fallback for this visit rather than swap later.
async function start() {
  let timer;
  const fontLoads = Promise.all([
    document.fonts.load('450 48px "Bodoni Moda Variable"', 'Sua beleza. Avaliação'),
    document.fonts.load('italic 400 48px "Bodoni Moda Variable"', 'Seu tempo.'),
    document.fonts.load('400 14px "DM Sans Variable"', 'Agendar avaliação'),
  ]).then(faces => faces.every(list => list.length > 0));
  const loaded = await Promise.race([
    fontLoads.catch(() => false),
    new Promise(resolve => { timer = setTimeout(() => resolve(false), 3500); }),
  ]);
  clearTimeout(timer);
  document.documentElement.classList.toggle('fonts-fallback', !loaded);
  document.documentElement.dataset.fonts = loaded ? 'ready' : 'fallback';
  const root = document.getElementById('root');
  root.removeAttribute('aria-busy');
  createRoot(root).render(<React.StrictMode><App /></React.StrictMode>);
}
start();
