import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './app.tsx';

const host = document.getElementById('root');

if (host === null) {
  throw new Error('the root element is missing from index.html');
}

createRoot(host).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
