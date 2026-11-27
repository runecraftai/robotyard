import { describe, expect, it } from 'vitest';

import * as sdk from './index.ts';

describe('the SDK shell', () => {
  it('loads and stays empty until a caller needs a contract', () => {
    expect(Object.keys(sdk)).toEqual([]);
  });
});
