import {
  createRootRoute,
  createRoute,
  createRouter,
  type RouterHistory,
} from '@tanstack/react-router';

import { CallsignRoute } from './routes/callsign.tsx';
import { CockpitRoute } from './routes/cockpit.tsx';
import { RootLayout } from './routes/root.tsx';

const rootRoute = createRootRoute({ component: RootLayout });

const cockpitRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: CockpitRoute,
});

const callsignRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/bots/$callsign',
  component: CallsignRoute,
});

const routeTree = rootRoute.addChildren([cockpitRoute, callsignRoute]);

export function createAppRouter(history?: RouterHistory) {
  return createRouter({ routeTree, ...(history === undefined ? {} : { history }) });
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createAppRouter>;
  }
}
