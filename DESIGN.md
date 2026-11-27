# AsterUI — Design Philosophy

**AsterUI** is a **104-item** code-owned UI component library built by **Fierst LLC** for Aster. Rather than chasing novelty for novelty’s sake, AsterUI models its visual discipline and ergonomics on proven modern UI conventions—crisp opaque surfaces, `1px` hairline borders, restrained shadows, predictable keyboard navigation, and tabular numerals—enhanced by a single-seed OKLCH color engine, sensible micro-animations, zero-dependency SVG charts, and 8 Aster-native `yield*` interactive flows.

---

## 1. Proven Surface & Contrast Hierarchy

- **Crisp Opaque Surfaces:** Pages (`--aster-bg`), cards (`--aster-surface`), muted panels (`--aster-surface-muted`), and floating overlays (`.aster-surface-popover`) stay solid and crisp with `1px` hairline borders and restrained shadows.
- **Inverted Tooltips:** Tooltips use high-contrast inverted polarity (`--aster-inverted-bg` / `--aster-inverted-fg`) for instant legibility over any light or dark canvas.
- **Tinted Hairline Status Roles:** Semantic badges, alerts, diff highlights, and workflow nodes pair a gentle tinted fill with a matching `1px` border and accessible ink.

## 2. Single-Seed OKLCH Color Engine

- Override `--aster-seed-hue` and `--aster-seed-chroma`—or choose from 6 curated presets (`zinc` monochrome, `blue`, `emerald`, `violet`, `rose`, `amber`)—and OKLCH computes primary fills, hover states, subtle containers, seed-based chart accents, borders, and focus rings across Light and Dark modes with sRGB fallbacks across Chrome, Safari, Firefox, and Edge.

## 3. Familiar Radius Scale (`none` / `sm` / `md` / `lg`) & Sensible Micro-Animations

- Clean corner presets (`0px`, `6px`, `8px` default, `12px`) with fast `130–200ms` transitions, subtle `scale(0.98)` press feedback, spring toggle thumbs, and automatic `prefers-reduced-motion` support.

## 4. Built for Both Everyday Apps & Durable AI Workflows (`@fierst/flow`)

- Beyond complete SaaS layout, form, overlay, and chart coverage, AsterUI ships 10 dedicated AI & Human-in-the-Loop primitives (`ChatMessage`, `PromptInput`, `StreamingText`, `ReasoningBlock`, `ToolCallCard`, `ApprovalCard`, `CitationBadge`, `SuggestionChips`, `TokenUsageBar`, `WorkflowGraph`) plus `DiffViewer` and `Timeline`—making `@fierst/flow` apps feel native out of the box.

See [the theme cookbook](docs/themes.md) for working examples and [the API reference](docs/components.md#theme) for the exact tokens and controller contracts.
