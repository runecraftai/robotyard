import { describe, expect, it } from 'vitest';

import { agentSlug, PRODUCT_NAME } from '@robotyard/contracts';

describe('the shared contract', () => {
  it('names the product', () => {
    expect(PRODUCT_NAME).toBe('RobotYard');
  });

  it('derives a stable slug from an agent callsign', () => {
    expect(agentSlug('Vega')).toBe('vega');
    expect(agentSlug('  Altair Norte ')).toBe('altair-norte');
  });
});
