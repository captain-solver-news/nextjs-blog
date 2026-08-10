# DevLog — Programming News Blog

## North Star: "The Developer's Signal"

A developer-first reading experience. Complex topics made clear through precision, without noise, and always with respect for the reader's expertise.

## Colors

- **Accent (`#3FB950`):** CTA buttons, links, tags, active nav. Hover: `#2EA043`. Subtle background: `#1B2F1E`.
- **Surface tiers** create hierarchy — no harsh borders. Stack `bg-base` (`#0D1117`) → `bg-surface` (`#161B22`) → `bg-elevated` (`#21262D`).
- **Info (`#58A6FF`):** Inline links, focus rings, info blocks. Light mode: `#0969DA`.
- **Dark Mode Priority:** Dark theme is the default. Light mode mirrors the same palette with adjusted brightness — same accent identity.
- Use `--border` (`#30363D`) sparingly for dividers. Accent dividers: gradient from `--accent` → `transparent`. Glassmorphism reserved for floating menus only.

## Typography

- **Headlines:** Syne — geometric, modern, technical character without being generic.
- **Body:** Source Serif 4 — serif improves long-form readability and gives an editorial feel.
- **Labels:** DM Sans — neutral, clean, scales across buttons, nav, and UI elements. Code: JetBrains Mono with ligatures.

## Elevation

- Depth through tonal surface layering. Stack `bg-base` → `bg-surface` → `bg-elevated` for natural hierarchy without shadows.
- Cards and modals: `box-shadow: 0 8px 24px rgba(0,0,0,0.2)` on hover/open; `border-radius: 8px` everywhere.
- If borders needed: `1px solid --border` default; on hover shift to `1px solid --accent` at 50% opacity instead of adding weight.

## Components

- **Buttons:** Primary = `--accent` fill + white text + `translateY(-1px)` on hover. Secondary = transparent bg + `1px solid --border` + `--text-primary`. Focus: `2px solid --info` outline.
- **Cards:** `--bg-surface` default, `--bg-elevated` + accent border on hover, `translateY(-2px)` lift. No divider lines — use spacing and surface shifts.
- **Inputs:** `--bg-surface` bg, `1px solid --border`, focus = `1px solid --accent` with glow. Error: `1px solid --danger`.

## Rules

- Use whitespace as structure. Single centered content column — no sidebars. Max post text width: 740px on desktop; full-width below 768px.
- Serif for article body text; sans-serif for UI. One primary action per view. Always specify language on code blocks.
- Never use sharp corners — minimum `border-radius: 6px`. Respect `prefers-reduced-motion` by cutting all transitions to `0.01ms`.
