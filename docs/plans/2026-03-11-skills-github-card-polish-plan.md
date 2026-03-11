# Skills GitHub Card Polish Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refine the new Skills section so the GitHub contribution card feels like the primary visual anchor and the small skill cards support it more cleanly.

**Architecture:** Keep the existing mixed-grid layout, but deepen the internal presentation of `GitHubWidget` with profile-style metadata, a framed heatmap module, and pinned-repo styling. Simplify `SkillWidget` hierarchy with metadata and quieter chip treatment.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, Framer Motion, react-activity-calendar

---

### Task 1: Polish the GitHub overview card

**Files:**
- Modify: `src/components/ui/GitHubWidget.tsx`

**Step 1: Enrich the card header**

Show clearer profile metadata and stronger section labels.

**Step 2: Refine the contribution module**

Add framing, legend details, and more intentional spacing around the heatmap.

**Step 3: Restyle repositories**

Make top repositories look closer to compact pinned cards than simple rows.

### Task 2: Quiet down the skill cards

**Files:**
- Modify: `src/components/ui/SkillWidget.tsx`

**Step 1: Improve hierarchy**

Add category metadata and skill count.

**Step 2: Reduce competition**

Tone down glow, chips, and decorative noise so the GitHub card remains the focal point.

### Task 3: Verify

**Files:**
- Verify: `src/components/ui/GitHubWidget.tsx`
- Verify: `src/components/ui/SkillWidget.tsx`

**Step 1: Run targeted lint**

Run: `npx eslint src/components/ui/GitHubWidget.tsx src/components/ui/SkillWidget.tsx`
Expected: exit code 0.

**Step 2: Run production build**

Run: `npm run build`
Expected: exit code 0.
