import test from "node:test";
import assert from "node:assert/strict";

import { calculateCurrentStreak } from "../src/lib/github-calendar.ts";

// A normalized API response contains one entry per day, ending today.
function daysEndingToday(counts) {
  return counts.map((count, index) => ({
    date: `2026-09-${String(22 - counts.length + index + 1).padStart(2, "0")}`,
    count,
    level: count > 0 ? 1 : 0,
  }));
}

test("counts the current streak through today and stops at its first gap", () => {
  assert.equal(calculateCurrentStreak(daysEndingToday([4, 0, 1, 2, 3])), 3);
});

test("keeps yesterday's streak while today has no contributions yet", () => {
  assert.equal(calculateCurrentStreak(daysEndingToday([4, 0, 1, 2, 0])), 2);
});

test("ends the current streak when both yesterday and today are empty", () => {
  assert.equal(calculateCurrentStreak(daysEndingToday([2, 3, 0, 0])), 0);
});

test("returns zero when the only recorded day has no contributions", () => {
  assert.equal(calculateCurrentStreak(daysEndingToday([0])), 0);
});

test("returns zero for an empty contribution history", () => {
  assert.equal(calculateCurrentStreak([]), 0);
});
