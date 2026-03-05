# Pixel Experience Assets Guide

## Overview

This folder contains pixel art assets for the Experience section "Life Journey Road".
The scene is a continuous horizontal path showing 5 life stages from left to right.

## Technical Specifications

- **Format**: PNG with Pure white background (alpha channel)
- **Art Style**: Pixel art, 16-bit retro game aesthetic
- **Color Palette**: Consistent warm/vibrant palette across all assets
- **Rendering**: Will be displayed with `image-rendering: pixelated` (nearest-neighbor scaling)
- **IMPORTANT**: All assets must have **Pure white backgrounds** (no solid color backgrounds)

---

## 1. Characters (`/characters/`)

Each character is a **sprite sheet** — a single horizontal strip PNG with multiple frames side by side.

### Specifications

| Property | Value |
|----------|-------|
| Frame Size | **64x64 pixels** per frame |
| Animation Frames | **4 frames** per animation (idle/breathing loop) |
| Sprite Sheet Size | **256x64 pixels** (4 frames x 64px wide) |
| Background | **Pure white** |
| Scale on Screen | Displayed at 128-192px (2x-3x scale) |

### Character Consistency Guide

**IMPORTANT**: All 5 characters represent the **same person** at different life stages.
To ensure visual consistency across all character sprites, every prompt includes the same base traits:

- **Same person**: Young male Chinese, slim build, medium height
- **Hair**: Black textured fringe/bangs covering forehead (Korean-style "碎盖" haircut), slightly messy and layered
- **Glasses**: Black-framed rectangular glasses (present in ALL sprites)
- **Skin tone**: Natural East Asian skin tone
- **Head proportions**: Chibi/cute ratio (~1:2 head-to-body), consistent across all sprites
- **Art style**: Identical pixel art style, same color palette range, same level of detail

When generating, it's best to generate all 5 characters in the **same session/seed** if possible,
to maximize visual consistency.

### Character List

#### `char-undergrad.png` — Undergraduate Student (2018-2022, Hohai University)
- Happy young student with a backpack
- Casual clothes (T-shirt, jeans)
- Black-framed rectangular glasses
- Carrying books or with a backpack on shoulders
- Bright, cheerful expression
- Idle animation: slight bouncing/swaying, happy vibe

**AI Prompt:**
```
Pixel art sprite sheet, 4 frames horizontal strip, 256x64 pixels total, each frame 64x64 pixels.
A cheerful young male Chinese college student, handsome, black textured fringe bangs covering forehead (Korean-style layered bangs haircut), wearing black-framed rectangular glasses,
carrying a backpack, casual outfit (t-shirt and jeans), holding books.
Chibi pixel art proportions (~1:2 head-to-body ratio). 16-bit retro game style, side view facing right.
4-frame idle animation: Swing forward walking. Pure white background, vibrant colors.
(This is character 1/5 of the same person at different life stages — keep consistent face, hair, glasses, body shape)
```

#### `char-master.png` — Master's Graduate (2022-2025, Sun Yat-sen University)
- Wearing graduation robes/academic dress
- Sun Yat-sen University style: black gown + green/dark green hood (SYSU CS department)
- Black-framed rectangular glasses
- Holding diploma or wearing mortarboard cap
- Proud, accomplished expression

**AI Prompt:**
```
Pixel art sprite sheet, 4 frames horizontal strip, 256x64 pixels total, each frame 64x64 pixels.
A young male Chinese graduate student, black textured fringe bangs covering forehead (Korean-style layered bangs haircut), wearing black-framed rectangular glasses,
in academic graduation robes (black gown with dark green hood), wearing a mortarboard cap, holding a diploma scroll.
Chibi pixel art proportions (~1:2 head-to-body ratio). 16-bit retro game style, side view facing right.
4-frame idle animation: holding up diploma proudly, subtle movement. Pure white background.
(This is character 2/5 of the same person at different life stages — keep consistent face, hair, glasses, body shape, more handsome.)
```

#### `char-intern.png` — Tech Intern (2024-2025, Tencent)
- Sitting at or standing near a desk/computer
- Casual tech company attire (hoodie or polo)
- Black-framed rectangular glasses
- Laptop or monitor visible
- Focused/determined expression

**AI Prompt:**
```
Pixel art sprite sheet, 4 frames horizontal strip, 256x64 pixels total, each frame 64x64 pixels.
A young male Chinese tech intern, black textured fringe bangs covering forehead (Korean-style layered bangs haircut), wearing black-framed rectangular glasses,
wearing a casual hoodie, focused expression, sitting at a desk typing on keyboard with laptop/monitor.
Chibi pixel art proportions (~1:2 head-to-body ratio). 16-bit retro game style, side view.
4-frame idle animation: typing motion, looking at screen. Pure white background, blue accent colors.
(This is character 3/5 of the same person at different life stages — keep consistent face, hair, glasses, body shape, more handsome.)
```

#### `char-engineer.png` — Algorithm Engineer at Meituan (2025-Present)
- Professional but casual tech attire
- Black-framed rectangular glasses
- Standing confidently, maybe with a tablet or phone
- Could have algorithm/data visualization elements floating nearby
- Energetic, professional vibe

**AI Prompt:**
```
Pixel art sprite sheet, 4 frames horizontal strip, 256x64 pixels total, each frame 64x64 pixels.
A young male Chinese software engineer, black textured fringe bangs covering forehead (Korean-style layered bangs haircut), wearing black-framed rectangular glasses,
smart casual outfit (button shirt, dark pants), standing confidently with a tablet in hand.
Small floating pixel icons nearby (graph chart, code brackets, neural network node).
Chibi pixel art proportions (~1:2 head-to-body ratio). 16-bit retro game style, side view facing right.
4-frame idle animation: subtle confident stance shift. Pure white background.
(This is character 4/5 of the same person at different life stages — keep consistent face, hair, glasses, body shape, more handsome.)
```

#### `char-phd.png` — PhD Researcher (2027-Future)
- Academic/researcher look with lab coat or scholarly attire
- Black-framed rectangular glasses
- Surrounded by floating question marks or lightbulb/idea symbols
- Mysterious/dreamy/aspirational feel (since it's future)
- Slightly translucent or with sparkle effects to show "future"
- Thoughtful expression

**AI Prompt:**
```
Pixel art sprite sheet, 4 frames horizontal strip, 256x64 pixels total, each frame 64x64 pixels.
A young male Chinese PhD researcher, black textured fringe bangs covering forehead (Korean-style layered bangs haircut), wearing black-framed rectangular glasses,
white lab coat or scholarly cardigan, thoughtful expression, holding a research paper,
with floating pixel sparkles and lightbulb icons. Slightly glowing/ethereal aura to suggest "future".
Chibi pixel art proportions (~1:2 head-to-body ratio). 16-bit retro game style, side view facing right.
4-frame idle animation: thinking pose, sparkles twinkling. Pure white background.
(This is character 5/5 of the same person at different life stages — keep consistent face, hair, glasses, body shape, more handsome.)
```

---

## 2. Scene Backgrounds (`/scenes/`)

Background layers for the road scene. These are wide images that can tile or span the full width.

#### `sky.png` — Sky Background Layer (farthest back)
- **Size**: 1920x200 pixels (or tileable 480x200)
- Gradient sky, pixel art clouds
- Warm sunset/dawn colors OR calm blue sky
- Should tile seamlessly horizontally

**AI Prompt:**
```
Pixel art seamless tileable sky background, 480x200 pixels, 16-bit retro game style.
Beautiful gradient sky from warm orange/pink at horizon to light blue at top,
with small pixel art clouds scattered. Designed to tile horizontally seamlessly.
Simple, not too busy, serves as background layer.
Only one sky layer, no duplication, no reflection.
```

#### `cityscape.png` — Mid-ground City/Campus Silhouette
- **Size**: 1920x160 pixels (or tileable 640x160)
- Silhouettes of buildings, university towers, office buildings
- Should progress from campus-style buildings (left) to modern office towers (right)
- Semi-Pure white/muted colors (it's a background layer)

**AI Prompt:**
```
Pixel art cityscape silhouette background, 640x160 pixels,
16-bit retro game style.A single horizontal skyline across the bottom of the image.
From left to right: university campus buildings with a clock tower,
transitioning into modern tech offices and skyscrapers.Muted pastel colors.
Only one skyline, no reflection, no duplication.Empty Pure white sky above the buildings.
Wide panoramic banner.
```

#### `road.png` — Ground/Road Layer (closest, where characters stand)
- **Size**: tileable 128x80 pixels
- Pixel art sidewalk/road surface
- Light gray or warm stone sidewalk
- Maybe some grass edges
- Must tile seamlessly horizontally

**AI Prompt:**
```
Pixel art tileable ground/sidewalk, 128x80 pixels, 16-bit retro game style.
A clean pixel art sidewalk/pathway with stone tiles, light gray/warm beige color,
thin grass strips on top edge. Top-down perspective showing flat walking surface.
Must tile seamlessly when repeated horizontally. Simple, clean design.
```

---

## 3. Props (`/props/`)

Individual decorative elements placed along the road. All static PNG images (no animation needed).

#### `streetlamp.png` — Street Lamp
- **Size**: 32x96 pixels
- Classic street lamp design, pixel art style
- Warm glowing light effect at top

**AI Prompt:**
```
Pixel art street lamp, 32x96 pixels, 16-bit retro game style.
A classic vintage street lamp post, dark iron/black color, with warm glowing yellow light at top.
Side view, Pure white background. Clean pixel art with warm lighting glow effect.
```

#### `tree.png` — Decorative Tree
- **Size**: 64x80 pixels
- Friendly pixel art tree (could be cherry blossom or campus tree)
- Green leaves, brown trunk

**AI Prompt:**
```
Pixel art decorative tree, 64x80 pixels, 16-bit retro game style.
A friendly pixel art tree with lush green foliage and brown trunk,
cherry blossom or campus-style tree. Side view, Pure white background.
Clean simple design, vibrant green colors.
```

#### `bench.png` — Park Bench
- **Size**: 48x32 pixels
- Simple wooden park bench

**AI Prompt:**

```
Pixel art park bench, 48x32 pixels, 16-bit retro game style.
A simple wooden park bench, brown wood with black iron armrests.
Side view, Pure white background.
```

#### `meituan-kangaroo.png` — Meituan Kangaroo Mascot
- **Size**: 48x48 pixels
- Meituan's yellow kangaroo mascot in pixel art style
- Holding a delivery bag or just standing cute
- Yellow/orange color scheme matching Meituan brand

**AI Prompt:**
```
Pixel art mascot character, 48x48 pixels, 16-bit retro game style.
A cute yellow kangaroo mascot (Meituan style), holding a small delivery bag,
friendly expression, yellow and orange color scheme. Side view, Pure white background.
Chibi/cute proportions, pixel art style.
```

#### `signpost.png` — Direction Signpost
- **Size**: 32x80 pixels
- Wooden signpost with arrow signs pointing right
- Signs could say things like "Future ->" or have icons

**AI Prompt:**
```
Pixel art wooden direction signpost, 32x80 pixels, 16-bit retro game style.
A rustic wooden signpost with multiple arrow-shaped signs pointing to the right,
brown wood, standing in ground. Side view, Pure white background.
```

#### `computer-desk.png` — Computer Desk Setup
- **Size**: 64x48 pixels
- Small pixel art desk with monitor/laptop
- To place near the intern character

**AI Prompt:**
```
Pixel art computer desk, 64x48 pixels, 16-bit retro game style.
A small office desk with a computer monitor, keyboard, and mouse.
Modern tech workspace setup. Side view, Pure white background. Clean simple design.
```

#### `graduation-arch.png` — University Gate/Arch
- **Size**: 96x80 pixels
- Decorative university entrance gate/arch
- Classical academic architecture style

**AI Prompt:**
```
Pixel art university entrance gate, 96x80 pixels, 16-bit retro game style.
A classical academic arch/gate entrance, stone pillars with decorative top,
resembling a Chinese university campus entrance. Side view, Pure white background.
Warm stone/beige colors.
```

#### `books-stack.png` — Stack of Books
- **Size**: 32x32 pixels
- Small stack of colorful books

**AI Prompt:**
```
Pixel art stack of books, 32x32 pixels, 16-bit retro game style.
A small neat stack of 3-4 colorful textbooks/academic books,
various colors (blue, red, green, yellow). Side view, Pure white background.
```

---

## File Naming Convention

```
public/images/pixel-experience/
  characters/
    char-undergrad.png      (256x64, 4-frame sprite sheet)
    char-master.png         (256x64, 4-frame sprite sheet)
    char-intern.png         (256x64, 4-frame sprite sheet)
    char-engineer.png       (256x64, 4-frame sprite sheet)
    char-phd.png            (256x64, 4-frame sprite sheet)
  scenes/
    sky.png                 (480x200 tileable or 1920x200)
    cityscape.png           (640x160 tileable or 1920x160)
    road.png                (128x80 tileable)
  props/
    streetlamp.png          (32x96)
    tree.png                (64x80)
    bench.png               (48x32)
    meituan-kangaroo.png    (48x48)
    signpost.png            (32x80)
    computer-desk.png       (64x48)
    graduation-arch.png     (96x80)
    books-stack.png         (32x32)
```

---

## Checklist

- [x] char-undergrad.png
- [x] char-master.png
- [x] char-intern.png
- [x] char-engineer.png
- [x] char-phd.png
- [x] sky.png
- [x] cityscape.png
- [x] road.png
- [x] streetlamp.png
- [x] tree.png
- [x] bench.png
- [x] meituan-kangaroo.png
- [x] signpost.png
- [x] computer-desk.png
- [x] graduation-arch.png
- [x] books-stack.png

Total: 16 assets needed
