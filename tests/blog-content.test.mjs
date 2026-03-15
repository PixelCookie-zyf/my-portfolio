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
  assert.match(post.frontmatter.description, /贝尔曼方程/u);
  assert.notEqual(post.frontmatter.date, "");
  assert.notEqual(post.frontmatter.description, "");
  assert.ok(post.frontmatter.tags.length > 0);
});

test("keeps the reinforcement learning post mathematically grounded", () => {
  const post = getPostBySlug("reinforcement-learning-overview");

  assert.ok(post);
  assert.ok(post.content.includes("$s \\in \\mathcal{S}$"));
  assert.ok(post.content.includes("$a \\in \\mathcal{A}$"));
  assert.ok(post.content.includes("$\\pi(a|s)$"));
  assert.ok(post.content.includes("V_\\pi(s) = \\mathbb{E}_\\pi"));
  assert.ok(post.content.includes("Q_\\pi(s, a) = \\mathbb{E}_\\pi"));
  assert.ok(post.content.includes("\\nabla_\\theta J(\\theta)"));
  assert.ok(!post.content.includes("RLVR"));
});

test("sorts posts by descending publish date", () => {
  const posts = getAllPosts();

  assert.ok(posts.length >= 2);
  assert.equal(posts[0]?.slug, "reinforcement-learning-overview");
  assert.equal(posts[1]?.slug, "hello-world");
});
