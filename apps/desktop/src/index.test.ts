import { describe, expect, it } from 'vitest';

import { DesktopPackagingUnavailableError, packageDesktop } from './index.ts';

describe('the desktop stub', () => {
  it('fails loudly when asked to package anything', () => {
    expect(() => packageDesktop()).toThrow(DesktopPackagingUnavailableError);
    expect(() => packageDesktop()).toThrow(/not decided yet; packaging is unavailable/);
  });
});
