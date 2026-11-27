import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { RouterProvider } from '@tanstack/react-router';

import { createAppRouter } from './router.tsx';

const host = document.getElementById('root');

if (host === null) {
  throw new Error('the root element is missing from index.html');
}

const router = createAppRouter();

createRoot(host).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
