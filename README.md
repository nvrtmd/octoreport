# @octoreport/core

<h1 align="center">
	<img width="500px" src="media/logo.png" alt="octoreport">
</h1>

> A modern, timezone-aware analytics core library for GitHub pull requests and issues. It provides the foundational logic for retrieving, filtering, and analyzing PR data with flexible conditions and precise participation tracking.

## Features

🔒 **GitHub API Integration**: Seamlessly integrates with both GitHub GraphQL and REST APIs

📊 **PR Analytics**: Offers advanced query and reporting features with flexible filtering

⏰ **Participation Tracking**: Accurately tracks user participation time and engagement patterns

🌏 **Timezone-Aware**: Built on Luxon for reliable timezone handling and date normalization

⚡ **Fast & Modern**: Developed in TypeScript for robust type safety and performance

🧪 **Test Coverage**: Includes comprehensive test suites using Vitest

🛠️ **Modular Design**: Clean, extensible structure with isolated analytics modules

🔐 **Authentication Agnostic**: Compatible with any GitHub token (PAT, OAuth, etc.)

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

// Get both user created and participated(by comment or review) PRs
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

console.log('🐙📊 User Created PRs:\n', results.created);
console.log('🐙📊 User Participated PRs:\n', results.participated);
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
  separatePRListByUserParticipation,
  getUserPRRatio,
  getAllPRListInPeriod,
} from '@octoreport/core';
//Each function provides fine-grained access to user-created and participated PRs with various filtering options, label breakdowns, and statistical ratios.

// Get both user created and participated PRs
const totalPRActivities = await getUserPRListByCreationAndParticipation({
  username: 'octocat',
  repository: 'octoreport/core',
  period: {
    startDate: '2025-07-01',
    endDate: '2025-07-20',
  },
  githubToken: 'YOUR_GITHUB_TOKEN',
});

// Get only user created PRs
const createdPRs = await getUserCreatedPRListInPeriod({
  username: 'octocat',
  repository: 'octoreport/core',
  period: {
    startDate: '2025-07-01',
    endDate: '2025-07-20',
  },
  githubToken: 'YOUR_GITHUB_TOKEN',
});

// Get only user participated PRs
const participatedPRs = await getUserParticipatedPRListInPeriod({
  username: 'octocat',
  repository: 'octoreport/core',
  period: {
    startDate: '2025-07-01',
    endDate: '2025-07-20',
  },
  githubToken: 'YOUR_GITHUB_TOKEN',
});

// Get all PRs in period (including those without detail data)
const allPRs = await getAllPRListInPeriod({
  username: 'octocat',
  repository: 'octoreport/core',
  period: {
    startDate: '2025-07-01',
    endDate: '2025-07-20',
  },
  githubToken: 'YOUR_GITHUB_TOKEN',
});

// Separate PRs by user participation
const { created, participated } = separatePRListByUserParticipation(allPRs, 'octocat');

// Get user PR ratio (created vs total)
const userRatio = getUserPRRatio(allPRs, 'octocat');
// Returns: 0.25 (25% of PRs were created by the user)

// Get count of created PRs
const prCount = getUserCreatedPRCountInPeriod(createdPRs);

// Filter PRs by labels
const bugPRs = getUserCreatedPRListInPeriodByLabel(createdPRs, ['enhancement', 'bugfix']);

// Get label statistics
const labelStats = await getUserPRCountByLabelInPeriod(createdPRs);
// Returns: { 'bug': 5, 'feature': 3, 'docs': 2 }
```

### Analytics Functions

```typescript
import {
  calculateUserPRStatistics,
  calculateUserReviewStatistics,
  getFirstParticipationTime,
} from '@octoreport/core';

// Get comprehensive user PR statistics
const userStats = calculateUserPRStatistics(allPRs, 'octocat');
// Returns detailed statistics including counts, ratios, and breakdowns

// Get user review statistics
const reviewStats = calculateUserReviewStatistics(allPRs, 'octocat');
// Returns review participation statistics

// Get first participation time for a user
const firstParticipation = getFirstParticipationTime(participationData, 'octocat');
// Returns: '2025-07-15T10:30:00Z' or null if no participation
```

- Use these functions to compute:
  - Participation breakdowns
  - Review contribution stats
  - First-time engagement timestamps

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

- Provides lightweight wrappers for GitHub GraphQL and REST API operations.

## Data Structure

All PRs follow the same normalized structure:

```typescript
interface PR {
  // Basic PR information (always available)
  number: number;
  title: string;
  url: string;
  createdAt: string;
  user: string | null;

  // Detailed information (may be null if API access is limited)
  targetBranch?: string;
  assignees?: string[];
  state?: 'OPEN' | 'CLOSED' | 'MERGED';
  merged?: boolean;
  isDraft?: boolean;
  mergeable?: 'MERGEABLE' | 'CONFLICTING' | 'UNKNOWN';
  labels?: string[] | null;
  author?: string | null;
  reviewers?: string[] | null;
  commenters?: string[] | null;
  reviewDecision?: 'CHANGES_REQUESTED' | 'APPROVED' | 'REVIEW_REQUIRED' | null;
  mergedAt?: string | null;
  requestedReviewers?: string[] | null;

  // Participation data
  reviews?: (ReviewsRaw | null)[] | null;
  comments?: CommentsRaw[] | null;
}

interface Participation {
  author?: { login: string };
  createdAt?: string;
  submittedAt?: string;
}
```

## Architecture

The library is organized into modular components for better maintainability:

```
src/core/pr/
├── analytics/          # Analytics and statistics functions
│   ├── counts.ts      # Counting functions
│   ├── groups.ts      # Grouping functions
│   ├── statistics.ts  # Statistical calculations
│   ├── participations.ts # Participation tracking
│   └── types.ts       # Analytics-specific types
├── filters.ts         # PR filtering functions
├── queries.ts         # Data retrieval functions
└── normalize.ts       # Data normalization
```

## Security

This library does not store tokens or credentials.
It is authentication agnostic and accepts any valid GitHub token.

**Required scopes:**

- `repo` (private repo access)
- `read:user`

## Development

### Setup

```bash
git clone https://github.com/octoreport/core.git
cd core
npm install
```

### Scripts

```bash
npm run build         # Build the library
npm test              # Run all tests
npm run lint          # Lint source
npm run lint:fix      # Fix lint issues
npm run format        # Format code
```

### Testing

```bash
npm test              # Run all tests
npm run dev:test      # Run tests in watch mode
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

**Security Note**: This repo uses detect-secrets in pre-commit and CI.
All contributors must have detect-secrets installed and an up-to-date `.secrets.baseline`.

Quick start:

```bash
brew install pipx
pipx install detect-secrets
detect-secrets scan > .secrets.baseline
git add .secrets.baseline
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [luxon](https://moment.github.io/luxon/) for timezone handling
- [@octokit/rest](https://github.com/octokit/rest.js) for GitHub API integration patterns
