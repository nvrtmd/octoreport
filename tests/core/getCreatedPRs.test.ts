import { describe, expect, it } from "vitest";
import { getCreatedPRs } from "../../src/core";

describe("getCreatedPRs", () => {
  it("returns an empty array when the user has no pull requests in the given period", async () => {
    const result = await getCreatedPRs({
      username: "nonexistent-user-xyz",
      repository: "nonexistent-repo-xyz",
      period: { from: "2025-01-01", to: "2025-01-31" },
      targetBranch: "main",
    });

    expect(result).toEqual([]);
  });
});
