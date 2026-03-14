import test from "node:test";
import assert from "node:assert/strict";

import { getAllPosts, getPostBySlug } from "../src/lib/blog.ts";

test("parses frontmatter for a standard blog post", () => {
  const post = getPostBySlug("hello-world");

  assert.ok(post);
  assert.equal(post.frontmatter.title, "Hello World");
  assert.equal(post.frontmatter.date, "2026-03-11");
  assert.equal(post.frontmatter.tags.length, 2);
});

test("parses frontmatter for the reinforcement learning post", () => {
  const post = getPostBySlug("reinforcement-learning-overview");

  assert.ok(post);
  assert.equal(post.frontmatter.title, "看懂强化学习：从试错学习到 DQN 与策略梯度");
  assert.notEqual(post.frontmatter.date, "");
  assert.notEqual(post.frontmatter.description, "");
  assert.ok(post.frontmatter.tags.length > 0);
});

test("sorts posts by descending publish date", () => {
  const posts = getAllPosts();

  assert.ok(posts.length >= 2);
  assert.equal(posts[0]?.slug, "reinforcement-learning-overview");
  assert.equal(posts[1]?.slug, "hello-world");
});
