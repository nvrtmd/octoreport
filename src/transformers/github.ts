import { PRListItem, PRDetail } from "../schemas/github";
import { PR } from "../types";

function transformPRListItem(
  listItem: PRListItem,
): Omit<PR, "labels" | "author" | "reviewers"> {
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
): Pick<PR, "labels" | "author" | "reviewers"> {
  return {
    labels: detail.labels.nodes.map((label) => label.name).sort(),
    author: detail.author.login,
    reviewers: detail.reviews.nodes.map((review) => review.author.login).sort(),
  };
}

export function combinePRData(listItem: PRListItem, detail: PRDetail): PR {
  const prSummary = transformPRListItem(listItem);
  const prDetail = transformPRDetail(detail);

  return {
    ...prSummary,
    ...prDetail,
  };
}
