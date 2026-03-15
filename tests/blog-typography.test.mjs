import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const css = fs.readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");

test("blog prose line-height stays moderately compact", () => {
  assert.ok(css.includes("line-height: 1.84;"));
});

test("blog lead paragraph line-height also stays compact", () => {
  assert.ok(css.includes(".prose-custom > p:first-of-type"));
  assert.ok(css.includes("line-height: 1.82;"));
});
