# octoreport

> A modern, secure, and timezone-aware GitHub PR/issue reporting CLI for everyone. Users can retrieve a list of pull requests either created by themselves or another GitHub user, as well as pull requests in which the user has participated through comments or reviews, within a specific repository—filtered by a specified time period and target branch.

## Features

🔒 Secure GitHub authentication (OAuth Device Flow, keytar-based token storage)

📊 PR/Issue search and reporting with flexible filters

🌏 Timezone-aware date queries (powered by luxon)

⚡ Fast, modern TypeScript codebase

🧪 Well-tested with Vitest

🛠️ Easily extensible and open for contributions

## Getting Started

### Prerequisites

- Node.js >= 18
- npm or yarn

### Installation

```bash
npm  install  -g  octoreport
```

#### or

##### For Yarn Classic

```bash
yarn global add octoreport
```

##### For Yarn Berry (v2+)

```bash
yarn dlx octoreport
```

## Usage

```bash
octoreport  [command]
```

### Authenticate with your GitHub account (OAuth Device Flow)

```bash
octoreport login
```

### Use interactive prompt
- When you run the octoreport command, you will be guided through an interactive prompt.
- Follow the prompts and provide the requested information to generate your GitHub PR report.

```bash
octoreport
```

#### You will be prompted for the following parameters:

**🔎 Optionally, enter the target GitHub username (e.g., octocat) (press Enter to skip and show PRs created by you):**

⤷ Type the GitHub username you want to search for, or press Enter to use your own account.

**🔎 Please enter the repository in the format "owner/repo" (e.g., facebook/react):**

⤷ Enter the repository you want to search in, using the format owner/repo.

**🔎 Please enter the start date for the search period (format: YYYY-MM-DD):**

⤷ Enter the start date for your search period. Use the format YYYY-MM-DD (e.g., 2025-07-01).

**🔎 Please enter the end date for the search period (format: YYYY-MM-DD):**

⤷ Enter the end date for your search period. Use the format YYYY-MM-DD (e.g., 2025-07-10).

**🔎 Optionally, enter the target branch to filter pull requests (press Enter to skip and show PRs targeting all branches):**

⤷ Type the branch name to filter PRs by target branch, or press Enter to include all branches.

## Example Output

```bash
User Created PRs:  [
  {
    number: 17059,
    title: '[Modal] Add transition documentation',
    url: 'https://github.com/mui/material-ui/pull/17059',
    createdAt: '2019-08-19T15:27:07Z',
    mergedAt: '2019-08-21T08:53:23Z',
    labels: [ 'component: modal', 'docs' ],
    author: 'oliviertassinari',
    reviewers: [ 'mbrookes', 'oliviertassinari' ],
    comments: [ 'mui-pr-bot' ],
    targetBranch: 'master'
  },
  // ...
]
User Participated PRs:  [
  {
    number: 17058,
    title: '[Tooltip] Improve arrow demo',
    url: 'https://github.com/mui/material-ui/pull/17058',
    createdAt: '2019-08-19T15:14:49Z',
    mergedAt: '2019-08-20T09:06:22Z',
    labels: [ 'component: tooltip', 'docs' ],
    author: 'Patil2099',
    reviewers: [ 'oliviertassinari' ],
    comments: [ 'mui-pr-bot', 'oliviertassinari' ],
    targetBranch: 'master'
  },
  // ...
]
```

## Authentication

- **octoreport** uses GitHub OAuth Device Flow for secure authentication.
- Tokens are stored securely using keytar (OS-native credential storage).
- No need to manually create or manage PATs.
- Supports multiple accounts.

## Timezone Handling

- All date inputs are interpreted in your local timezone (auto-detected).
- Dates are converted to UTC ISO 8601 before querying the GitHub API, ensuring accurate results regardless of your location.
- Powered by luxon.

## Configuration

- User configuration (e.g., GitHub username, email address) is stored in `~/.octoreport/`.
- Tokens are never stored in plain text.

## Contributing

We welcome contributions! 👍🏻

- [x]  Fork this repo
- [x]  Create a feature branch (git checkout -b feature/your-feature)
- [x]  Commit your changes (git commit -m "feat: your feature")
- [x]  Push to your fork and open a Pull Request

## License

- This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [luxon](https://moment.github.io/luxon/) for timezone handling
- [keytar](https://github.com/atom/node-keytar) for secure credential storage
