import React from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/barlow-condensed/600.css';
import '@fontsource/barlow-condensed/700.css';
import '@fontsource/manrope/400.css';
import '@fontsource/manrope/500.css';
import './style.css';
import App from './App';
createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
