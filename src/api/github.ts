import { z } from 'zod';

import {
  PRListResponseSchema,
  PRDetailResponseSchema,
  PRListItem,
  PRDetail,
} from '../schemas/github';
import { combinePRData } from '../transformers/github';
import { ActivityQueryOptions, PR } from '../types';

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

export async function fetchPRListInPeriod(
  options: Pick<ActivityQueryOptions, 'repository' | 'period' | 'githubToken'>,
): Promise<PRListItem[]> {
  let page = 1;
  const prList: PRListItem[] = [];
  const [owner, repo] = options.repository.split('/');

  while (true) {
    const url = `https://api.github.com/search/issues?q=repo:${owner}/${repo}+is:pr+created:${options.period.startDate}..${options.period.endDate}&sort=created&order=asc&per_page=100&page=${page}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${options.githubToken}`,
        Accept: 'application/vnd.github+json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
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
}: {
  repository: string;
  githubToken: string;
  prNumber: number;
}): Promise<PRDetail> {
  const [owner, repo] = repository.split('/');
  const query = `query ($owner: String!, $repo: String!, $number: Int!) {
    repository(owner: $owner, name: $repo) {
      pullRequest(number: $number) {
        title
        author { login }
        baseRefName
        assignees(first: 10) { nodes { login } }
        reviews(first: 100) { nodes { author { login }, submittedAt } }
        reviewRequests(first: 10) { nodes { requestedReviewer { ... on User { login } } } }
        comments(first: 10) { nodes { author { login }, createdAt } }
        labels(first: 10) { nodes { name } }
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
  options: Pick<ActivityQueryOptions, 'repository' | 'period' | 'githubToken'>,
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
        console.error(`Failed to process PR #${prItem.number}:`, error);
      }
    }),
  );

  prList.sort((a, b) => a.number - b.number);
  return prList;
}
