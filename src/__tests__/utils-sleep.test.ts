import { describe, it, expect, vi } from "vitest";
import { sleep } from "../utils";

describe("sleep", () => {
  it("resolves after delay", async () => {
    vi.useFakeTimers();
    const p = sleep(100);
    vi.advanceTimersByTime(100);
    await expect(p).resolves.toBeUndefined();
    vi.useRealTimers();
  });
});
