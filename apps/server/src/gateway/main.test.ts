import { describe, expect, it } from 'vitest';

import { createGateway } from './main.ts';

describe('the gateway', () => {
  it('answers a health check on the API surface', async () => {
    const response = await createGateway().handle(new Request('http://localhost/api/health'));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true, product: 'RobotYard' });
  });

  it('serves an empty callsign list before any bot exists', async () => {
    const response = await createGateway().handle(
      new Request('http://localhost/api/agents/callsigns'),
    );

    await expect(response.json()).resolves.toEqual({ callsigns: [] });
  });
});
