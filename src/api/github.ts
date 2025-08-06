import { DateTime } from 'luxon';
import { z } from 'zod';

import {
  PRListResponseSchema,
  PRDetailResponseSchema,
  PRListItemRaw,
  PRDetailRaw,
  GitHubUserInfoSchema,
  GitHubUserInfo,
} from '@/schemas';
import { combinePRData } from '@/transformers';
import { PRQueryParams, PR, DateRange } from '@/types';

function validateApiResponse<T>(data: unknown, schema: z.ZodSchema<T>): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`API response validation failed: ${error.message}`);
    }
    throw error;
  }
}

export function convertDateToUTCISO(date: string, type: 'start' | 'end' = 'start'): string | null {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const local = DateTime.fromISO(date, { zone: timeZone });
  if (type === 'start') {
    return local.startOf('day').toUTC().toISO();
  }
  return local.endOf('day').toUTC().toISO();
}

export function convertPeriodToUTCISO(period: DateRange): DateRange {
  const startDate = convertDateToUTCISO(period.startDate, 'start') ?? period.startDate;
  const endDate = convertDateToUTCISO(period.endDate, 'end') ?? period.endDate;
  return { startDate, endDate };
}

export async function fetchGitHubUserInfo(githubToken: string): Promise<GitHubUserInfo> {
  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${githubToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        {
          viewer {
            login
            email
          }
        }
      `,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const scopesHeader = response.headers.get('x-oauth-scopes');
  if (!scopesHeader) {
    throw new Error('Invalid response structure: missing x-oauth-scopes header');
  }
  const scopeList = scopesHeader.split(',').map((scope) => scope.trim());

  const data = await response.json();
  if (data.errors) {
    const errorMessage = data.errors[0]?.message || 'GraphQL error occurred';
    throw new Error(`GraphQL error: ${errorMessage}`);
  }
  if (!data.data) {
    throw new Error('Invalid response structure: missing data field');
  }
  if (!data.data.viewer) {
    throw new Error('Invalid response structure: missing viewer field');
  }

  try {
    const validatedUserInfo = GitHubUserInfoSchema.parse({
      ...data.data.viewer,
      scopeList,
    });
    return validatedUserInfo;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`User info validation failed: ${error.message}`);
    }
    throw error;
  }
}

export async function fetchPRListInPeriod(
  options: Pick<PRQueryParams, 'repository' | 'period' | 'githubToken'>,
): Promise<PRListItemRaw[]> {
  let page = 1;
  const prList: PRListItemRaw[] = [];
  const [owner, repo] = options.repository.split('/');

  while (true) {
    const { startDate, endDate } = convertPeriodToUTCISO(options.period);
    const url = `https://api.github.com/search/issues?q=repo:${owner}/${repo}+is:pr+created:${startDate}..${endDate}&sort=created&order=asc&per_page=100&page=${page}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${options.githubToken}`,
        Accept: 'application/vnd.github+json',
      },
    });

    if (!response.ok) {
      switch (response.status) {
        case 422:
          throw new Error(
            `⚠️ It looks like your GitHub token isn’t authorized via SAML SSO for the private repository you’re trying to access.
Please visit 📎 https://github.com/settings/tokens, locate your token, click “Configure SSO”, and approve it for your organization.
Once you’ve completed SSO authorization, run the command again.`,
          );
        default:
          throw new Error(`HTTP error! status: ${response.status}`);
      }
    }

    const rawData = await response.json();

    const validatedData = validateApiResponse(rawData, PRListResponseSchema);

    if (validatedData.items.length === 0) {
      break;
    }

    prList.push(...validatedData.items);

    if (!response.headers.get('Link')?.includes('rel="next"')) {
      break;
    }
    page++;
  }

  return prList;
}

export async function fetchPRDetail({
  repository,
  githubToken,
  prNumber,
}: Pick<PRQueryParams, 'repository' | 'githubToken'> & {
  prNumber: number;
}): Promise<PRDetailRaw | null> {
  const [owner, repo] = repository.split('/');
  const query = `query ($owner: String!, $repo: String!, $number: Int!) {
    repository(owner: $owner, name: $repo) {
      pullRequest(number: $number) {
        title
        author { login }
        baseRefName
        assignees(first: 10) { nodes { login } }
        reviews(first: 50) { nodes { author { login }, submittedAt } }
        reviewRequests(first: 50) { nodes { requestedReviewer { ... on User { login } } } }
        comments(first: 50) { nodes { author { login }, createdAt } }
        labels(first: 50) { nodes { name } }
        state
        isDraft
        merged
        mergeable
        mergedAt
        reviewDecision
        timelineItems(first: 100, itemTypes: [REVIEW_REQUESTED_EVENT]) {
          nodes {
            ... on ReviewRequestedEvent {
              requestedReviewer {
                ... on User { login }
              }
              createdAt
            }
          }
        }
      }
    }
  }`;

  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${githubToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: {
        owner,
        repo,
        number: prNumber,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const rawData = await response.json();

  if (rawData.errors) {
    throw new Error(`GraphQL error: ${rawData.errors[0]?.message || 'Unknown error'}`);
  }

  const validatedData = validateApiResponse(rawData, PRDetailResponseSchema);

  return validatedData.data.repository.pullRequest;
}

export async function fetchAllPRListInPeriod(
  options: Pick<PRQueryParams, 'repository' | 'period' | 'githubToken'>,
): Promise<PR[]> {
  const allPRListItems = await fetchPRListInPeriod(options);
  const prList: PR[] = [];
  const { repository, githubToken } = options;

  await Promise.all(
    allPRListItems.map(async (prItem) => {
      try {
        const prDetail = await fetchPRDetail({
          repository,
          githubToken,
          prNumber: prItem.number,
        });
        const prData = combinePRData(prItem, prDetail);
        prList.push(prData);
      } catch (error) {
        console.warn(`⚠️ Failed to process PR #${prItem.number}: ${error}`);
      }
    }),
  );

  prList.sort((a, b) => a.number - b.number);
  return prList;
}

export async function testGitHubToken(githubToken: string): Promise<void> {
  try {
    console.log('🔍 Testing GitHub token...');

    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${githubToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          {
            viewer {
              login
              email
            }
          }
        `,
      }),
    });

    console.log('📊 Response status:', response.status);
    console.log('📊 Response headers:', Object.fromEntries(response.headers.entries()));

    const data = await response.json();
    console.log('📊 Raw response:', JSON.stringify(data, null, 2));

    if (data.errors) {
      console.error('❌ GraphQL errors:', data.errors);
      throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
    }

    if (!data.data?.viewer) {
      console.error('❌ No viewer data in response');
      throw new Error('No viewer data in response');
    }

    // Zod 스키마로 검증
    try {
      const validatedUserInfo = GitHubUserInfoSchema.parse(data.data.viewer);
      console.log('✅ Token is valid! User:', validatedUserInfo.login);
      console.log('📧 Email:', validatedUserInfo.email);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('❌ User info validation failed:', error.message);
        throw new Error(`User info validation failed: ${error.message}`);
      }
      throw error;
    }
  } catch (error) {
    console.error('❌ Token test failed:', error);
    throw error;
  }
}
