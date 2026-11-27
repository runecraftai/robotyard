import { useParams } from '@tanstack/react-router';

import { CallsignPlate } from '@robotyard/ui';

export function CallsignRoute() {
  const { callsign } = useParams({ from: '/bots/$callsign' });

  return (
    <main>
      <CallsignPlate callsign={callsign} />
    </main>
  );
}
