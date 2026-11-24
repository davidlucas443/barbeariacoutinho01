import React from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/barlow-condensed/600.css';
import '@fontsource/manrope/400.css';
import '@fontsource/manrope/500.css';
import './bio.css';
import Bio from './Bio';

createRoot(document.getElementById('root')!).render(<React.StrictMode><Bio/></React.StrictMode>);
