# Skills GitHub Contribution Card Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the detached GitHub activity graph with an integrated GitHub contribution card inside the Skills section and simplify the surrounding skill widgets.

**Architecture:** Keep the existing Skills section entry point, but collapse GitHub data and contribution rendering into a single `GitHubWidget`. Use `react-activity-calendar` for the heatmap, fetch GitHub profile and repository stats on the client, and transform contribution data into theme-aware calendar values. Simplify `SkillWidget` to a static card so the GitHub card becomes the visual anchor.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, Framer Motion, react-activity-calendar

---

### Task 1: Prepare dependency and contribution data flow

**Files:**
- Modify: `package.json`
- Create: `src/lib/github-calendar.ts`

**Step 1: Add the calendar dependency**

Add `react-activity-calendar` to `dependencies`.

**Step 2: Write a transform helper**

Create `src/lib/github-calendar.ts` with:
- typed contribution day interface
- typed API response interface
- helper that maps API days into `react-activity-calendar` values
- theme color presets for light and dark mode

**Step 3: Verify type-level integration**

Run: `npm install`
Expected: lockfile updates and dependency installs cleanly.

### Task 2: Rebuild the GitHub widget as a single card

**Files:**
- Modify: `src/components/ui/GitHubWidget.tsx`

**Step 1: Remove the detached line graph export**

Delete the standalone `GitHubActivityGraph` component and fold all GitHub visuals into the main widget.

**Step 2: Fetch contributions and stats**

Update the widget to load:
- profile stats from GitHub REST
- repository stats from GitHub REST
- contribution days from a third-party contributions endpoint

**Step 3: Render the new card layout**

Build one large card with:
- header and external GitHub link
- compact stats row
- embedded contribution heatmap panel
- short curated repo list

### Task 3: Simplify the Skills grid and small cards

**Files:**
- Modify: `src/components/sections/Skills.tsx`
- Modify: `src/components/ui/SkillWidget.tsx`

**Step 1: Remove the extra full-width graph row**

Keep only the mixed widget grid in `Skills.tsx`.

**Step 2: Simplify small skill cards**

Replace flip interaction with a static card design that matches the cleaner GitHub card direction.

### Task 4: Verify

**Files:**
- Verify current workspace changes only

**Step 1: Run lint**

Run: `npm run lint`
Expected: exit code 0.

**Step 2: Run build**

Run: `npm run build`
Expected: exit code 0.
