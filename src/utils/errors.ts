import { log } from './log.js';

/** Exit with error in a uniform way */
export function fail(e: unknown, prefix: string): never {
  if (e instanceof Error) log.error(`${prefix}: ${e.message}`);
  else log.error(`${prefix}: Unknown error`);
  process.exit(1);
}
