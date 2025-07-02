import { describe, expect, it } from "vitest";
import { getCreatedPRList } from "../../src/core";
import { config } from "dotenv";
config();

describe("getCreatedPRs", () => {
  it("returns an empty array when the user has no pull requests in the given period", async () => {
    const result = await getCreatedPRList({
      githubToken: process.env.GITHUB_TOKEN ?? "",
      username: "gaearon",
      repository: "bluesky-social/social-app",
      period: { startDate: "2020-11-01", endDate: "2020-11-30" },
      targetBranch: "main",
    });

    expect(result).toEqual([]);
  });
});
