import { config } from "dotenv";
import { describe, expect, it } from "vitest";

import { fetchPRDetail, fetchPRListInPeriod } from "../../src/api";
config();

describe("fetchPRListInPeriod", () => {
  it("returns every pull request in the given repository and period", async () => {
    const result = await fetchPRListInPeriod({
      githubToken: process.env.GITHUB_TOKEN ?? "",
      repository: "facebook/react",
      period: { startDate: "2016-03-01", endDate: "2016-03-05" },
    });

    expect(result).toMatchSnapshot();
  });
});

describe("fetchPRDetail", () => {
  it("returns every pull request detail in the given repository and period", async () => {
    const result = await fetchPRDetail({
      githubToken: process.env.GITHUB_TOKEN ?? "",
      repository: "facebook/react",
      prNumber: 6129,
    });

    expect(result).toMatchSnapshot();
  });
});
