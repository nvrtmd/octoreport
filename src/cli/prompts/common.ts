import inquirer from 'inquirer';

export async function promptCommonQuestions() {
  return await inquirer.prompt([
    {
      type: 'input',
      name: 'username',
      message:
        '🐙 Optionally, enter the target GitHub username (press Enter to skip and use your own):',
    },
    {
      type: 'input',
      name: 'repository',
      message: '🐙 Enter the repository (e.g., facebook/react):',
    },
    {
      type: 'input',
      name: 'startDate',
      message: '🐙 Enter start date (YYYY-MM-DD):',
    },
    {
      type: 'input',
      name: 'endDate',
      message: '🐙 Enter end date (YYYY-MM-DD):',
    },
    {
      type: 'input',
      name: 'targetBranch',
      message: '🐙 Optionally, Enter target branch (press Enter to target all branches):',
    },
  ]);
}
