import type { ReactElement } from 'react';

import { agentSlug } from '@robotyard/contracts';

export type CallsignPlateProps = {
  callsign: string;
  /** The head the bot wears, drawn by a plugin once the mascot contract lands. */
  head?: ReactElement | null;
};

/**
 * The bot's identity in one place: its callsign and its head.
 * The mascot is a product surface, not decoration, so it is bound to the callsign here.
 */
export function CallsignPlate({ callsign, head = null }: CallsignPlateProps) {
  return (
    <span data-callsign={agentSlug(callsign)}>
      {head}
      <span>{callsign}</span>
    </span>
  );
}
