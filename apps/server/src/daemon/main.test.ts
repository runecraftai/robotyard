import { describe, expect, it } from 'vitest';

import { createDaemonState } from './main.ts';

describe('the daemon', () => {
  it('starts with no agents and the product name', () => {
    const state = createDaemonState(1_700_000_000_000);

    expect(state.product).toBe('RobotYard');
    expect(state.agents).toEqual([]);
    expect(state.startedAt).toBe(1_700_000_000_000);
  });
});
