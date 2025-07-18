# @octoreport/core

<img width="1024" height="640" alt="octoreport_logo_lite" src="https://github.com/user-attachments/assets/bfcbe8a9-7ea1-45bf-8ca1-b0b70b921473" />

> A modern, timezone-aware GitHub PR/issue analytics core library. Provides the foundational logic for retrieving and analyzing pull requests from GitHub repositories with flexible filtering capabilities.

## Features

🔒 **GitHub API Integration**: Direct integration with GitHub GraphQL and REST APIs

📊 **PR Analytics**: Comprehensive search and reporting with flexible filters

🌏 **Timezone-Aware**: Powered by luxon for accurate date handling across timezones

⚡ **Fast & Modern**: Built with TypeScript for type safety and performance

🧪 **Well-Tested**: Comprehensive test coverage with Vitest

🛠️ **Modular Design**: Clean, extensible architecture for easy integration

🔐 **Authentication Agnostic**: Works with any GitHub token (OAuth, PAT, etc.)

## Installation

```bash
npm install @octoreport/core
```

### Prerequisites

- Node.js >= 18
- npm or yarn
- GitHub token (OAuth token, Personal Access Token, etc.)

## Quick Start

```typescript
import { getUserPRListByCreationAndParticipation } from '@octoreport/core';

// Get both created and participated PRs
const results = await getUserPRListByCreationAndParticipation({
  username: 'octocat',
  repository: 'octoreport/core',
  period: {
    startDate: '2025-07-01',
    endDate: '2025-07-20',
  },
  targetBranch: 'main',
  githubToken: 'YOUR_GITHUB_TOKEN',
});

console.log('🐙📊 User Created PRs:\n', result.userCreatedPRList);
console.log('🐙📊 User Participated PRs:\n', result.userParticipatedPRList);
```

## API Reference

### Core Functions

```typescript
import {
  getUserPRListByCreationAndParticipation,
  getUserCreatedPRListInPeriod,
  getUserParticipatedPRListInPeriod,
  getUserCreatedPRCountInPeriod,
  getUserCreatedPRListInPeriodByLabel,
  getUserPRCountByLabelInPeriod,
} from '@octoreport/core';

// Get both created and participated PRs
const results = await getUserPRListByCreationAndParticipation({
  username: 'octocat',
  repository: 'octoreport/core',
  period: {
    startDate: '2025-07-01',
    endDate: '2025-07-20',
  },
  githubToken: 'YOUR_GITHUB_TOKEN',
});

// Get only created PRs
const createdPRs = await getUserCreatedPRListInPeriod({
  username: 'octocat',
  repository: 'octoreport/core',
  period: {
    startDate: '2025-07-01',
    endDate: '2025-07-20',
  },
  githubToken: 'YOUR_GITHUB_TOKEN',
});

// Get only participated PRs
const participatedPRs = await getUserParticipatedPRListInPeriod({
  username: 'octocat',
  repository: 'octoreport/core',
  period: {
    startDate: '2025-07-01',
    endDate: '2025-07-20',
  },
  githubToken: 'YOUR_GITHUB_TOKEN',
});

// Get count of created PRs
const prCount = await getUserCreatedPRCountInPeriod(createdPRs);

// Filter PRs by labels
const bugPRs = await getUserCreatedPRListInPeriodByLabel(createdPRs, ['enhancement', 'bugfix']);

// Get label statistics
const labelStats = await getUserPRCountByLabelInPeriod(createdPRs);
// Returns: { 'bug': 5, 'feature': 3, 'docs': 2 }
```

### GitHub API Functions

```typescript
import { fetchGitHubUserInfo, fetchAllPRListInPeriod } from '@octoreport/core';

// Get user information
const userInfo = await fetchGitHubUserInfo('YOUR_GITHUB_TOKEN');
// Returns: { login: 'octocat', email: 'octocat@example.com' }

// Get all PRs in a period
const allPRs = await fetchAllPRListInPeriod({
  repository: 'octoreport/core',
  period: {
    startDate: '2025-07-01',
    endDate: '2025-07-20',
  },
  githubToken: 'YOUR_GITHUB_TOKEN',
});
```

## Authentication

This library is **authentication agnostic** - it works with any valid GitHub token:

- **Personal Access Tokens (PAT)**: Classic GitHub tokens
- **OAuth Access Tokens**: From OAuth applications

### Getting a GitHub Token

- **Personal Access Token**: Go to GitHub Settings → Developer settings → Personal access tokens
- **OAuth Token**: Create an OAuth app and implement the OAuth flow

### Required Scopes

For full functionality, your token needs these scopes:

- `repo` - Access private repositories
- `read:user` - Read user profile information

## Timezone Handling

- All date inputs are interpreted in the local timezone (auto-detected)
- Dates are converted to UTC ISO 8601 before querying GitHub API
- Powered by luxon for robust timezone support

## Contributing

We welcome contributions! 👍🏻

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m "feat: your feature"`)
4. Push to your fork and open a Pull Request

### Development Setup

```bash
# Clone the repository
git clone https://github.com/octoreport/core.git
cd core

# Install dependencies
npm install

# Run tests
npm test

# Build the library
npm run build
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [luxon](https://moment.github.io/luxon/) for timezone handling
- [@octokit/rest](https://github.com/octokit/rest.js) for GitHub API integration patterns
