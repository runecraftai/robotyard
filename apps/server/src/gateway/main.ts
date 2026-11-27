import { Elysia } from 'elysia';

import { PRODUCT_NAME } from '@robotyard/contracts';

/**
 * The gateway: the HTTP surface a browser talks to.
 * Its compiler options live in `tsconfig.gateway.json`, which excludes the daemon sources,
 * so a gateway file that imports daemon code fails `tsc -b` instead of shipping.
 */
export function createGateway() {
  return new Elysia()
    .get('/api/health', () => ({ ok: true, product: PRODUCT_NAME }))
    .get('/api/agents/callsigns', () => ({ callsigns: [] as string[] }));
}

export const app = createGateway();

if (import.meta.main) {
  app.listen(Number(process.env.PORT ?? 3000));
  console.log(`${PRODUCT_NAME} gateway listening on ${app.server?.port}`);
}
