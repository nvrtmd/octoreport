import { Command } from 'commander';

import { getPackageInfo } from './packageInfo';

export function createCommander(): Command {
  const program = new Command();
  const packageInfo = getPackageInfo();

  program.name(packageInfo.name).description(packageInfo.description).version(packageInfo.version);

  return program;
}
