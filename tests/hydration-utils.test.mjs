import test from "node:test";
import assert from "node:assert/strict";

import {
  canRenderThemeToggle,
  getClientHydratedSnapshot,
  getServerHydratedSnapshot,
} from "../src/lib/hydration.ts";

test("does not render theme toggle before hydration finishes", () => {
  assert.equal(canRenderThemeToggle(false, "dark"), false);
  assert.equal(canRenderThemeToggle(false, undefined), false);
});

test("only renders theme toggle after hydration when theme is known", () => {
  assert.equal(canRenderThemeToggle(true, undefined), false);
  assert.equal(canRenderThemeToggle(true, "dark"), true);
  assert.equal(canRenderThemeToggle(true, "light"), true);
});

test("uses stable hydration snapshots for server and client", () => {
  assert.equal(getServerHydratedSnapshot(), false);
  assert.equal(getClientHydratedSnapshot(), true);
});
