#!/usr/bin/env bash
# Prove the daemon/gateway boundary instead of documenting it.
#
# The two compiler projects list disjoint sources with `composite: true`,
# so a file that imports across the boundary is not in that project's file list
# and `tsc -b` fails with TS6307. A convention would not fail;
# this script makes the convention a gate.
#
# Two directions are proven, because the boundary is two-sided:
#   - the daemon must not import the gateway's HTTP surface;
#   - the gateway must not import the daemon's database, Drizzle included.
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
daemon_probe="$root/apps/server/src/daemon/boundary-probe.ts"
gateway_probe="$root/apps/server/src/gateway/boundary-probe.ts"
gateway_import_probe="$root/apps/server/src/gateway/boundary-import-probe.ts"
log="$(mktemp)"
trap 'rm -f "$daemon_probe" "$gateway_probe" "$gateway_import_probe" "$log"' EXIT

# require_rejection <project> <description>
# A probe file already sits in that project's source tree; the project must reject it.
require_rejection() {
  local project="$1"
  local description="$2"

  set +e
  (cd "$root" && bunx tsc -b "$project" >"$log" 2>&1)
  local status=$?
  set -e

  if [ "$status" -eq 0 ]; then
    echo "boundary violated: $description and the project still compiled" >&2
    exit 1
  fi

  if ! grep -q "TS6307" "$log"; then
    echo "the probe failed, but not for the boundary reason; output follows" >&2
    cat "$log" >&2
    exit 1
  fi
}

cat >"$daemon_probe" <<'PROBE'
// Temporary: this import must fail the daemon project.
import { createGateway } from '../gateway/main.ts';

export const leaked = createGateway;
PROBE

require_rejection tsconfig.daemon.json "a daemon file imports the gateway"
rm -f "$daemon_probe"
echo "boundary holds: the daemon project rejects a gateway import with TS6307"

cat >"$gateway_probe" <<'PROBE'
// Temporary: this import must fail the gateway project.
import { openDatabase } from '../daemon/db/client.ts';

export const leaked = openDatabase;
PROBE

require_rejection tsconfig.gateway.json "a gateway file imports the daemon database"
rm -f "$gateway_probe"
echo "boundary holds: the gateway project rejects a daemon database import with TS6307"

# A package import cannot be caught by the project's file list, so the gateway's lint config
# restricts Drizzle and daemon paths. Prove that rule bites, rather than trusting it.
cat >"$gateway_import_probe" <<'PROBE'
// Temporary: this dependency import must fail the gateway lint.
import { sql } from 'drizzle-orm';

export const leaked = sql;
PROBE

set +e
(cd "$root/apps/server" && bunx oxlint src >"$log" 2>&1)
status=$?
set -e

if [ "$status" -eq 0 ]; then
  echo "boundary violated: a gateway file imported Drizzle and lint still passed" >&2
  exit 1
fi

if ! grep -q "no-restricted-imports.*drizzle-orm" "$log"; then
  echo "the import probe failed, but not for the boundary reason; output follows" >&2
  cat "$log" >&2
  exit 1
fi

rm -f "$gateway_import_probe"
echo "boundary holds: the gateway lint rejects a Drizzle import with no-restricted-imports"

(cd "$root" && bunx tsc -b tsconfig.gateway.json tsconfig.daemon.json)
