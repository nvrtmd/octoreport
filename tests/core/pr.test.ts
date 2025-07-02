import { describe, expect, it } from "vitest";
import { getUserCreatedPRListInPeriod } from "../../src/core";
import { config } from "dotenv";
config();

describe("getCreatedPRs", () => {
  it("returns an empty array when the user has no pull requests in the given period", async () => {
    const result = await getUserCreatedPRListInPeriod({
      githubToken: process.env.GITHUB_TOKEN ?? "",
      username: "gaearon",
      repository: "bluesky-social/social-app",
      period: { startDate: "2020-11-01", endDate: "2020-11-30" },
      targetBranch: "main",
    });

    expect(result).toEqual([]);
  });

  it("returns pull requests created by the user within the specified date range", async () => {
    const result = await getUserCreatedPRListInPeriod({
      githubToken: process.env.GITHUB_TOKEN ?? "",
      username: "gaearon",
      repository: "bluesky-social/social-app",
      period: { startDate: "2024-11-20", endDate: "2024-11-30" },
      targetBranch: "main",
    });

    expect(result).toMatchSnapshot();
  });

  it("filters pull requests that target a specific branch", async () => {
    const result = await getUserCreatedPRListInPeriod({
      githubToken: process.env.GITHUB_TOKEN ?? "",
      username: "zpao",
      repository: "facebook/react",
      period: { startDate: "2021-04-10", endDate: "2021-04-20" },
      targetBranch: "facebook:master",
    });

    expect(result).toMatchSnapshot();
  });
});
