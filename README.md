# AsterUI (`@fierst/ui`)

**104 proven, code-owned UI components engineered for Aster — by Fierst LLC.**

Built around crisp opaque surfaces, `1px` hairline borders, single-seed OKLCH theming (`zinc` monochrome + 5 chromatic presets), sensible `130–200ms` micro-animations, mobile-first ergonomics, zero-dependency SVG charts, and a dedicated **AI, Agentic & `@fierst/flow` HITL** component suite.

- **104 Code-Owned Registry Items:** Copy only the exact components you need into `src/ui/` via `vp dlx @fierst/ui add`—zero opaque runtime packages.
- **8 Aster-Native `yield*` Interactive Flows:** `confirmDialog()`, `confirmDestructive()`, `pickCommand()`, `pickDate()`, `runWizard()`, `promptDrawer()`, `runTour()`, and `requestApproval()`.
- **Zero-Dependency Charts & Developer Tools:** `BarChart`, `LineChart`, `AreaChart`, `DonutChart`, `Sparkline`, `CalendarHeatmap`, `DiffViewer`, `JsonViewer`, `KanbanBoard`, `TreeView`, `StatusDot`, `UptimeBar`, and `MetricList`.
- **First-Class AI & `@fierst/flow` HITL Suite:** `ChatMessage`, `PromptInput`, `StreamingText`, `ReasoningBlock`, `ToolCallCard`, `ApprovalCard`, `CitationBadge`, `SuggestionChips`, `TokenUsageBar`, and `WorkflowGraph`.

## Quick Start

Use an Aster project with `@fierst/aster@^1.2.0` and Node.js 20.19 or later. If you already own copies of `slider.tsx` or `range-slider.tsx`, merge the updated input attributes into your files or review your local changes before reinstalling with `--force`.

```bash
vp dlx @fierst/ui init
vp add @lucide/icons
vp dlx @fierst/ui list
vp dlx @fierst/ui add app-shell button card dialog approval-card workflow-graph bar-chart diff-viewer data-table
```

Import a copied component into your Aster app, for example `import { Button } from './ui/button'` in `src/main.tsx`. Every component imports the shared theme stylesheet, including when installed under a custom `--dir`. Vite includes it in the component's CSS bundle. For theme tokens on a page that uses no components, import `./ui/theme.css` in the app entry. Calling `initTheme()` is optional and restores saved theme preferences.
