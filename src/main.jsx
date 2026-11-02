import React from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/bodoni-moda';
import '@fontsource-variable/bodoni-moda/wght-italic.css';
import '@fontsource-variable/dm-sans';
import App from './App.jsx';
import './site.css';

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
