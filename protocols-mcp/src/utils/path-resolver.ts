import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

/**
 * Resolve protocols root path portably
 * Works for both development and installed package
 */
export function resolveProtocolsRoot(): string {
  // Option 1: Environment variable (highest priority)
  if (process.env.PROTOCOLS_PATH) {
    return process.env.PROTOCOLS_PATH;
  }

  // Option 2: Relative to this package (for npm install)
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  
  // Go up from build/utils/ to package root, then to parent
  const packageRoot = path.resolve(__dirname, '../..');
  
  // Check if BRAIN exists at parent level (development mode)
  const devPath = path.resolve(packageRoot, '..');
  if (fs.existsSync(path.join(devPath, 'BRAIN'))) {
    return devPath;
  }

  // Check if BRAIN exists at package level (symlinked content)
  if (fs.existsSync(path.join(packageRoot, 'BRAIN'))) {
    return packageRoot;
  }

  throw new Error(
    'Could not locate protocols directory. Set PROTOCOLS_PATH environment variable.'
  );
}
