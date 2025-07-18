import { Command } from 'commander';

import { getUserPRListByCreationAndParticipation } from '../../core';

import { withCommonSetup } from './withCommonSetup';

export function createTotalCommand(program: Command) {
  program
    .command('total')
    .alias('-t')
    .description('Get total PR activity report including created and participated PR list')
    .action(async () => {
      await withCommonSetup(async (answers, githubToken, username, spinner) => {
        const result = await getUserPRListByCreationAndParticipation({
          githubToken,
          username: answers.username || username,
          repository: answers.repository,
          period: {
            startDate: answers.startDate,
            endDate: answers.endDate,
          },
          targetBranch: answers.targetBranch,
        });
        spinner.succeed('✅ Total PR activity report generated!');
        console.log('\n🐙📊 User Created PRs:\n', result.userCreatedPRList);
        console.log('\n🐙📊 User Participated PRs:\n', result.userParticipatedPRList);
      });
    });
}
