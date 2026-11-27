import { PRODUCT_NAME } from '@robotyard/contracts';

/**
 * The daemon: the host process that launches and supervises agents.
 * Its compiler options live in `tsconfig.daemon.json`, which excludes the gateway sources,
 * so daemon code that reaches into the HTTP surface fails `tsc -b` instead of shipping.
 */
export type DaemonState = {
  product: string;
  startedAt: number;
  agents: readonly string[];
};

export function createDaemonState(now: number = Date.now()): DaemonState {
  return { product: PRODUCT_NAME, startedAt: now, agents: [] };
}

export function startDaemon(): DaemonState {
  const state = createDaemonState();
  console.log(`${state.product} daemon up since ${new Date(state.startedAt).toISOString()}`);
  return state;
}

if (import.meta.main) {
  startDaemon();
}
