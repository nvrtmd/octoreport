import { z } from 'zod';

const LabelSchema = z.object({
  name: z.string(),
});

const UserSchema = z.object({
  login: z.string(),
});

export const GitHubUserInfoSchema = z.object({
  login: z.string(),
  email: z.string().email(),
  scopeList: z.array(z.string()).refine(
    (scopeList) => {
      const hasReadUser = scopeList.includes('read:user');
      const hasUserEmail = scopeList.includes('user:email');
      const hasRepoScope = scopeList.includes('repo') || scopeList.includes('public_repo');

      return hasReadUser && hasUserEmail && hasRepoScope;
    },
    {
      message: `Scope list must include 'read:user', 'user:email', and either 'repo' or 'public_repo'`,
    },
  ),
});

export type GitHubUserInfo = z.infer<typeof GitHubUserInfoSchema>;

const ReviewSchema = z.object({
  author: UserSchema.nullable(),
  submittedAt: z.string().nullable(),
});

const CommentSchema = z.object({
  author: UserSchema.nullable(),
  createdAt: z.string(),
});

const PartialUserSchema = UserSchema.partial();

const RequestedReviewerSchema = PartialUserSchema.or(
  z.object({ name: z.null() }).partial(),
).nullable();

const PRListItemSchema = z.object({
  number: z.number(),
  title: z.string(),
  html_url: z.string(),
  created_at: z.string(),
  user: UserSchema.nullable(),
});

export const PRListResponseSchema = z.object({
  items: z.array(PRListItemSchema),
  total_count: z.number(),
  incomplete_results: z.boolean(),
});

export type PRListItemRaw = z.infer<typeof PRListItemSchema>;
export type PRListResponseRaw = z.infer<typeof PRListResponseSchema>;

const PRDetailSchema = z.object({
  title: z.string(),
  author: UserSchema.nullable(),
  labels: z
    .object({
      nodes: z.array(LabelSchema),
    })
    .nullable(),
  reviews: z
    .object({
      nodes: z.array(ReviewSchema.nullable()),
    })
    .nullable(),
  baseRefName: z.string(),
  assignees: z.object({
    nodes: z.array(UserSchema),
  }),
  reviewRequests: z
    .object({
      nodes: z.array(
        z.object({
          requestedReviewer: RequestedReviewerSchema,
        }),
      ),
    })
    .optional(),
  comments: z.object({
    nodes: z.array(CommentSchema).nullable(),
  }),
  state: z.enum(['OPEN', 'CLOSED', 'MERGED']),
  isDraft: z.boolean(),
  merged: z.boolean(),
  mergedAt: z.string().nullable().optional(),
  mergeable: z.enum(['MERGEABLE', 'CONFLICTING', 'UNKNOWN']),
  reviewDecision: z.enum(['CHANGES_REQUESTED', 'APPROVED', 'REVIEW_REQUIRED']).nullable(),
  timelineItems: z.object({
    nodes: z
      .array(
        z.object({
          requestedReviewer: RequestedReviewerSchema,
          createdAt: z.string().optional(),
        }),
      )
      .nullable(),
  }),
});

export const PRDetailResponseSchema = z.object({
  data: z.object({
    repository: z.object({
      pullRequest: PRDetailSchema.nullable(),
    }),
  }),
});

export type PRDetailRaw = z.infer<typeof PRDetailSchema>;
export type PRDetailResponseRaw = z.infer<typeof PRDetailResponseSchema>;
export type ReviewsRaw = z.infer<typeof ReviewSchema>;
export type CommentsRaw = z.infer<typeof CommentSchema>;
