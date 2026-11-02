import React from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/cormorant-garamond';
import '@fontsource-variable/cormorant-garamond/wght-italic.css';
import '@fontsource-variable/manrope';
import App from './App.jsx';
import './site.css';

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
