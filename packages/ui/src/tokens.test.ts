import { describe, expect, it } from 'vitest';

import {
  ACCENT_CONTRAST_TARGET,
  colorSchemes,
  computeAccent,
  contrastRatio,
  themeCss,
  type ThemeVariant,
} from './tokens.ts';

const variants: ThemeVariant[] = ['light', 'dark'];

describe('contrast', () => {
  it('measures the extremes', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 5);
    expect(contrastRatio('#ffffff', '#ffffff')).toBeCloseTo(1, 5);
  });
});

describe('the accent computation', () => {
  it.each(variants)('reaches the 3.2:1 target against the %s background', (variant) => {
    const { accent, background } = colorSchemes[variant];

    expect(contrastRatio(accent, background)).toBeGreaterThanOrEqual(ACCENT_CONTRAST_TARGET);
  });

  it('derives an accent per background rather than reusing one', () => {
    expect(colorSchemes.light.accent).not.toBe(colorSchemes.dark.accent);
  });

  it('is deterministic', () => {
    expect(computeAccent(colorSchemes.light.background)).toBe(colorSchemes.light.accent);
    expect(computeAccent(colorSchemes.dark.background)).toBe(colorSchemes.dark.accent);
  });
});

describe('the published tokens', () => {
  it('publishes both variants with their own accent', () => {
    expect(themeCss).toContain(
      `--ry-color-accent: ${colorSchemes.light.accent};`,
    );
    expect(themeCss).toContain(
      `--ry-color-accent: ${colorSchemes.dark.accent};`,
    );
    expect(themeCss).toContain(':root {');
    expect(themeCss).toContain("[data-theme='dark'] {");
  });
});
