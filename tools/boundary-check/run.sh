#!/usr/bin/env bash
# Prove the daemon/gateway boundary instead of documenting it.
#
# The two compiler projects list disjoint sources with `composite: true`,
# so a file that imports across the boundary is not in that project's file list
# and `tsc -b` fails with TS6307. A convention would not fail;
# this script makes the convention a gate.
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
probe="$root/apps/server/src/daemon/boundary-probe.ts"
log="$(mktemp)"
trap 'rm -f "$probe" "$log"' EXIT

cat >"$probe" <<'PROBE'
// Temporary: this import must fail the daemon project.
import { createGateway } from '../gateway/main.ts';

export const leaked = createGateway;
PROBE

set +e
(cd "$root" && bunx tsc -b tsconfig.daemon.json >"$log" 2>&1)
status=$?
set -e

if [ "$status" -eq 0 ]; then
  echo "boundary violated: a daemon file imported the gateway and the project still compiled" >&2
  exit 1
fi

if ! grep -q "TS6307" "$log"; then
  echo "the probe failed, but not for the boundary reason; output follows" >&2
  cat "$log" >&2
  exit 1
fi

rm -f "$probe"

(cd "$root" && bunx tsc -b tsconfig.daemon.json)
echo "boundary holds: the daemon project rejects a gateway import with TS6307"
