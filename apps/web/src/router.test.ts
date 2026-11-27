import { createMemoryHistory } from '@tanstack/react-router';
import { describe, expect, it } from 'vitest';

import { createAppRouter } from './router.tsx';

async function resolve(path: string) {
  const router = createAppRouter(createMemoryHistory({ initialEntries: [path] }));
  await router.load();

  return router.state;
}

describe('the router', () => {
  it('resolves the cockpit at the root', async () => {
    const state = await resolve('/');

    expect(state.matches.at(-1)?.routeId).toBe('/');
  });

  it('resolves a callsign page and exposes its param', async () => {
    const state = await resolve('/bots/vega');
    const match = state.matches.at(-1);

    expect(match?.routeId).toBe('/bots/$callsign');
    expect(match?.params).toEqual({ callsign: 'vega' });
  });

  it('falls back to the root match for an unknown path', async () => {
    const state = await resolve('/not-a-route');

    expect(state.matches.map((match) => match.routeId)).toEqual(['__root__']);
  });
});
