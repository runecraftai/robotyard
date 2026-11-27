export const PRODUCT_NAME = 'RobotYard';

/** A callsign is the bot's name; the slug is what paths and labels may carry. */
export type Callsign = string;

export function agentSlug(callsign: Callsign): string {
  return callsign
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
