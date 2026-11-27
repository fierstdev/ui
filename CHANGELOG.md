# Changelog

## [1.0.2] - 2026-11-27

- Added a complete registry API reference, installation and integration examples, theme cookbook and single-file LLM guide to the package.

## [1.0.1] - 2026-11-27

- Updated the registry for Aster 1.2.0. Slider and RangeSlider now pass their numeric bounds and step as strings to native range inputs.
- The installer verifies each file's SHA-256 checksum when its manifest supplies one, before copying any requested component.
- Components load their shared theme stylesheet automatically and use local imports compatible with the Aster 1.2.0 starter's TypeScript configuration.

## [1.0.0] - 2026-11-27

- Tested the 104-item registry against Aster 1.0. Each item has an isolated installer check, with server-render coverage for all 103 component modules and initialization coverage for the shared theme.
- Improved desktop and mobile contrast, keyboard navigation, dialog naming, confirmation reset, file selection, and screen-reader state for form controls.
- Corrected chart totals and range indicators at their boundaries, clipboard failure handling, and registry dependency resolution.
- Added Chromium accessibility and interaction checks to CI and the release workflow.

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
