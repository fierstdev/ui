# AsterUI (`@fierst/ui`)

**104 proven, code-owned UI components engineered for Aster — by Fierst LLC.**

Built around crisp opaque surfaces, `1px` hairline borders, single-seed OKLCH theming (`zinc` monochrome + 5 chromatic presets), sensible `130–200ms` micro-animations, mobile-first ergonomics, zero-dependency SVG charts, and a dedicated **AI, Agentic & `@fierst/flow` HITL** component suite.

- **104 Code-Owned Registry Items:** Copy only the exact components you need into `src/ui/` via `vp dlx @fierst/ui add`—zero opaque runtime packages.
- **8 Aster-Native `yield*` Interactive Flows:** `confirmDialog()`, `confirmDestructive()`, `pickCommand()`, `pickDate()`, `runWizard()`, `promptDrawer()`, `runTour()`, and `requestApproval()`.
- **Zero-Dependency Charts & Developer Tools:** `BarChart`, `LineChart`, `AreaChart`, `DonutChart`, `Sparkline`, `CalendarHeatmap`, `DiffViewer`, `JsonViewer`, `KanbanBoard`, `TreeView`, `StatusDot`, `UptimeBar`, and `MetricList`.
- **First-Class AI & `@fierst/flow` HITL Suite:** `ChatMessage`, `PromptInput`, `StreamingText`, `ReasoningBlock`, `ToolCallCard`, `ApprovalCard`, `CitationBadge`, `SuggestionChips`, `TokenUsageBar`, and `WorkflowGraph`.

## Quick Start

Use an Aster 1.0 project with Node.js 20.19 or later. Existing installations own their component files. To adopt the 1.0 changes, compare the new registry sources with your local customizations before using `--force`.

```bash
vp dlx @fierst/ui init
vp add @lucide/icons
vp dlx @fierst/ui list
vp dlx @fierst/ui add app-shell button card dialog approval-card workflow-graph bar-chart diff-viewer data-table
```
