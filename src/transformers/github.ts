import { PRListItemRaw, PRDetailRaw } from '@/schemas';
import { PR, PRListItem, PRDetail } from '@/types';

function transformPRListItem(listItem: PRListItemRaw): PRListItem {
  return {
    number: listItem.number,
    title: listItem.title,
    url: listItem.html_url,
    createdAt: listItem.created_at,
    user: listItem.user?.login ?? null,
  };
}

function transformPRDetail(detail: PRDetailRaw): PRDetail {
  return {
    labels: getArrayOrNull(detail.labels?.nodes, (label) => label.name),
    author: detail.author?.login ?? null,
    assignees: detail.assignees.nodes.map((assignee) => assignee.login).sort(),
    reviewers: getArrayOrNull(detail.reviews?.nodes, (review) => review?.author?.login),
    commenters: getArrayOrNull(detail.comments?.nodes, (comment) => comment.author?.login),
    targetBranch: detail.baseRefName,
    state: detail.state,
    isDraft: detail.isDraft,
    merged: detail.merged,
    mergeable: detail.mergeable,
    mergedAt: detail.mergedAt,
    reviewDecision: detail.reviewDecision ?? null,
    requestedReviewers: getArrayOrNull(detail.reviewRequests?.nodes, (node) => {
      if (!node.requestedReviewer) return null;
      return 'login' in node.requestedReviewer ? node.requestedReviewer.login : null;
    }),
    reviewRequestRecipientSet: getArrayOrNull(detail.timelineItems.nodes, (node) => {
      if (!node.requestedReviewer) return null;
      return 'login' in node.requestedReviewer ? node.requestedReviewer.login : null;
    }),
  };
}

export function combinePRData(listItem: PRListItemRaw, detail: PRDetailRaw | null): PR {
  const listItemData = transformPRListItem(listItem);
  const detailData = detail ? transformPRDetail(detail) : {};

  return {
    ...listItemData,
    ...detailData,
  };
}

function getArrayOrNull<T>(
  arr: T[] | null | undefined,
  extractor: (item: T) => string | null | undefined,
): string[] | null {
  if (!arr) return null;
  const result = arr
    .map(extractor)
    .filter((str): str is string => !!str)
    .sort();
  return result.length > 0 ? result : null;
}
