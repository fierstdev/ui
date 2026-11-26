# Changelog

## [1.0.0-alpha.1] - 2026-11-25

Initial **104-component** release of **AsterUI** (`@fierst/ui`) — code-owned, consensus-driven UI components for Aster powered by crisp opaque surfaces, single-seed OKLCH theming (`zinc`, `blue`, `emerald`, `violet`, `rose`, `amber`), sensible micro-animations, and `@lucide/icons`.

### Added (104 Registry Items)

- **Foundations (2):** `theme`, `icon`.
- **Layout, Typography & Page Chrome (17):** `app-shell`, `card`, `container`, `page-header`, `section-header`, `prose`, `grid` (+ `BentoGrid`), `separator`, `aspect-ratio`, `scroll-area`, `collapsible`, `resizable`, `sticky-bar`, `footer`, `navbar`, `sidebar-nav`, `visually-hidden` (+ `SkipLink`).
- **Navigation (9):** `tabs`, `breadcrumb`, `pagination`, `accordion`, `menubar`, `navigation-menu`, `stepper` (+ `yield* runWizard()`), `carousel`, `back-to-top`.
- **Forms, Pickers & Inputs (28):** `button`, `input`, `label`, `checkbox` (+ `CheckboxGroup`, `RadioGroup`), `switch`, `toggle` (+ `ToggleGroup`), `segmented-control`, `select`, `multi-select`, `combobox`, `slider`, `range-slider`, `number-input`, `input-otp`, `password-input`, `search-input`, `phone-input`, `currency-input`, `tag-input`, `mention-input`, `file-upload`, `color-picker`, `calendar` (+ `DatePicker`, `yield* pickDate()`), `date-range-picker`, `time-picker`, `rating`, `form`, `inline-edit`.
- **Overlays & Feedback (14):** `dialog` (+ `yield* confirmDialog()`), `alert-dialog` (+ `yield* confirmDestructive()`), `sheet`, `drawer` (+ `yield* promptDrawer()`), `command` (+ `yield* pickCommand()`), `popover` (+ `DropdownMenu`), `context-menu`, `hover-card`, `tooltip`, `tour` (+ `yield* runTour()`), `alert` (+ `Banner`), `banner-cookie`, `toast`, `command-bar` (`FilterBar`).
- **Data Display, Charts & Productivity (24):** `data-table`, `table`, `stat-card`, `description-list`, `timeline`, `empty-state`, `badge`, `avatar`, `progress` (+ `ProgressRing`, `Skeleton`), `spinner` (+ `LoadingOverlay`), `meter`, `kbd`, `copy-button` (+ `CodeBlock`), `tree-view`, `kanban`, `bar-chart`, `line-chart` (+ `AreaChart`), `donut-chart`, `sparkline`, `calendar-heatmap`, `diff-viewer`, `json-viewer`, `status-dot` (+ `UptimeBar`), `metric-list`.
- **AI, Agentic & `@fierst/flow` HITL (10):** `chat-message`, `prompt-input`, `streaming-text`, `reasoning-block`, `tool-call-card`, `approval-card` (+ `yield* requestApproval()`), `citation-badge` (+ `SourceList`), `suggestion-chips`, `token-usage`, `workflow-graph`.
