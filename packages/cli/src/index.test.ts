import { describe, expect, it, vi } from 'vitest';

import { cliVersion, run } from './index.ts';

describe('the CLI shell', () => {
  it('answers --version with the manifest version', () => {
    const lines: string[] = [];

    expect(run(['--version'], (line) => lines.push(line))).toBe(0);
    expect(lines).toEqual([cliVersion()]);
    expect(cliVersion()).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it('rejects any other command', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    expect(run(['--package'])).toBe(1);
    expect(error).toHaveBeenCalledWith('usage: robotyard --version');

    error.mockRestore();
  });
});
