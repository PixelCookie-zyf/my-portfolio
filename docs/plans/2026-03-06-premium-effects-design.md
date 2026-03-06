# Premium Effects Integration Design

## Elements
1. **Custom Cursor** - Global dot + outline cursor with mix-blend-mode difference
2. **ASCII Canvas** - Generative ASCII art with mouse interaction (Hero bg + Projects header)
3. **Text Scramble** - Character scramble effect on Hero headline and SectionTitles
4. **Telemetry Widget** - Fixed bottom-right FPS/mouse/time display

## Architecture
- Modular components in `src/components/ui/`
- Compose into existing layout without heavy refactoring
- Theme-aware (dark/light mode support)
- Mobile-responsive (cursor/telemetry hidden on touch devices)

## Components
- `CustomCursor.tsx` - Global in layout.tsx
- `AsciiCanvas.tsx` - Hero background + Projects page header
- `TextScramble.tsx` - Hook for Hero headline + SectionTitle
- `TelemetryWidget.tsx` - Fixed position widget

## Integration Points
- `layout.tsx` - Add CustomCursor
- `Hero.tsx` - ASCII canvas background, scramble on headline
- `SectionTitle.tsx` - Scramble on scroll into view
- `projects/page.tsx` - Subtle ASCII header
- `globals.css` - cursor: none on desktop
