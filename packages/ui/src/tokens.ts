/**
 * The design tokens, computed once and published as CSS custom properties.
 *
 * The rule: an accent must reach `ACCENT_CONTRAST_TARGET` against the background it sits on,
 * so each variant gets its own accent instead of one accent that only works in one theme.
 * Nothing here reads the active theme at runtime; both variants are resolved at load and
 * published, and the browser picks one through the `data-theme` attribute.
 */

export type ThemeVariant = 'light' | 'dark';

export type ColorScheme = {
  background: string;
  foreground: string;
  accent: string;
};

/** The contrast the accent owes its background. 3.2:1 is the target this product uses. */
export const ACCENT_CONTRAST_TARGET = 3.2;

/** The accent family both variants are derived from: a warm signal orange. */
const ACCENT_HUE = 28;
const ACCENT_SATURATION = 0.9;
const ACCENT_START_LIGHTNESS = 0.55;
const LIGHTNESS_STEP = 0.005;

function hexToRgb(hex: string): [number, number, number] {
  const value = hex.replace('#', '');
  const full =
    value.length === 3
      ? value
          .split('')
          .map((digit) => digit + digit)
          .join('')
      : value;

  if (!/^[0-9a-f]{6}$/i.test(full)) {
    throw new Error(`not a hex colour: ${hex}`);
  }

  return [
    Number.parseInt(full.slice(0, 2), 16) / 255,
    Number.parseInt(full.slice(2, 4), 16) / 255,
    Number.parseInt(full.slice(4, 6), 16) / 255,
  ];
}

function linearize(channel: number): number {
  return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}

/** WCAG relative luminance of an sRGB colour. */
export function relativeLuminance(hex: string): number {
  const [red, green, blue] = hexToRgb(hex);

  return 0.2126 * linearize(red) + 0.7152 * linearize(green) + 0.0722 * linearize(blue);
}

/** WCAG contrast ratio: 1 for identical colours, 21 for black against white. */
export function contrastRatio(first: string, second: string): number {
  const lighter = Math.max(relativeLuminance(first), relativeLuminance(second));
  const darker = Math.min(relativeLuminance(first), relativeLuminance(second));

  return (lighter + 0.05) / (darker + 0.05);
}

function hslToHex(hue: number, saturation: number, lightness: number): string {
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const section = (((hue % 360) + 360) % 360) / 60;
  const second = chroma * (1 - Math.abs((section % 2) - 1));
  const offset = lightness - chroma / 2;

  const [red, green, blue] =
    section < 1
      ? [chroma, second, 0]
      : section < 2
        ? [second, chroma, 0]
        : section < 3
          ? [0, chroma, second]
          : section < 4
            ? [0, second, chroma]
            : section < 5
              ? [second, 0, chroma]
              : [chroma, second, 0];

  const channel = (value: number) =>
    Math.round((value + offset) * 255)
      .toString(16)
      .padStart(2, '0');

  return `#${channel(red)}${channel(green)}${channel(blue)}`;
}

/**
 * Derive the accent for one background: walk the accent away from the background until
 * it meets the contrast target. Light backgrounds need a darker accent, dark ones a lighter.
 */
export function computeAccent(background: string): string {
  const direction = relativeLuminance(background) > 0.5 ? -1 : 1;

  for (
    let lightness = ACCENT_START_LIGHTNESS;
    lightness >= 0 && lightness <= 1;
    lightness += direction * LIGHTNESS_STEP
  ) {
    const candidate = hslToHex(ACCENT_HUE, ACCENT_SATURATION, lightness);

    if (contrastRatio(candidate, background) >= ACCENT_CONTRAST_TARGET) {
      return candidate;
    }
  }

  throw new Error(`no accent reaches ${ACCENT_CONTRAST_TARGET}:1 against ${background}`);
}

const lightBackground = '#f5f2ec';
const darkBackground = '#14120f';

function scheme(background: string, foreground: string): ColorScheme {
  return { background, foreground, accent: computeAccent(background) };
}

/** Both variants, resolved once at load. */
export const colorSchemes: Record<ThemeVariant, ColorScheme> = {
  light: scheme(lightBackground, '#17150f'),
  dark: scheme(darkBackground, '#f3efe6'),
};

/** The custom properties one variant publishes. */
export function colorProperties(scheme: ColorScheme): Record<string, string> {
  return {
    '--ry-color-background': scheme.background,
    '--ry-color-foreground': scheme.foreground,
    '--ry-color-accent': scheme.accent,
  };
}

function block(selector: string, scheme: ColorScheme): string {
  const declarations = Object.entries(colorProperties(scheme))
    .map(([name, value]) => `  ${name}: ${value};`)
    .join('\n');

  return `${selector} {\n  color-scheme: ${selector === ':root' ? 'light' : 'dark'};\n${declarations}\n}`;
}

/**
 * The published tokens: `:root` carries the light variant, `[data-theme='dark']` the dark one.
 * No script has to decide which is active.
 */
export const themeCss = `${block(':root', colorSchemes.light)}\n\n${block("[data-theme='dark']", colorSchemes.dark)}\n`;
