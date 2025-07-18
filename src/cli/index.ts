#!/usr/bin/env node
import { createTotalCommand } from './commands';
import { createCommander } from './setup';

const program = createCommander();

createTotalCommand(program);

program.parse();
