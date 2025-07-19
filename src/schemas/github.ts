import { z } from 'zod';

const PRListItemSchema = z.object({
  number: z.number(),
  title: z.string(),
  html_url: z.string(),
  created_at: z.string(),
  state: z.enum(['open', 'closed']),
  draft: z.boolean().optional(),
  user: z.object({
    login: z.string(),
  }),
  pull_request: z.object({
    merged_at: z.string().nullable(),
  }),
});

export const PRListResponseSchema = z.object({
  items: z.array(PRListItemSchema),
  total_count: z.number(),
  incomplete_results: z.boolean(),
});

export type PRListItem = z.infer<typeof PRListItemSchema>;
export type PRListResponse = z.infer<typeof PRListResponseSchema>;

const LabelSchema = z.object({
  name: z.string(),
});

const UserSchema = z.object({
  login: z.string(),
});

const ReviewSchema = z.object({
  author: UserSchema,
  submittedAt: z.string().nullable(),
});

const PRDetailSchema = z.object({
  title: z.string(),
  author: UserSchema,
  labels: z.object({
    nodes: z.array(LabelSchema),
  }),
  reviews: z.object({
    nodes: z.array(ReviewSchema),
  }),
  baseRefName: z.string().optional(),
  assignees: z
    .object({
      nodes: z.array(UserSchema),
    })
    .optional(),
  reviewRequests: z
    .object({
      nodes: z.array(
        z.object({
          requestedReviewer: UserSchema.nullable(),
        }),
      ),
    })
    .optional(),
  comments: z
    .object({
      nodes: z.array(
        z.object({
          author: UserSchema,
          createdAt: z.string(),
        }),
      ),
    })
    .optional(),
  state: z.enum(['OPEN', 'CLOSED', 'MERGED']),
  isDraft: z.boolean(),
  merged: z.boolean(),
  mergedAt: z.string().nullable().optional(),
  mergeable: z.enum(['MERGEABLE', 'CONFLICTING', 'UNKNOWN']),
  reviewDecision: z.enum(['CHANGES_REQUESTED', 'APPROVED', 'REVIEW_REQUIRED']).nullable(),
});

export const PRDetailResponseSchema = z.object({
  data: z.object({
    repository: z.object({
      pullRequest: PRDetailSchema,
    }),
  }),
});

export type PRDetail = z.infer<typeof PRDetailSchema>;
export type PRDetailResponse = z.infer<typeof PRDetailResponseSchema>;
