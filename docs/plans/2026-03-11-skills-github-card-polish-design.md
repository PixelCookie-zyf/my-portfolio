# Skills GitHub Card Polish Design

Date: 2026-03-11

## Goal

Push the new GitHub contribution card from "functional widget" to "section anchor" and make the surrounding skill cards feel quieter and more intentional.

## Approaches Considered

### 1. Minimal polish
- Adjust spacing, shadows, and border treatments only
- Lowest risk, but the GitHub card would still feel like a generic dashboard block

### 2. Profile-inspired overview panel
- Make the GitHub card feel closer to a compact GitHub profile summary
- Add stronger hierarchy: profile header, contribution heatmap module, pinned repo treatment, custom legend/details
- Keep skill cards visually simpler so GitHub remains the focal point

### 3. Asymmetric section redesign
- Rework the full Skills layout into a more editorial composition
- Highest visual upside, but larger scope than needed for this iteration

## Recommendation

Choose approach 2.

It keeps the current structure intact while making the GitHub card look designed rather than embedded. It also avoids reopening the overall layout and stays aligned with the user's request to improve the GitHub portion specifically.

## Design Details

### GitHub Card
- Keep one large integrated card
- Add a stronger profile-summary header with clearer metadata
- Treat the contribution graph as an inset module with subtle frame styling
- Add a lightweight legend / summary row so the heatmap feels intentional
- Style repo links closer to "pinned repositories" instead of plain stat rows

### Skill Cards
- Reduce visual competition with the GitHub card
- Add category count / micro-labels for better hierarchy
- Keep card glow restrained and content easier to scan

## Constraints

- Preserve light/dark mode parity
- Avoid introducing server-side data fetching complexity
- Keep the implementation inside the current client-side architecture
