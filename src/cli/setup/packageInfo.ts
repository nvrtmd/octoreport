import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

interface PackageInfo {
  name: string;
  version: string;
  description: string;
}

export function getPackageInfo(): PackageInfo {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  // try multiple possible paths
  const possiblePaths = [
    join(__dirname, '../../../package.json'), // development
    join(__dirname, '../../package.json'), // build (dist/src/cli/setup)
    join(__dirname, '../package.json'), // build (dist/src/cli)
    join(__dirname, '../../package.json'), // build (dist/src)
  ];

  let packageJsonPath: string | null = null;

  for (const path of possiblePaths) {
    if (existsSync(path)) {
      packageJsonPath = path;
      break;
    }
  }

  if (!packageJsonPath) {
    throw new Error('package.json file not found. Please run in the project root directory.');
  }

  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

  return {
    name: packageJson.name,
    version: packageJson.version,
    description: packageJson.description,
  };
}
