import { PRListItem, PRDetail } from '../schemas/github';
import { PR } from '../types';

function transformPRListItem(
  listItem: PRListItem,
): Pick<PR, 'number' | 'title' | 'url' | 'createdAt' | 'mergedAt'> {
  return {
    number: listItem.number,
    title: listItem.title,
    url: listItem.html_url,
    createdAt: listItem.created_at,
    mergedAt: listItem.pull_request.merged_at ?? undefined,
  };
}

function transformPRDetail(
  detail: PRDetail,
): Omit<PR, 'number' | 'title' | 'url' | 'createdAt' | 'mergedAt'> {
  return {
    labels: detail.labels.nodes.map((label) => label.name).sort(),
    author: detail.author.login,
    reviewers: detail.reviews.nodes.map((review) => review.author.login).sort(),
    comments: detail.comments?.nodes.map((comment) => comment.author.login).sort() ?? [],
    targetBranch: detail.baseRefName,
    state: detail.state,
    isDraft: detail.isDraft,
    merged: detail.merged,
    mergeable: detail.mergeable,
    reviewDecision: detail.reviewDecision,
  };
}

export function combinePRData(listItem: PRListItem, detail: PRDetail): PR {
  const listItemData = transformPRListItem(listItem);
  const detailData = transformPRDetail(detail);

  return {
    ...listItemData,
    ...detailData,
  };
}
