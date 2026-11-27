import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/** The version the CLI reports, read from the package manifest so it cannot drift. */
export function cliVersion(): string {
  const manifest = JSON.parse(
    readFileSync(join(import.meta.dirname, '../package.json'), 'utf8'),
  ) as { version: string };

  return manifest.version;
}

/** The one command the shell exposes. Anything else is a usage error. */
export function run(argv: readonly string[], write: (line: string) => void = console.log): number {
  if (argv.length === 1 && argv[0] === '--version') {
    write(cliVersion());
    return 0;
  }

  console.error('usage: robotyard --version');
  return 1;
}

if (import.meta.main) {
  process.exitCode = run(process.argv.slice(2));
}
