# Component and API reference

The 104 registry items below are sorted by install slug. Each entry includes its local imports, direct dependencies and public declarations. In function signatures, the first parameter describes the props; Aster supplies the context parameter. Open the implementation for internal defaults or the linked showcase for an example with application state.

- [accordion](#accordion) — Accordion
- [alert](#alert) — Alert & Banner
- [alert-dialog](#alert-dialog) — AlertDialog & yield* confirmDestructive()
- [app-shell](#app-shell) — AppShell, Sidebar & NavItem
- [approval-card](#approval-card) — ApprovalCard & yield* requestApproval()
- [aspect-ratio](#aspect-ratio) — AspectRatio
- [avatar](#avatar) — Avatar & AvatarGroup
- [back-to-top](#back-to-top) — BackToTop
- [badge](#badge) — Badge
- [banner-cookie](#banner-cookie) — ConsentBanner
- [bar-chart](#bar-chart) — BarChart
- [breadcrumb](#breadcrumb) — Breadcrumb
- [button](#button) — Button & ButtonGroup
- [calendar](#calendar) — Calendar, DatePicker & yield* pickDate()
- [calendar-heatmap](#calendar-heatmap) — CalendarHeatmap
- [card](#card) — Card
- [carousel](#carousel) — Carousel
- [chat-message](#chat-message) — ChatMessage & ChatList
- [checkbox](#checkbox) — Checkbox, CheckboxGroup & RadioGroup
- [citation-badge](#citation-badge) — CitationBadge & SourceList
- [collapsible](#collapsible) — Collapsible
- [color-picker](#color-picker) — ColorPicker
- [combobox](#combobox) — Combobox
- [command](#command) — CommandPalette & yield* pickCommand()
- [command-bar](#command-bar) — FilterBar
- [container](#container) — Container, Stack & Cluster
- [context-menu](#context-menu) — ContextMenu
- [copy-button](#copy-button) — CopyButton & CodeBlock
- [currency-input](#currency-input) — CurrencyInput
- [data-table](#data-table) — DataTable
- [date-range-picker](#date-range-picker) — DateRangePicker
- [description-list](#description-list) — DescriptionList
- [dialog](#dialog) — Dialog & yield* confirmDialog()
- [diff-viewer](#diff-viewer) — DiffViewer
- [donut-chart](#donut-chart) — DonutChart
- [drawer](#drawer) — Drawer & yield* promptDrawer()
- [empty-state](#empty-state) — EmptyState
- [file-upload](#file-upload) — FileUpload
- [footer](#footer) — Footer
- [form](#form) — Form, FormSection & FormActions
- [grid](#grid) — Grid, BentoGrid & BentoCard
- [hover-card](#hover-card) — HoverCard
- [icon](#icon) — Icon (Lucide)
- [inline-edit](#inline-edit) — InlineEdit
- [input](#input) — Input & Textarea
- [input-otp](#input-otp) — InputOTP
- [json-viewer](#json-viewer) — JsonViewer
- [kanban](#kanban) — KanbanBoard
- [kbd](#kbd) — Kbd & KbdGroup
- [label](#label) — Label & Field
- [line-chart](#line-chart) — LineChart & AreaChart
- [mention-input](#mention-input) — MentionInput
- [menubar](#menubar) — Menubar
- [meter](#meter) — Meter
- [metric-list](#metric-list) — MetricList
- [multi-select](#multi-select) — MultiSelect
- [navbar](#navbar) — Navbar
- [navigation-menu](#navigation-menu) — NavigationMenu
- [number-input](#number-input) — NumberInput
- [page-header](#page-header) — PageHeader
- [pagination](#pagination) — Pagination
- [password-input](#password-input) — PasswordInput
- [phone-input](#phone-input) — PhoneInput
- [popover](#popover) — Popover & DropdownMenu
- [progress](#progress) — Progress, ProgressRing & Skeleton
- [prompt-input](#prompt-input) — PromptInput
- [prose](#prose) — Prose & Text
- [range-slider](#range-slider) — RangeSlider
- [rating](#rating) — Rating
- [reasoning-block](#reasoning-block) — ReasoningBlock
- [resizable](#resizable) — ResizableSplit
- [scroll-area](#scroll-area) — ScrollArea
- [search-input](#search-input) — SearchInput
- [section-header](#section-header) — SectionHeader
- [segmented-control](#segmented-control) — SegmentedControl
- [select](#select) — Select (Searchable Combobox)
- [separator](#separator) — Separator
- [sheet](#sheet) — Sheet (Drawer)
- [sidebar-nav](#sidebar-nav) — SidebarNav
- [slider](#slider) — Slider
- [sparkline](#sparkline) — Sparkline
- [spinner](#spinner) — Spinner & LoadingOverlay
- [stat-card](#stat-card) — StatCard & StatGrid
- [status-dot](#status-dot) — StatusDot & UptimeBar
- [stepper](#stepper) — Stepper & yield* runWizard()
- [sticky-bar](#sticky-bar) — StickyActionBar
- [streaming-text](#streaming-text) — StreamingText
- [suggestion-chips](#suggestion-chips) — SuggestionChips
- [switch](#switch) — Switch
- [table](#table) — Table
- [tabs](#tabs) — Tabs
- [tag-input](#tag-input) — TagInput
- [theme](#theme) — Theme & Design Tokens
- [time-picker](#time-picker) — TimePicker
- [timeline](#timeline) — Timeline
- [toast](#toast) — Toast & Toaster
- [toggle](#toggle) — Toggle & ToggleGroup
- [token-usage](#token-usage) — TokenUsageBar
- [tool-call-card](#tool-call-card) — ToolCallCard
- [tooltip](#tooltip) — Tooltip
- [tour](#tour) — TourCard & yield* runTour()
- [tree-view](#tree-view) — TreeView
- [visually-hidden](#visually-hidden) — VisuallyHidden & SkipLink
- [workflow-graph](#workflow-graph) — WorkflowGraph

## accordion

Zero-JS native <details> Accordion supporting both type='single' (auto-close inactive panels) and type='multiple' (expand all simultaneously).

Install with `vp dlx @fierst/ui add accordion`. Direct registry dependencies: theme, icon. Direct npm dependencies: @lucide/icons.

Exports from `./ui/accordion`: `AccordionItem`, `Accordion`.

Minimal TSX usage

```tsx
import { Accordion } from './ui/accordion';

(
    <Accordion items={[{ id: 'hours', title: 'Hours', content: 'Weekdays, 9–5' }]} />
  )
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/accordion.tsx) · [ai.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/ai.tsx#L214)

API contracts

```ts
export interface AccordionItem {
  id: string;
  title: string;
  content: View;
  defaultOpen?: boolean;
}

export function Accordion({
  items,
  type = 'single',
  exclusive,
  class: extraClass,
}: {
  items: readonly AccordionItem[];
  type?: 'single' | 'multiple';
  /** Legacy alias for `type === 'single'`. Takes precedence if explicitly passed. */
  exclusive?: boolean;
  class?: string;
})
```

## alert

Semantic status callouts and full-bleed banners with Lucide status icons, action slots, and optional dismissal.

Install with `vp dlx @fierst/ui add alert`. Direct registry dependencies: theme, icon. Direct npm dependencies: @lucide/icons.

Exports from `./ui/alert`: `AlertTone`, `Alert`, `Banner`.

Minimal TSX usage

```tsx
import { Alert } from './ui/alert';

<Alert />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/alert.tsx) · [overview.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/overview.tsx#L117)

API contracts

```ts
export type AlertTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

export function* Alert(
  props: {
    tone?: AlertTone;
    title?: string;
    description?: string;
    action?: View;
    dismissible?: boolean;
    banner?: boolean;
    onDismiss?: () => void;
    class?: string;
    children?: View;
  },
  ctx: Ctx,
)

export function Banner(props: {
  tone?: AlertTone;
  title?: string;
  description?: string;
  action?: View;
  dismissible?: boolean;
  onDismiss?: () => void;
  class?: string;
  children?: View;
})
```

## alert-dialog

High-friction destructive confirmation dialog with optional phrase-typing guard and yield* confirmDestructive().

Install with `vp dlx @fierst/ui add alert-dialog`. Direct registry dependencies: theme, icon, dialog, button, input. Direct npm dependencies: @lucide/icons.

Exports from `./ui/alert-dialog`: `AlertDialog`, `confirmDestructive`.

Minimal TSX usage

```tsx
import { AlertDialog } from './ui/alert-dialog';

<AlertDialog title="Delete?" description="Confirm" onConfirm={() => {}} />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/alert-dialog.tsx) · [overlays.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/overlays.tsx#L354)

API contracts

```ts
export function* AlertDialog(
  props: {
    open?: any;
    title: string;
    description: string;
    confirmPhrase?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onCancel?: () => void;
  },
  ctx: Ctx,
)

export function* confirmDestructive(opts: {
  title: string;
  description: string;
  confirmPhrase?: string;
  confirmLabel?: string;
}): Generator<View, boolean, any>
```

## app-shell

Mobile-first application layout with icon-only collapsible desktop sidebar, automatic mobile Sheet drawer, crisp topbar, and plain <a href> NavItem.

Install with `vp dlx @fierst/ui add app-shell`. Direct registry dependencies: theme, icon, sheet. Direct npm dependencies: @lucide/icons.

Exports from `./ui/app-shell`: `NavItem`, `Sidebar`, `AppShell`.

Minimal TSX usage

```tsx
import { AppShell } from './ui/app-shell';

<AppShell sidebar="Navigation" />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/app-shell.tsx) · [showcase.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase.tsx#L529)

API contracts

```ts
export function NavItem({
  href,
  label,
  icon,
  active = false,
  compact = false,
  badge,
  onClick,
  class: extraClass,
}: {
  href?: string;
  label: string;
  icon?: LucideIconInput;
  active?: boolean;
  compact?: boolean;
  badge?: View;
  onClick?: (e: MouseEvent) => void;
  class?: string;
})

export function Sidebar({
  header,
  footer,
  collapsed = false,
  class: extraClass,
  children,
}: {
  header?: View;
  footer?: View;
  collapsed?: boolean;
  class?: string;
  children?: View;
})

export function* AppShell(
  props: {
    brand?: View;
    sidebar: View | ((opts: { collapsed: boolean; closeMobile: () => void }) => View);
    topbar?: View;
    collapsible?: boolean;
    class?: string;
    children?: View;
  },
  ctx: Ctx,
)
```

## approval-card

@fierst/flow HITL approval card with assignee role, SHA-256 hash, code preview, and yield* requestApproval().

Install with `vp dlx @fierst/ui add approval-card`. Direct registry dependencies: theme, icon, badge, button. Direct npm dependencies: @lucide/icons.

Exports from `./ui/approval-card`: `ApprovalCard`, `requestApproval`.

Minimal TSX usage

```tsx
import { ApprovalCard } from './ui/approval-card';

<ApprovalCard title="Approve?" onApprove={() => {}} onReject={() => {}} />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/approval-card.tsx) · [ai.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/ai.tsx#L159)

API contracts

```ts
export function ApprovalCard({
  title,
  description,
  assigneeRole,
  artifactHash,
  codePreview,
  danger = false,
  approveLabel = 'Approve & Resume',
  rejectLabel = 'Reject',
  onApprove,
  onReject,
  class: extraClass,
}: {
  title: string;
  description?: string;
  assigneeRole?: string;
  artifactHash?: string;
  codePreview?: string;
  danger?: boolean;
  approveLabel?: string;
  rejectLabel?: string;
  onApprove: () => void;
  onReject: () => void;
  class?: string;
})

export function* requestApproval(opts: {
  title: string;
  description?: string;
  assigneeRole?: string;
  artifactHash?: string;
  codePreview?: string;
  danger?: boolean;
}): Generator<View, boolean, any>
```

## aspect-ratio

Native CSS aspect-ratio media wrapper for images, videos, and embeds.

Install with `vp dlx @fierst/ui add aspect-ratio`. Direct registry dependencies: theme. Direct npm dependencies: none.

Exports from `./ui/aspect-ratio`: `AspectRatio`.

Minimal TSX usage

```tsx
import { AspectRatio } from './ui/aspect-ratio';

<AspectRatio />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/aspect-ratio.tsx) · [overlays.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/overlays.tsx#L291)

API contracts

```ts
export function AspectRatio({
  ratio = 16 / 9,
  class: extraClass,
  children,
}: {
  ratio?: number | string;
  class?: string;
  children?: View;
})
```

## avatar

Responsive user avatar with automatic initials fallback, status indicator dots, adaptive geometry, and overlapping AvatarGroup.

Install with `vp dlx @fierst/ui add avatar`. Direct registry dependencies: theme. Direct npm dependencies: none.

Exports from `./ui/avatar`: `AvatarSize`, `AvatarStatus`, `Avatar`, `AvatarGroup`.

Minimal TSX usage

```tsx
import { Avatar } from './ui/avatar';

<Avatar name="Ada" />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/avatar.tsx) · [showcase.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase.tsx#L543) · [ops.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/ops.tsx#L219)

API contracts

```ts
export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

export type AvatarStatus = 'online' | 'away' | 'busy' | 'offline';

export function* Avatar(
  props: {
    name: string;
    src?: string;
    alt?: string;
    size?: AvatarSize;
    status?: AvatarStatus;
    class?: string;
  },
  ctx: Ctx,
)

export function AvatarGroup({
  items,
  max = 4,
  size = 'md',
  class: extraClass,
}: {
  items: readonly { name: string; src?: string; status?: AvatarStatus }[];
  max?: number;
  size?: AvatarSize;
  class?: string;
}): View
```

## back-to-top

Scroll-aware floating pill button that appears smoothly past a scroll threshold.

Install with `vp dlx @fierst/ui add back-to-top`. Direct registry dependencies: theme, icon. Direct npm dependencies: @lucide/icons.

Exports from `./ui/back-to-top`: `BackToTop`.

Minimal TSX usage

```tsx
import { BackToTop } from './ui/back-to-top';

<BackToTop />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/back-to-top.tsx) · [overview.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/overview.tsx#L405)

API contracts

```ts
export function* BackToTop(
  props: {
    threshold?: number;
    label?: string;
    class?: string;
  },
  ctx: Ctx,
)
```

## badge

High-contrast semantic status pills with optional indicator dot.

Install with `vp dlx @fierst/ui add badge`. Direct registry dependencies: theme. Direct npm dependencies: none.

Exports from `./ui/badge`: `BadgeTone`, `Badge`.

Minimal TSX usage

```tsx
import { Badge } from './ui/badge';

<Badge />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/badge.tsx) · [showcase.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase.tsx#L534) · [ai.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/ai.tsx#L175) · [directory.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/directory.tsx#L202) · [ops.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/ops.tsx#L95) · [overview.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/overview.tsx#L99)

API contracts

```ts
export type BadgeTone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger';

export function Badge({
  tone = 'neutral',
  dot = false,
  class: extraClass,
  children,
  ...rest
}: {
  tone?: BadgeTone;
  dot?: boolean;
  class?: string;
  children?: View;
  [key: string]: any;
})
```

## banner-cookie

Non-intrusive bottom privacy consent banner with Accept All and Essential Only actions.

Install with `vp dlx @fierst/ui add banner-cookie`. Direct registry dependencies: theme, button. Direct npm dependencies: none.

Exports from `./ui/banner-cookie`: `ConsentBanner`.

Minimal TSX usage

```tsx
import { ConsentBanner } from './ui/banner-cookie';

<ConsentBanner />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/banner-cookie.tsx) · [overview.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/overview.tsx#L369)

API contracts

```ts
export function* ConsentBanner(
  props: {
    title?: string;
    description?: string;
    onAccept?: () => void;
    onDecline?: () => void;
    class?: string;
  },
  ctx: Ctx,
)
```

## bar-chart

Zero-dependency responsive SVG bar chart with hover callouts and gridlines.

Install with `vp dlx @fierst/ui add bar-chart`. Direct registry dependencies: theme. Direct npm dependencies: none.

Exports from `./ui/bar-chart`: `ChartDatum`, `BarChart`.

Minimal TSX usage

```tsx
import { BarChart } from './ui/bar-chart';

(
    <BarChart
      data={[
        { label: 'May', value: 24 },
        { label: 'June', value: 31 },
      ]}
    />
  )
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/bar-chart.tsx) · [overview.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/overview.tsx#L182)

API contracts

```ts
export interface ChartDatum {
  label: string;
  value: number;
}

export function* BarChart(
  props: {
    data: readonly ChartDatum[];
    height?: number;
    unit?: string;
    label?: string;
    class?: string;
  },
  ctx: Ctx,
)
```

## breadcrumb

Horizontally scrollable semantic breadcrumb trail with Lucide chevrons and plain <a href> links.

Install with `vp dlx @fierst/ui add breadcrumb`. Direct registry dependencies: theme, icon. Direct npm dependencies: @lucide/icons.

Exports from `./ui/breadcrumb`: `BreadcrumbItem`, `Breadcrumb`.

Minimal TSX usage

```tsx
import { Breadcrumb } from './ui/breadcrumb';

<Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Settings' }]} />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/breadcrumb.tsx) · [overview.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/overview.tsx#L88)

API contracts

```ts
export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: (e: MouseEvent) => void;
}

export function Breadcrumb({
  items,
  label = 'Breadcrumb',
  class: extraClass,
}: {
  items: readonly BreadcrumbItem[];
  label?: string;
  class?: string;
})
```

## button

Proven primary/secondary/outline/ghost/destructive/link buttons with subtle press feedback, Lucide loading spinner, and connected ButtonGroup.

Install with `vp dlx @fierst/ui add button`. Direct registry dependencies: theme, icon. Direct npm dependencies: @lucide/icons.

Exports from `./ui/button`: `ButtonVariant`, `ButtonSize`, `ButtonProps`, `Button`, `ButtonGroup`.

Minimal TSX usage

```tsx
import { Button } from './ui/button';

<Button variant="primary">Continue</Button>
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/button.tsx) · [showcase.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase.tsx#L216) · [ai.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/ai.tsx#L60) · [directory.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/directory.tsx#L206) · [forms.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/forms.tsx#L77) · [ops.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/ops.tsx#L140) · [overlays.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/overlays.tsx#L55) · [overview.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/overview.tsx#L105)

API contracts

```ts
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link';

export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  class?: string;
  children?: View;
  [key: string]: any;
}

export function Button({
  variant = 'outline',
  size = 'md',
  loading = false,
  disabled = false,
  type = 'button',
  class: extraClass,
  children,
  ...rest
}: ButtonProps)

export function ButtonGroup(props: { class?: string; children?: View; label?: string })
```

## calendar

Zero-dependency Intl Calendar with Month & Year dropdowns (1900–2046) + direct date input, Popover DatePicker, and yield* pickDate().

Install with `vp dlx @fierst/ui add calendar`. Direct registry dependencies: theme, icon, button, dialog. Direct npm dependencies: @lucide/icons.

Exports from `./ui/calendar`: `toIsoDate`, `Calendar`, `DatePicker`, `pickDate`.

Minimal TSX usage

```tsx
import { Calendar } from './ui/calendar';

<Calendar />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/calendar.tsx) · [forms.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/forms.tsx#L278)

API contracts

```ts
export function toIsoDate(d: Date): string

export function* Calendar(
  props: {
    value?: string;
    defaultValue?: string;
    min?: string;
    max?: string;
    /** Earliest selectable year in the year dropdown (default: 1900 or min's year). */
    fromYear?: number;
    /** Latest selectable year in the year dropdown (default: currentYear + 20 or max's year). */
    toYear?: number;
    locale?: string;
    embedded?: boolean;
    onChange?: (isoDate: string) => void;
    class?: string;
  },
  ctx: Ctx,
)

export function* DatePicker(
  props: {
    label?: string;
    value?: string;
    defaultValue?: string;
    min?: string;
    max?: string;
    fromYear?: number;
    toYear?: number;
    placeholder?: string;
    locale?: string;
    onChange?: (isoDate: string) => void;
    class?: string;
  },
  ctx: Ctx,
)

export function* pickDate(
  opts: {
    title?: string;
    description?: string;
    initial?: string;
    min?: string;
    max?: string;
    fromYear?: number;
    toYear?: number;
  } = {},
): Generator<View, string | null, any>
```

## calendar-heatmap

Activity and contribution density heatmap grid using OKLCH primary intensity stops.

Install with `vp dlx @fierst/ui add calendar-heatmap`. Direct registry dependencies: theme. Direct npm dependencies: none.

Exports from `./ui/calendar-heatmap`: `CalendarHeatmap`.

Minimal TSX usage

```tsx
import { CalendarHeatmap } from './ui/calendar-heatmap';

<CalendarHeatmap values={[{ date: '2026-11-01', count: 4 }]} />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/calendar-heatmap.tsx) · [overview.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/overview.tsx#L289)

API contracts

```ts
export function CalendarHeatmap({
  values,
  label = 'Activity heatmap',
  class: extraClass,
}: {
  /** Array of { date, count } entries (typically 7 * weeks). */
  values: readonly { date: string; count: number }[];
  label?: string;
  class?: string;
})
```

## card

Crisp opaque cards (default, elevated, muted) with 1px hairline borders, shadow-xs, and header/content/footer slots.

Install with `vp dlx @fierst/ui add card`. Direct registry dependencies: theme. Direct npm dependencies: none.

Exports from `./ui/card`: `CardVariant`, `Card`.

Minimal TSX usage

```tsx
import { Card } from './ui/card';

<Card />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/card.tsx) · [ai.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/ai.tsx#L67) · [directory.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/directory.tsx#L192) · [forms.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/forms.tsx#L85) · [ops.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/ops.tsx#L212) · [overlays.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/overlays.tsx#L50) · [overview.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/overview.tsx#L160)

API contracts

```ts
export type CardVariant = 'default' | 'elevated' | 'muted';

export function Card({
  variant = 'default',
  title,
  description,
  action,
  footer,
  class: extraClass,
  children,
  ...rest
}: {
  variant?: CardVariant;
  title?: string;
  description?: string;
  action?: View;
  footer?: View;
  class?: string;
  children?: View;
  [key: string]: any;
})
```

## carousel

Zero-dependency CSS Scroll-Snap carousel with touch swiping, dot indicators, and Prev/Next controls.

Install with `vp dlx @fierst/ui add carousel`. Direct registry dependencies: theme, icon. Direct npm dependencies: @lucide/icons.

Exports from `./ui/carousel`: `Carousel`.

Minimal TSX usage

```tsx
import { Carousel } from './ui/carousel';

(
    <Carousel
      slides={[
        { id: 'intro', content: 'Welcome' },
        { id: 'next', content: 'Get started' },
      ]}
    />
  )
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/carousel.tsx) · [overview.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/overview.tsx#L310)

API contracts

```ts
export function* Carousel(
  props: {
    slides: readonly { id: string; content: View }[];
    label?: string;
    class?: string;
  },
  ctx: Ctx,
)
```

## chat-message

Clean user, assistant, and system chat bubbles with avatar, timestamp, and action slots.

Install with `vp dlx @fierst/ui add chat-message`. Direct registry dependencies: theme, icon. Direct npm dependencies: @lucide/icons.

Exports from `./ui/chat-message`: `ChatMessage`, `ChatList`.

Minimal TSX usage

```tsx
import { ChatMessage } from './ui/chat-message';

<ChatMessage />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/chat-message.tsx) · [ai.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/ai.tsx#L88)

API contracts

```ts
export function ChatMessage({
  role = 'assistant',
  author,
  timestamp,
  actions,
  class: extraClass,
  children,
}: {
  role?: 'user' | 'assistant' | 'system';
  author?: string;
  timestamp?: string;
  actions?: View;
  class?: string;
  children?: View;
})

export function ChatList(props: { class?: string; children?: View })
```

## checkbox

Accessible checkboxes (with indeterminate state), checkbox groups, and radio groups supporting inline and card layouts.

Install with `vp dlx @fierst/ui add checkbox`. Direct registry dependencies: theme, icon. Direct npm dependencies: @lucide/icons.

Exports from `./ui/checkbox`: `Checkbox`, `ChoiceOption`, `CheckboxGroup`, `RadioGroup`.

Minimal TSX usage

```tsx
import { Checkbox } from './ui/checkbox';

<Checkbox />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/checkbox.tsx) · [forms.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/forms.tsx#L174)

API contracts

```ts
export function* Checkbox(
  props: {
    checked?: boolean;
    defaultChecked?: boolean;
    indeterminate?: boolean;
    label?: string;
    description?: string;
    disabled?: boolean;
    card?: boolean;
    name?: string;
    value?: string;
    onChange?: (checked: boolean) => void;
    class?: string;
  },
  ctx: Ctx,
)

export interface ChoiceOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export function* CheckboxGroup(
  props: {
    legend?: string;
    options: readonly ChoiceOption[];
    value?: readonly string[];
    defaultValue?: readonly string[];
    card?: boolean;
    orientation?: 'vertical' | 'horizontal';
    onChange?: (values: string[]) => void;
    class?: string;
  },
  ctx: Ctx,
)

export function* RadioGroup(
  props: {
    legend?: string;
    name?: string;
    options: readonly ChoiceOption[];
    value?: string;
    defaultValue?: string;
    card?: boolean;
    orientation?: 'vertical' | 'horizontal';
    onChange?: (value: string) => void;
    class?: string;
  },
  ctx: Ctx,
)
```

## citation-badge

Inline superscript [1] citation chip and footer source link cards.

Install with `vp dlx @fierst/ui add citation-badge`. Direct registry dependencies: theme, icon. Direct npm dependencies: @lucide/icons.

Exports from `./ui/citation-badge`: `CitationBadge`, `SourceList`.

Minimal TSX usage

```tsx
import { CitationBadge } from './ui/citation-badge';

<CitationBadge index={1} />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/citation-badge.tsx) · [ai.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/ai.tsx#L98)

API contracts

```ts
export function CitationBadge({
  index,
  href,
  title,
}: {
  index: number;
  href?: string;
  title?: string;
})

export function SourceList({
  sources,
  class: extraClass,
}: {
  sources: readonly { title: string; href: string }[];
  class?: string;
})
```

## collapsible

Accessible single disclosure section with preview slot and Lucide toggle control.

Install with `vp dlx @fierst/ui add collapsible`. Direct registry dependencies: theme, icon. Direct npm dependencies: @lucide/icons.

Exports from `./ui/collapsible`: `Collapsible`.

Minimal TSX usage

```tsx
import { Collapsible } from './ui/collapsible';

<Collapsible />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/collapsible.tsx) · [ai.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/ai.tsx#L186)

API contracts

```ts
export function* Collapsible(
  props: {
    title?: string;
    open?: boolean;
    defaultOpen?: boolean;
    preview?: View;
    onOpenChange?: (open: boolean) => void;
    class?: string;
    children?: View;
  },
  ctx: Ctx,
)
```

## color-picker

Swatch palette + native color picker + hex text input inside a viewport-clamped Popover.

Install with `vp dlx @fierst/ui add color-picker`. Direct registry dependencies: theme. Direct npm dependencies: none.

Exports from `./ui/color-picker`: `ColorPicker`.

Minimal TSX usage

```tsx
import { ColorPicker } from './ui/color-picker';

<ColorPicker />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/color-picker.tsx) · [forms.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/forms.tsx#L293)

API contracts

```ts
export function* ColorPicker(
  props: {
    label?: string;
    value?: string;
    defaultValue?: string;
    swatches?: readonly string[];
    onChange?: (hex: string) => void;
    class?: string;
  },
  ctx: Ctx,
)
```

## combobox

Autocomplete text input with filterable listbox, keyboard nav, and optional creatable values.

Install with `vp dlx @fierst/ui add combobox`. Direct registry dependencies: theme, icon. Direct npm dependencies: @lucide/icons.

Exports from `./ui/combobox`: `Combobox`.

Minimal TSX usage

```tsx
import { Combobox } from './ui/combobox';

<Combobox options={['Oslo', 'Lima']} />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/combobox.tsx) · [forms.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/forms.tsx#L139)

API contracts

```ts
export function* Combobox(
  props: {
    label?: string;
    options: readonly string[];
    value?: string;
    defaultValue?: string;
    placeholder?: string;
    creatable?: boolean;
    onChange?: (value: string) => void;
    class?: string;
  },
  ctx: Ctx,
)
```

## command

Opaque ⌘K command palette with grouped search, auto-focus, keyboard nav, ctx.signal cleanup, and yield* pickCommand().

Install with `vp dlx @fierst/ui add command`. Direct registry dependencies: theme, icon. Direct npm dependencies: @lucide/icons.

Exports from `./ui/command`: `CommandItem`, `CommandPalette`, `pickCommand`.

Minimal TSX usage

```tsx
import { CommandPalette } from './ui/command';

(
    <CommandPalette items={[{ id: 'home', label: 'Home', onSelect: () => location.assign('/') }]} />
  )
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/command.tsx) · [showcase.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase.tsx#L633)

API contracts

```ts
export interface CommandItem {
  id: string;
  label: string;
  hint?: string;
  group?: string;
  keywords?: readonly string[];
  shortcut?: string;
  onSelect?: () => void;
}

export function* CommandPalette(
  props: {
    items: readonly CommandItem[];
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    onSelect?: (item: CommandItem) => void;
    placeholder?: string;
    shortcut?: boolean;
    class?: string;
  },
  ctx: Ctx,
)

export function* pickCommand(
  items: readonly CommandItem[],
  opts: { placeholder?: string } = {},
): Generator<View, CommandItem | null, any>
```

## command-bar

Interactive dashboard and table filter toolbar with search, toggleable filter chips, and reset.

Install with `vp dlx @fierst/ui add command-bar`. Direct registry dependencies: theme, icon, search-input. Direct npm dependencies: @lucide/icons.

Exports from `./ui/command-bar`: `FilterBar`.

Minimal TSX usage

```tsx
import { FilterBar } from './ui/command-bar';

<FilterBar />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/command-bar.tsx) · [ops.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/ops.tsx#L168)

API contracts

```ts
export function FilterBar({
  query,
  onQueryChange,
  searchPlaceholder = 'Filter items…',
  filters = [],
  activeFilters = [],
  onToggleFilter,
  onClearAll,
  right,
  class: extraClass,
}: {
  query?: string;
  onQueryChange?: (q: string) => void;
  searchPlaceholder?: string;
  filters?: readonly { id: string; label: string }[];
  activeFilters?: readonly string[];
  onToggleFilter?: (id: string) => void;
  onClearAll?: () => void;
  right?: View;
  class?: string;
})
```

## container

Responsive page Container (sm/md/lg/xl/full) plus vertical Stack and wrapping Cluster layout primitives.

Install with `vp dlx @fierst/ui add container`. Direct registry dependencies: theme. Direct npm dependencies: none.

Exports from `./ui/container`: `Container`, `Stack`, `Cluster`.

Minimal TSX usage

```tsx
import { Container } from './ui/container';

<Container />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/container.tsx) · [overlays.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/overlays.tsx#L42)

API contracts

```ts
export function Container({
  size = 'xl',
  class: extraClass,
  children,
}: {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  class?: string;
  children?: View;
})

export function Stack({
  gap = '0.85rem',
  align,
  class: extraClass,
  children,
}: {
  gap?: string;
  align?: 'stretch' | 'flex-start' | 'center' | 'flex-end';
  class?: string;
  children?: View;
})

export function Cluster({
  gap = '0.5rem',
  justify,
  align = 'center',
  class: extraClass,
  children,
}: {
  gap?: string;
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between';
  align?: 'flex-start' | 'center' | 'flex-end' | 'baseline';
  class?: string;
  children?: View;
})
```

## context-menu

Right-click viewport-clamped floating menu with shortcuts, separators, destructive items, and ctx.signal cleanup.

Install with `vp dlx @fierst/ui add context-menu`. Direct registry dependencies: theme. Direct npm dependencies: none.

Exports from `./ui/context-menu`: `ContextMenuItem`, `ContextMenu`.

Minimal TSX usage

```tsx
import { ContextMenu } from './ui/context-menu';

(
    <ContextMenu items={[{ id: 'print', label: 'Print', onSelect: () => window.print() }]} />
  )
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/context-menu.tsx) · [ops.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/ops.tsx#L362)

API contracts

```ts
export interface ContextMenuItem {
  id: string;
  label: string;
  shortcut?: string;
  danger?: boolean;
  disabled?: boolean;
  separatorBefore?: boolean;
  onSelect: () => void;
}

export function* ContextMenu(
  props: {
    items: readonly ContextMenuItem[];
    class?: string;
    children?: View;
  },
  ctx: Ctx,
)
```

## copy-button

Clipboard copy button with animated Check feedback and clean CodeBlock with filename header.

Install with `vp dlx @fierst/ui add copy-button`. Direct registry dependencies: theme, icon. Direct npm dependencies: @lucide/icons.

Exports from `./ui/copy-button`: `CopyButton`, `CodeBlock`.

Minimal TSX usage

```tsx
import { CopyButton } from './ui/copy-button';

<CopyButton text="Copy" />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/copy-button.tsx) · [directory.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/directory.tsx#L205) · [ops.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/ops.tsx#L398)

API contracts

```ts
export function* CopyButton(
  props: {
    text: string;
    label?: string;
    copiedLabel?: string;
    resetMs?: number;
    onCopy?: () => void;
    onError?: (error: unknown) => void;
    class?: string;
  },
  ctx: Ctx,
)

export function CodeBlock({
  code,
  filename,
  class: extraClass,
}: {
  code: string;
  filename?: string;
  class?: string;
})
```

## currency-input

Tabular-numeral monetary input with currency symbol, ISO badge, and blur precision formatting.

Install with `vp dlx @fierst/ui add currency-input`. Direct registry dependencies: theme. Direct npm dependencies: none.

Exports from `./ui/currency-input`: `CurrencyInput`.

Minimal TSX usage

```tsx
import { CurrencyInput } from './ui/currency-input';

<CurrencyInput />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/currency-input.tsx) · [forms.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/forms.tsx#L338)

API contracts

```ts
export function* CurrencyInput(
  props: {
    label?: string;
    currency?: 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD';
    value?: number;
    defaultValue?: number;
    placeholder?: string;
    onChange?: (amount: number) => void;
    class?: string;
  },
  ctx: Ctx,
)
```

## data-table

Mobile-first sortable, searchable, O(n log n) LIS-keyed table that stacks into labeled cards on small screens.

Install with `vp dlx @fierst/ui add data-table`. Direct registry dependencies: theme, input, icon. Direct npm dependencies: @lucide/icons.

Exports from `./ui/data-table`: `ColumnDef`, `DataTable`.

Minimal TSX usage

```tsx
import { DataTable } from './ui/data-table';

(
    <DataTable
      columns={[{ key: 'name', header: 'Name' }]}
      rows={[{ id: 1, name: 'Ada' }]}
      rowKey={(row) => row.id}
    />
  )
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/data-table.tsx) · [ops.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/ops.tsx#L266)

API contracts

```ts
export interface ColumnDef<T> {
  key: string;
  header: string;
  sortable?: boolean;
  render?: (row: T) => View;
}

export function* DataTable<T extends Record<string, any>>(
  props: {
    rows: readonly T[];
    columns: readonly ColumnDef<T>[];
    rowKey: (row: T) => string | number;
    searchable?: boolean;
    searchPlaceholder?: string;
    emptyText?: string;
    class?: string;
  },
  ctx: Ctx,
)
```

## date-range-picker

Start/End date range selector with quick range presets (7/30/90 days) and automatic range normalization.

Install with `vp dlx @fierst/ui add date-range-picker`. Direct registry dependencies: theme, icon, calendar. Direct npm dependencies: @lucide/icons.

Exports from `./ui/date-range-picker`: `DateRange`, `DateRangePicker`.

Minimal TSX usage

```tsx
import { DateRangePicker } from './ui/date-range-picker';

<DateRangePicker />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/date-range-picker.tsx) · [forms.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/forms.tsx#L283)

API contracts

```ts
export interface DateRange {
  start: string;
  end: string;
}

export function* DateRangePicker(
  props: {
    label?: string;
    value?: DateRange;
    defaultValue?: DateRange;
    onChange?: (range: DateRange) => void;
    class?: string;
  },
  ctx: Ctx,
)
```

## description-list

Structured semantic <dl> key-value detail list with responsive stacked mobile layout and optional striping.

Install with `vp dlx @fierst/ui add description-list`. Direct registry dependencies: theme. Direct npm dependencies: none.

Exports from `./ui/description-list`: `DescriptionItem`, `DescriptionList`.

Minimal TSX usage

```tsx
import { DescriptionList } from './ui/description-list';

<DescriptionList items={[{ term: 'Owner', detail: 'Ada' }]} />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/description-list.tsx) · [ops.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/ops.tsx#L403)

API contracts

```ts
export interface DescriptionItem {
  id?: string;
  term: string;
  detail: View;
}

export function DescriptionList({
  items,
  striped = false,
  class: extraClass,
}: {
  items: readonly DescriptionItem[];
  striped?: boolean;
  class?: string;
})
```

## dialog

Opaque elevated native <dialog> with Safari-safe scrollable body, backdrop light-dismiss, and Aster's yield* confirmDialog() flow.

Install with `vp dlx @fierst/ui add dialog`. Direct registry dependencies: theme, button, icon. Direct npm dependencies: @lucide/icons.

Exports from `./ui/dialog`: `Dialog`, `ConfirmDialogOptions`, `confirmDialog`.

Minimal TSX usage

```tsx
import { Dialog } from './ui/dialog';

<Dialog />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/dialog.tsx) · [overlays.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/overlays.tsx#L327)

API contracts

```ts
export function Dialog({
  id,
  open,
  title,
  description,
  footer,
  showClose = true,
  onClose,
  class: extraClass,
  children,
}: {
  id?: string;
  open?: any;
  title?: string;
  description?: string;
  footer?: View;
  showClose?: boolean;
  onClose?: () => void;
  class?: string;
  children?: View;
})

export interface ConfirmDialogOptions {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
}

export function* confirmDialog(opts: ConfirmDialogOptions): Generator<View, boolean, any>
```

## diff-viewer

Unified code and SQL diff viewer with line numbers and semantic add/delete highlights.

Install with `vp dlx @fierst/ui add diff-viewer`. Direct registry dependencies: theme. Direct npm dependencies: none.

Exports from `./ui/diff-viewer`: `DiffLine`, `DiffViewer`.

Minimal TSX usage

```tsx
import { DiffViewer } from './ui/diff-viewer';

(
    <DiffViewer
      lines={[
        { kind: 'del', text: 'draft' },
        { kind: 'add', text: 'ready' },
      ]}
    />
  )
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/diff-viewer.tsx) · [ai.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/ai.tsx#L185)

API contracts

```ts
export interface DiffLine {
  kind: 'ctx' | 'add' | 'del';
  text: string;
  lineNo?: number;
}

export function DiffViewer({
  filename = 'migration.sql',
  lines,
  class: extraClass,
}: {
  filename?: string;
  lines: readonly DiffLine[];
  class?: string;
})
```

## donut-chart

Zero-dependency SVG donut chart with center KPI total and percentage legend.

Install with `vp dlx @fierst/ui add donut-chart`. Direct registry dependencies: theme. Direct npm dependencies: none.

Exports from `./ui/donut-chart`: `DonutSlice`, `DonutChart`.

Minimal TSX usage

```tsx
import { DonutChart } from './ui/donut-chart';

(
    <DonutChart
      data={[
        { label: 'May', value: 24 },
        { label: 'June', value: 31 },
      ]}
    />
  )
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/donut-chart.tsx) · [overview.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/overview.tsx#L195)

API contracts

```ts
export interface DonutSlice {
  label: string;
  value: number;
  color?: string;
}

export function DonutChart({
  data,
  size = 136,
  strokeWidth = 18,
  centerLabel = 'Total',
  class: extraClass,
}: {
  data: readonly DonutSlice[];
  size?: number;
  strokeWidth?: number;
  centerLabel?: string;
  class?: string;
})
```

## drawer

Mobile-first bottom action drawer built on Sheet plus Aster-native yield* promptDrawer() flow.

Install with `vp dlx @fierst/ui add drawer`. Direct registry dependencies: theme, sheet, button. Direct npm dependencies: none.

Exports from `./ui/drawer`: `Drawer`, `DrawerAction`, `promptDrawer`.

Minimal TSX usage

```tsx
import { Drawer } from './ui/drawer';

<Drawer />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/drawer.tsx) · [ops.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/ops.tsx#L474)

API contracts

```ts
export function Drawer({
  id,
  open,
  title,
  description,
  footer,
  onClose,
  class: extraClass,
  children,
}: {
  id?: string;
  open?: any;
  title?: string;
  description?: string;
  footer?: View;
  onClose?: () => void;
  class?: string;
  children?: View;
})

export interface DrawerAction {
  id: string;
  label: string;
  danger?: boolean;
}

export function* promptDrawer(opts: {
  title: string;
  description?: string;
  actions: readonly DrawerAction[];
  cancelLabel?: string;
}): Generator<View, string | null, any>
```

## empty-state

Dashed-border empty state placeholder with centered Lucide icon, copy, and call-to-action slot.

Install with `vp dlx @fierst/ui add empty-state`. Direct registry dependencies: theme, icon. Direct npm dependencies: @lucide/icons.

Exports from `./ui/empty-state`: `EmptyState`.

Minimal TSX usage

```tsx
import { EmptyState } from './ui/empty-state';

<EmptyState title="Empty" />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/empty-state.tsx) · [ops.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/ops.tsx#L245)

API contracts

```ts
export function EmptyState({
  title,
  description,
  icon = Inbox,
  action,
  class: extraClass,
}: {
  title: string;
  description?: string;
  icon?: LucideIconInput;
  action?: View;
  class?: string;
})
```

## file-upload

Drag-and-drop & click file upload dropzone with max-size validation and removable file list.

Install with `vp dlx @fierst/ui add file-upload`. Direct registry dependencies: theme, icon. Direct npm dependencies: @lucide/icons.

Exports from `./ui/file-upload`: `FileUpload`.

Minimal TSX usage

```tsx
import { FileUpload } from './ui/file-upload';

<FileUpload />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/file-upload.tsx) · [forms.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/forms.tsx#L402)

API contracts

```ts
export function* FileUpload(
  props: {
    label?: string;
    accept?: string;
    multiple?: boolean;
    maxSizeBytes?: number;
    hint?: string;
    onChange?: (files: File[]) => void;
    class?: string;
  },
  ctx: Ctx,
)
```

## footer

Multi-column SaaS and documentation footer with brand block, link columns, and legal bar.

Install with `vp dlx @fierst/ui add footer`. Direct registry dependencies: theme. Direct npm dependencies: none.

Exports from `./ui/footer`: `FooterColumn`, `Footer`.

Minimal TSX usage

```tsx
import { Footer } from './ui/footer';

<Footer brand="Example" columns={[]} />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/footer.tsx) · [overview.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/overview.tsx#L376)

API contracts

```ts
export interface FooterColumn {
  heading: string;
  links: readonly { label: string; href: string }[];
}

export function Footer({
  brand,
  tagline,
  columns,
  copyright,
  extra,
  class: extraClass,
}: {
  brand: View;
  tagline?: string;
  columns: readonly FooterColumn[];
  copyright?: string;
  extra?: View;
  class?: string;
})
```

## form

Structured two-column split or stacked Tailwind UI settings form layout.

Install with `vp dlx @fierst/ui add form`. Direct registry dependencies: theme. Direct npm dependencies: none.

Exports from `./ui/form`: `Form`, `FormSection`, `FormActions`.

Minimal TSX usage

```tsx
import { Form } from './ui/form';

<Form />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/form.tsx) · [forms.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/forms.tsx#L100)

API contracts

```ts
export function Form({
  onSubmit,
  class: extraClass,
  children,
}: {
  onSubmit?: (e: SubmitEvent) => void;
  class?: string;
  children?: View;
})

export function FormSection({
  title,
  description,
  layout = 'split',
  class: extraClass,
  children,
}: {
  title: string;
  description?: string;
  layout?: 'split' | 'stacked';
  class?: string;
  children?: View;
})

export function FormActions(props: { class?: string; children?: View })
```

## grid

Responsive 1/2/3/4-column Grid and multi-span BentoGrid / BentoCard feature showcase layout.

Install with `vp dlx @fierst/ui add grid`. Direct registry dependencies: theme. Direct npm dependencies: none.

Exports from `./ui/grid`: `Grid`, `BentoGrid`, `BentoCard`.

Minimal TSX usage

```tsx
import { Grid } from './ui/grid';

<Grid />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/grid.tsx) · [ai.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/ai.tsx#L82) · [directory.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/directory.tsx#L190) · [forms.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/forms.tsx#L131) · [overview.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/overview.tsx#L159)

API contracts

```ts
export function Grid({
  cols = 3,
  gap,
  class: extraClass,
  children,
}: {
  cols?: 1 | 2 | 3 | 4;
  gap?: string;
  class?: string;
  children?: View;
})

export function BentoGrid(props: { gap?: string; class?: string; children?: View })

export function BentoCard({
  title,
  description,
  colSpan = 1,
  rowSpan = 1,
  class: extraClass,
  children,
}: {
  title: string;
  description?: string;
  colSpan?: 1 | 2;
  rowSpan?: 1 | 2;
  class?: string;
  children?: View;
})
```

## hover-card

Rich hover/focus preview card with open/close delays, Escape dismiss, and try/finally timer cleanup.

Install with `vp dlx @fierst/ui add hover-card`. Direct registry dependencies: theme. Direct npm dependencies: none.

Exports from `./ui/hover-card`: `HoverCard`.

Minimal TSX usage

```tsx
import { HoverCard } from './ui/hover-card';

<HoverCard trigger="Details" />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/hover-card.tsx) · [ops.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/ops.tsx#L216)

API contracts

```ts
export function* HoverCard(
  props: {
    label?: string;
    trigger: View;
    side?: 'bottom' | 'top';
    align?: 'start' | 'end';
    openDelay?: number;
    closeDelay?: number;
    class?: string;
    children?: View;
  },
  ctx: Ctx,
)
```

## icon

Zero-overhead Slot-Compiled SVG renderer for tree-shakeable `@lucide/icons` (and legacy `lucide` / `@lucide/lab` nodes) across Client, Shadow DOM, and SSR.

Install with `vp dlx @fierst/ui add icon`. Direct registry dependencies: theme. Direct npm dependencies: @lucide/icons.

Exports from `./ui/icon`: `LucideIconNode`, `LucideIconData`, `LucideIconInput`, `IconProps`, `Icon`, `createIcon`.

Minimal TSX usage

```tsx
import { Check } from '@lucide/icons';
import { Icon } from './ui/icon';

<Icon icon={Check} />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/icon.tsx) · [showcase.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase.tsx#L217) · [ai.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/ai.tsx#L61) · [directory.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/directory.tsx#L208) · [forms.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/forms.tsx#L78) · [ops.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/ops.tsx#L147) · [overlays.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/overlays.tsx#L56) · [overview.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/overview.tsx#L106)

API contracts

```ts
export type LucideIconNode = readonly [
  tag: string,
  attrs: Readonly<Record<string, string | number | undefined>>,
  children?: readonly LucideIconNode[],
];

export interface LucideIconData {
  readonly name?: string;
  readonly node: readonly LucideIconNode[];
  readonly aliases?: readonly string[];
  readonly size?: number;
  readonly width?: number;
  readonly height?: number;
}

export type LucideIconInput = LucideIconData | readonly LucideIconNode[];

export interface IconProps {
  /** Tree-shaken icon imported from `@lucide/icons` (or a `LucideIconNode[]` tuple array). */
  icon: LucideIconInput;
  /** Icon width & height in px or CSS length (default: 18). */
  size?: number | string;
  /** SVG stroke width (default: 1.75 for AsterUI optical balance). */
  strokeWidth?: number;
  /** Scale stroke width inversely with `size` so lines stay visually consistent at any scale. */
  absoluteStrokeWidth?: boolean;
  /** Override stroke color (defaults to `currentColor`). */
  color?: string;
  /** Animate continuous rotation (ideal for `LoaderCircle`). */
  spin?: boolean;
  /** Accessible label. When omitted, the icon is treated as decorative (`aria-hidden="true"`). */
  label?: string;
  class?: string;
  [key: string]: any;
}

export function Icon({
  icon,
  size = 18,
  strokeWidth = 1.75,
  absoluteStrokeWidth = false,
  color,
  spin = false,
  label,
  class: extraClass,
  ...rest
}: IconProps): SlotView

export function createIcon(
  icon: LucideIconInput,
  defaults: Omit<IconProps, 'icon'> = {},
): (props?: Omit<IconProps, 'icon'>) => SlotView
```

## inline-edit

Click-to-edit text control with Enter-to-save, Escape-to-cancel, and pencil affordance.

Install with `vp dlx @fierst/ui add inline-edit`. Direct registry dependencies: theme, icon. Direct npm dependencies: @lucide/icons.

Exports from `./ui/inline-edit`: `InlineEdit`.

Minimal TSX usage

```tsx
import { InlineEdit } from './ui/inline-edit';

<InlineEdit />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/inline-edit.tsx) · [forms.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/forms.tsx#L116)

API contracts

```ts
export function* InlineEdit(
  props: {
    value?: string;
    defaultValue?: string;
    placeholder?: string;
    onSave?: (next: string) => void;
    class?: string;
  },
  ctx: Ctx,
)
```

## input

Accessible form inputs with bind:value, label, hint, aria-invalid error announcements, and adornments.

Install with `vp dlx @fierst/ui add input`. Direct registry dependencies: theme. Direct npm dependencies: none.

Exports from `./ui/input`: `Input`, `Textarea`.

Minimal TSX usage

```tsx
import { Input } from './ui/input';

<Input label="Email address" type="email" />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/input.tsx) · [showcase.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase.tsx#L367) · [forms.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/forms.tsx#L122)

API contracts

```ts
export function Input({
  id,
  label,
  hint,
  error,
  leading,
  trailing,
  class: extraClass,
  ...rest
}: {
  id?: string;
  label?: string;
  hint?: string;
  error?: string | null;
  leading?: View;
  trailing?: View;
  class?: string;
  [key: string]: any;
})

export function Textarea({
  id,
  label,
  hint,
  error,
  class: extraClass,
  ...rest
}: {
  id?: string;
  label?: string;
  hint?: string;
  error?: string | null;
  class?: string;
  [key: string]: any;
})
```

## input-otp

Verification code input with auto-advance, Backspace rewind, paste support, and one-time-code autocomplete.

Install with `vp dlx @fierst/ui add input-otp`. Direct registry dependencies: theme. Direct npm dependencies: none.

Exports from `./ui/input-otp`: `InputOTP`.

Minimal TSX usage

```tsx
import { InputOTP } from './ui/input-otp';

<InputOTP />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/input-otp.tsx) · [forms.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/forms.tsx#L391)

API contracts

```ts
export function* InputOTP(
  props: {
    length?: number;
    value?: string;
    defaultValue?: string;
    label?: string;
    hint?: string;
    separatorAt?: number;
    disabled?: boolean;
    onChange?: (code: string) => void;
    onComplete?: (code: string) => void;
    class?: string;
  },
  ctx: Ctx,
)
```

## json-viewer

Collapsible syntax-colored JSON tree inspector with configurable initial depth.

Install with `vp dlx @fierst/ui add json-viewer`. Direct registry dependencies: theme, icon. Direct npm dependencies: @lucide/icons.

Exports from `./ui/json-viewer`: `JsonViewer`.

Minimal TSX usage

```tsx
import { JsonViewer } from './ui/json-viewer';

<JsonViewer data={null} />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/json-viewer.tsx) · [ai.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/ai.tsx#L187)

API contracts

```ts
export function* JsonViewer(
  props: {
    data: unknown;
    defaultExpandedDepth?: number;
    class?: string;
  },
  ctx: Ctx,
)
```

## kanban

Multi-column status board with card counters, status badges, and accessible move-column controls.

Install with `vp dlx @fierst/ui add kanban`. Direct registry dependencies: theme, icon, badge. Direct npm dependencies: @lucide/icons.

Exports from `./ui/kanban`: `KanbanCardItem`, `KanbanBoard`.

Minimal TSX usage

```tsx
import { KanbanBoard } from './ui/kanban';

(
    <KanbanBoard
      columns={[{ id: 'todo', title: 'To do' }]}
      cards={[{ id: 'a', columnId: 'todo', title: 'Review' }]}
    />
  )
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/kanban.tsx) · [ops.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/ops.tsx#L315)

API contracts

```ts
export interface KanbanCardItem {
  id: string;
  columnId: string;
  title: string;
  meta?: string;
  tag?: string;
  tagTone?: BadgeTone;
}

export function* KanbanBoard(
  props: {
    columns: readonly { id: string; title: string }[];
    cards: readonly KanbanCardItem[];
    onMove?: (cardId: string, toColumnId: string) => void;
    class?: string;
  },
  ctx: Ctx,
)
```

## kbd

Monospace keyboard shortcut keycap primitive with crisp border bevel.

Install with `vp dlx @fierst/ui add kbd`. Direct registry dependencies: theme. Direct npm dependencies: none.

Exports from `./ui/kbd`: `Kbd`, `KbdGroup`.

Minimal TSX usage

```tsx
import { Kbd } from './ui/kbd';

<Kbd />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/kbd.tsx) · [ops.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/ops.tsx#L394)

API contracts

```ts
export function Kbd(props: { class?: string; children?: View })

export function KbdGroup(props: { keys: readonly string[]; class?: string })
```

## label

Accessible form Label (with required marker) and Field wrapper for composing custom inputs.

Install with `vp dlx @fierst/ui add label`. Direct registry dependencies: theme. Direct npm dependencies: none.

Exports from `./ui/label`: `Label`, `Field`.

Minimal TSX usage

```tsx
import { Label } from './ui/label';

<Label />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/label.tsx) · [forms.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/forms.tsx#L112)

API contracts

```ts
export function Label({
  for: htmlFor,
  required = false,
  class: extraClass,
  children,
}: {
  for?: string;
  required?: boolean;
  class?: string;
  children?: View;
})

export function Field({
  label,
  for: htmlFor,
  required = false,
  hint,
  error,
  class: extraClass,
  children,
}: {
  label?: string;
  for?: string;
  required?: boolean;
  hint?: string;
  error?: string | null;
  class?: string;
  children?: View;
})
```

## line-chart

Zero-dependency responsive SVG line and area charts with interactive data points.

Install with `vp dlx @fierst/ui add line-chart`. Direct registry dependencies: theme. Direct npm dependencies: none.

Exports from `./ui/line-chart`: `LineChart`, `AreaChart`.

Minimal TSX usage

```tsx
import { LineChart } from './ui/line-chart';

(
    <LineChart
      data={[
        { label: 'May', value: 24 },
        { label: 'June', value: 31 },
      ]}
    />
  )
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/line-chart.tsx) · [overview.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/overview.tsx#L164)

API contracts

```ts
export function* LineChart(
  props: {
    data: readonly { label: string; value: number }[];
    area?: boolean;
    height?: number;
    unit?: string;
    label?: string;
    class?: string;
  },
  ctx: Ctx,
)

export function AreaChart(props: {
  data: readonly { label: string; value: number }[];
  height?: number;
  unit?: string;
  label?: string;
  class?: string;
})
```

## mention-input

Textarea with live @mention trigger popover for tagging teammates or resources.

Install with `vp dlx @fierst/ui add mention-input`. Direct registry dependencies: theme. Direct npm dependencies: none.

Exports from `./ui/mention-input`: `MentionCandidate`, `MentionInput`.

Minimal TSX usage

```tsx
import { MentionInput } from './ui/mention-input';

<MentionInput candidates={[{ handle: 'ada', name: 'Ada' }]} />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/mention-input.tsx) · [ai.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/ai.tsx#L201)

API contracts

```ts
export interface MentionCandidate {
  handle: string;
  name: string;
}

export function* MentionInput(
  props: {
    label?: string;
    candidates: readonly MentionCandidate[];
    value?: string;
    defaultValue?: string;
    placeholder?: string;
    onChange?: (val: string) => void;
    class?: string;
  },
  ctx: Ctx,
)
```

## menubar

Desktop-style horizontal application menu bar with hover-switching, shortcuts, and ctx.signal dismissal.

Install with `vp dlx @fierst/ui add menubar`. Direct registry dependencies: theme. Direct npm dependencies: none.

Exports from `./ui/menubar`: `MenubarMenu`, `Menubar`.

Minimal TSX usage

```tsx
import { Menubar } from './ui/menubar';

(
    <Menubar
      menus={[
        {
          id: 'file',
          label: 'File',
          items: [{ id: 'print', label: 'Print', onSelect: () => window.print() }],
        },
      ]}
    />
  )
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/menubar.tsx) · [overlays.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/overlays.tsx#L193)

API contracts

```ts
export interface MenubarMenu {
  id: string;
  label: string;
  items: readonly {
    id: string;
    label: string;
    shortcut?: string;
    disabled?: boolean;
    separatorBefore?: boolean;
    onSelect: () => void;
  }[];
}

export function* Menubar(
  props: {
    menus: readonly MenubarMenu[];
    label?: string;
    class?: string;
  },
  ctx: Ctx,
)
```

## meter

Semantic capacity and quota meter bar with automatic ok/warning/danger color thresholds.

Install with `vp dlx @fierst/ui add meter`. Direct registry dependencies: theme. Direct npm dependencies: none.

Exports from `./ui/meter`: `Meter`.

Minimal TSX usage

```tsx
import { Meter } from './ui/meter';

<Meter label="Quota" value={1} />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/meter.tsx) · [overview.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/overview.tsx#L239)

API contracts

```ts
export function Meter({
  label,
  value,
  max = 100,
  warnAt = 75,
  dangerAt = 90,
  valueLabel,
  class: extraClass,
}: {
  label: string;
  value: number;
  max?: number;
  warnAt?: number;
  dangerAt?: number;
  valueLabel?: string;
  class?: string;
})
```

## metric-list

Ranked horizontal progress bar list for top routes, sources, or error breakdowns.

Install with `vp dlx @fierst/ui add metric-list`. Direct registry dependencies: theme. Direct npm dependencies: none.

Exports from `./ui/metric-list`: `MetricList`.

Minimal TSX usage

```tsx
import { MetricList } from './ui/metric-list';

<MetricList items={[{ label: 'Completed', value: 8 }]} />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/metric-list.tsx) · [overview.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/overview.tsx#L211)

API contracts

```ts
export function MetricList({
  items,
  unit = '',
  class: extraClass,
}: {
  items: readonly { label: string; value: number }[];
  unit?: string;
  class?: string;
})
```

## multi-select

Searchable multi-option combobox displaying removable chips and a viewport-clamped opaque Popover list.

Install with `vp dlx @fierst/ui add multi-select`. Direct registry dependencies: theme, icon. Direct npm dependencies: @lucide/icons.

Exports from `./ui/multi-select`: `MultiSelectOption`, `MultiSelect`.

Minimal TSX usage

```tsx
import { MultiSelect } from './ui/multi-select';

(
    <MultiSelect
      options={[
        { value: 'en', label: 'English' },
        { value: 'es', label: 'Spanish' },
      ]}
    />
  )
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/multi-select.tsx) · [forms.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/forms.tsx#L153)

API contracts

```ts
export interface MultiSelectOption {
  value: string;
  label: string;
}

export function* MultiSelect(
  props: {
    label?: string;
    options: readonly MultiSelectOption[];
    value?: readonly string[];
    defaultValue?: readonly string[];
    placeholder?: string;
    onChange?: (values: string[]) => void;
    class?: string;
  },
  ctx: Ctx,
)
```

## navbar

Responsive sticky top navigation bar with brand, links, action slot, and mobile Sheet drawer.

Install with `vp dlx @fierst/ui add navbar`. Direct registry dependencies: theme, icon, sheet. Direct npm dependencies: @lucide/icons.

Exports from `./ui/navbar`: `NavbarLink`, `Navbar`.

Minimal TSX usage

```tsx
import { Navbar } from './ui/navbar';

<Navbar brand="Brand" links={[]} />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/navbar.tsx) · [overlays.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/overlays.tsx#L173)

API contracts

```ts
export interface NavbarLink {
  label: string;
  href: string;
  active?: boolean;
}

export function* Navbar(
  props: {
    brand: View;
    links: readonly NavbarLink[];
    actions?: View;
    class?: string;
  },
  ctx: Ctx,
)
```

## navigation-menu

Top-level dropdown mega-menu with icon descriptions and keyboard Escape dismissal.

Install with `vp dlx @fierst/ui add navigation-menu`. Direct registry dependencies: theme, icon. Direct npm dependencies: @lucide/icons.

Exports from `./ui/navigation-menu`: `NavMenuSection`, `NavigationMenu`.

Minimal TSX usage

```tsx
import { NavigationMenu } from './ui/navigation-menu';

(
    <NavigationMenu
      sections={[
        {
          id: 'help',
          label: 'Help',
          links: [{ title: 'Guide', description: 'Getting started', href: '/guide' }],
        },
      ]}
    />
  )
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/navigation-menu.tsx) · [overlays.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/overlays.tsx#L228)

API contracts

```ts
export interface NavMenuSection {
  id: string;
  label: string;
  links: readonly { title: string; description: string; href: string; icon?: LucideIconInput }[];
}

export function* NavigationMenu(
  props: {
    sections: readonly NavMenuSection[];
    class?: string;
  },
  ctx: Ctx,
)
```

## number-input

Accessible stepper numeric input with +/- buttons, min/max/step clamping, unit adornment, and keyboard arrows.

Install with `vp dlx @fierst/ui add number-input`. Direct registry dependencies: theme, icon. Direct npm dependencies: @lucide/icons.

Exports from `./ui/number-input`: `NumberInput`.

Minimal TSX usage

```tsx
import { NumberInput } from './ui/number-input';

<NumberInput />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/number-input.tsx) · [forms.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/forms.tsx#L330)

API contracts

```ts
export function* NumberInput(
  props: {
    id?: string;
    label?: string;
    value?: number;
    defaultValue?: number;
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
    hint?: string;
    disabled?: boolean;
    onChange?: (value: number) => void;
    class?: string;
  },
  ctx: Ctx,
)
```

## page-header

Classic Tailwind UI page title header with breadcrumb/eyebrow slot, description, metadata row, and actions.

Install with `vp dlx @fierst/ui add page-header`. Direct registry dependencies: theme. Direct npm dependencies: none.

Exports from `./ui/page-header`: `PageHeader`.

Minimal TSX usage

```tsx
import { PageHeader } from './ui/page-header';

<PageHeader title="Title" />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/page-header.tsx) · [ai.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/ai.tsx#L55) · [directory.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/directory.tsx#L155) · [forms.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/forms.tsx#L59) · [ops.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/ops.tsx#L134) · [overlays.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/overlays.tsx#L44) · [overview.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/overview.tsx#L83)

API contracts

```ts
export function PageHeader({
  title,
  description,
  eyebrow,
  breadcrumb,
  meta,
  actions,
  class: extraClass,
}: {
  title: string;
  description?: string;
  eyebrow?: string;
  breadcrumb?: View;
  meta?: View;
  actions?: View;
  class?: string;
})
```

## pagination

Mobile-first pagination showing compact Page X / Y on phones and full windowed ellipsis navigation on desktop.

Install with `vp dlx @fierst/ui add pagination`. Direct registry dependencies: theme, icon. Direct npm dependencies: @lucide/icons.

Exports from `./ui/pagination`: `Pagination`.

Minimal TSX usage

```tsx
import { Pagination } from './ui/pagination';

<Pagination totalPages={5} />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/pagination.tsx) · [ops.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/ops.tsx#L267)

API contracts

```ts
export function* Pagination(
  props: {
    page?: number;
    defaultPage?: number;
    totalPages: number;
    siblings?: number;
    onChange?: (page: number) => void;
    class?: string;
  },
  ctx: Ctx,
)
```

## password-input

Password input with show/hide eye toggle and optional 4-segment strength meter.

Install with `vp dlx @fierst/ui add password-input`. Direct registry dependencies: theme, icon. Direct npm dependencies: @lucide/icons.

Exports from `./ui/password-input`: `PasswordInput`.

Minimal TSX usage

```tsx
import { PasswordInput } from './ui/password-input';

<PasswordInput />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/password-input.tsx) · [forms.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/forms.tsx#L377)

API contracts

```ts
export function* PasswordInput(
  props: {
    id?: string;
    label?: string;
    value?: string;
    defaultValue?: string;
    placeholder?: string;
    showStrength?: boolean;
    error?: string | null;
    onChange?: (val: string) => void;
    class?: string;
  },
  ctx: Ctx,
)
```

## phone-input

International dial-code selector paired with a national telephone input.

Install with `vp dlx @fierst/ui add phone-input`. Direct registry dependencies: theme. Direct npm dependencies: none.

Exports from `./ui/phone-input`: `PhoneInput`.

Minimal TSX usage

```tsx
import { PhoneInput } from './ui/phone-input';

<PhoneInput />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/phone-input.tsx) · [forms.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/forms.tsx#L386)

API contracts

```ts
export function* PhoneInput(
  props: {
    label?: string;
    value?: string;
    defaultCountry?: string;
    placeholder?: string;
    onChange?: (e164: string) => void;
    class?: string;
  },
  ctx: Ctx,
)
```

## popover

Viewport-clamped opaque overlays built on the native HTML Popover API with light-dismiss, shortcuts, and destructive items.

Install with `vp dlx @fierst/ui add popover`. Direct registry dependencies: theme, button, icon. Direct npm dependencies: @lucide/icons.

Exports from `./ui/popover`: `Popover`, `MenuItem`, `DropdownMenu`.

Minimal TSX usage

```tsx
import { Popover } from './ui/popover';

<Popover id="test-popover" />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/popover.tsx) · [overlays.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/overlays.tsx#L117)

API contracts

```ts
export function Popover({
  id,
  mode = 'auto',
  align = 'start',
  onToggle,
  class: extraClass,
  children,
}: {
  id: string;
  mode?: 'auto' | 'manual';
  align?: 'start' | 'end';
  onToggle?: (e: any) => void;
  class?: string;
  children?: View;
})

export interface MenuItem {
  id: string;
  label: string;
  shortcut?: string;
  danger?: boolean;
  separatorBefore?: boolean;
  onSelect: () => void;
}

export function DropdownMenu({
  label,
  variant = 'outline',
  align = 'start',
  items,
}: {
  label: string;
  variant?: ButtonVariant;
  align?: 'start' | 'end';
  items: readonly MenuItem[];
})
```

## progress

Determinate/indeterminate linear Progress bar, native SVG ProgressRing, and shimmer Skeleton placeholders for async function*.

Install with `vp dlx @fierst/ui add progress`. Direct registry dependencies: theme. Direct npm dependencies: none.

Exports from `./ui/progress`: `Progress`, `ProgressRing`, `Skeleton`.

Minimal TSX usage

```tsx
import { Progress } from './ui/progress';

<Progress value={64} />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/progress.tsx) · [overview.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/overview.tsx#L44)

API contracts

```ts
export function Progress({
  value,
  max = 100,
  label,
  showValue = false,
  class: extraClass,
}: {
  value?: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  class?: string;
})

export function ProgressRing({
  value,
  size = 52,
  strokeWidth = 5,
  showLabel = true,
  label = 'Progress',
  class: extraClass,
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
  label?: string;
  class?: string;
})

export function Skeleton({
  width = '100%',
  height = '1rem',
  shape = 'rect',
  class: extraClass,
}: {
  width?: string;
  height?: string;
  shape?: 'rect' | 'pill' | 'circle';
  class?: string;
})
```

## prompt-input

Multi-line AI prompt composer with Enter-to-send, Shift+Enter newline, attachment slot, and stop button.

Install with `vp dlx @fierst/ui add prompt-input`. Direct registry dependencies: theme, icon. Direct npm dependencies: @lucide/icons.

Exports from `./ui/prompt-input`: `PromptInput`.

Minimal TSX usage

```tsx
import { PromptInput } from './ui/prompt-input';

<PromptInput />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/prompt-input.tsx) · [ai.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/ai.tsx#L142)

API contracts

```ts
export function* PromptInput(
  props: {
    value?: string;
    placeholder?: string;
    streaming?: boolean;
    disabled?: boolean;
    leading?: View;
    onAttach?: () => void;
    onChange?: (val: string) => void;
    onSubmit?: (prompt: string) => void;
    onStop?: () => void;
    class?: string;
  },
  ctx: Ctx,
)
```

## prose

Clean typographic rhythm for documentation, changelogs, and long-form content plus semantic Text helper.

Install with `vp dlx @fierst/ui add prose`. Direct registry dependencies: theme. Direct npm dependencies: none.

Exports from `./ui/prose`: `Prose`, `Text`.

Minimal TSX usage

```tsx
import { Prose } from './ui/prose';

<Prose />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/prose.tsx) · [ai.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/ai.tsx#L94)

API contracts

```ts
export function Prose(props: { class?: string; children?: View })

export function Text({
  size = 'sm',
  tone = 'default',
  weight,
  class: extraClass,
  children,
}: {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  tone?: 'default' | 'muted' | 'subtle' | 'primary' | 'danger';
  weight?: 400 | 500 | 600 | 700;
  class?: string;
  children?: View;
})
```

## range-slider

Dual-thumb min/max range slider with live range badge and filled track.

Install with `vp dlx @fierst/ui add range-slider`. Direct registry dependencies: theme. Direct npm dependencies: none.

Exports from `./ui/range-slider`: `RangeSlider`.

Minimal TSX usage

```tsx
import { RangeSlider } from './ui/range-slider';

<RangeSlider />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/range-slider.tsx) · [forms.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/forms.tsx#L319)

API contracts

```ts
export function* RangeSlider(
  props: {
    label?: string;
    value?: readonly [number, number];
    defaultValue?: readonly [number, number];
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
    onChange?: (range: [number, number]) => void;
    class?: string;
  },
  ctx: Ctx,
)
```

## rating

Interactive and readonly star rating control with hover preview and keyboard arrow support.

Install with `vp dlx @fierst/ui add rating`. Direct registry dependencies: theme, icon. Direct npm dependencies: @lucide/icons.

Exports from `./ui/rating`: `Rating`.

Minimal TSX usage

```tsx
import { Rating } from './ui/rating';

<Rating />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/rating.tsx) · [forms.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/forms.tsx#L422)

API contracts

```ts
export function* Rating(
  props: {
    value?: number;
    defaultValue?: number;
    max?: number;
    size?: number;
    readOnly?: boolean;
    showValue?: boolean;
    label?: string;
    onChange?: (rating: number) => void;
    class?: string;
  },
  ctx: Ctx,
)
```

## reasoning-block

Collapsible chain-of-thought disclosure block with duration label.

Install with `vp dlx @fierst/ui add reasoning-block`. Direct registry dependencies: theme, icon. Direct npm dependencies: @lucide/icons.

Exports from `./ui/reasoning-block`: `ReasoningBlock`.

Minimal TSX usage

```tsx
import { ReasoningBlock } from './ui/reasoning-block';

<ReasoningBlock />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/reasoning-block.tsx) · [ai.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/ai.tsx#L111)

API contracts

```ts
export function ReasoningBlock({
  label = 'Thought process',
  durationLabel,
  defaultOpen = false,
  class: extraClass,
  children,
}: {
  label?: string;
  durationLabel?: string;
  defaultOpen?: boolean;
  class?: string;
  children?: View;
})
```

## resizable

Pointer- and keyboard-accessible split-pane layout (horizontal/vertical) with drag handle.

Install with `vp dlx @fierst/ui add resizable`. Direct registry dependencies: theme, icon. Direct npm dependencies: @lucide/icons.

Exports from `./ui/resizable`: `ResizableSplit`.

Minimal TSX usage

```tsx
import { ResizableSplit } from './ui/resizable';

<ResizableSplit first="Left" second="Right" />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/resizable.tsx) · [ops.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/ops.tsx#L336)

API contracts

```ts
export function* ResizableSplit(
  props: {
    direction?: 'horizontal' | 'vertical';
    defaultSplit?: number;
    min?: number;
    max?: number;
    height?: string;
    /** Automatically stack horizontal panes vertically on mobile (< 640px). Default: true. */
    stackOnMobile?: boolean;
    first: View;
    second: View;
    onResize?: (pct: number) => void;
    class?: string;
  },
  ctx: Ctx,
)
```

## scroll-area

Styled thin-scrollbar overflow container with vertical, horizontal, or 2D scrolling.

Install with `vp dlx @fierst/ui add scroll-area`. Direct registry dependencies: theme. Direct npm dependencies: none.

Exports from `./ui/scroll-area`: `ScrollArea`.

Minimal TSX usage

```tsx
import { ScrollArea } from './ui/scroll-area';

<ScrollArea />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/scroll-area.tsx) · [ops.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/ops.tsx#L436)

API contracts

```ts
export function ScrollArea({
  maxHeight = '260px',
  orientation = 'vertical',
  bordered = false,
  class: extraClass,
  children,
}: {
  maxHeight?: string;
  orientation?: 'vertical' | 'horizontal' | 'both';
  bordered?: boolean;
  class?: string;
  children?: View;
})
```

## search-input

Search input with leading magnifier, animated loading spinner, clear button, and shortcut hint.

Install with `vp dlx @fierst/ui add search-input`. Direct registry dependencies: theme, icon. Direct npm dependencies: @lucide/icons.

Exports from `./ui/search-input`: `SearchInput`.

Minimal TSX usage

```tsx
import { SearchInput } from './ui/search-input';

<SearchInput />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/search-input.tsx) · [directory.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/directory.tsx#L163) · [ops.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/ops.tsx#L343)

API contracts

```ts
export function* SearchInput(
  props: {
    value?: string;
    defaultValue?: string;
    placeholder?: string;
    loading?: boolean;
    shortcutHint?: string;
    onChange?: (val: string) => void;
    onSubmit?: (val: string) => void;
    class?: string;
  },
  ctx: Ctx,
)
```

## section-header

Hairline-bordered section heading with title, description, and right-aligned action slot.

Install with `vp dlx @fierst/ui add section-header`. Direct registry dependencies: theme. Direct npm dependencies: none.

Exports from `./ui/section-header`: `SectionHeader`.

Minimal TSX usage

```tsx
import { SectionHeader } from './ui/section-header';

<SectionHeader title="Title" />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/section-header.tsx) · [overlays.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/overlays.tsx#L287)

API contracts

```ts
export function SectionHeader({
  title,
  description,
  actions,
  class: extraClass,
}: {
  title: string;
  description?: string;
  actions?: View;
  class?: string;
})
```

## segmented-control

Compact radio segmented switcher (e.g., Day/Week/Month) with optional full-width layout.

Install with `vp dlx @fierst/ui add segmented-control`. Direct registry dependencies: theme. Direct npm dependencies: none.

Exports from `./ui/segmented-control`: `SegmentedControl`.

Minimal TSX usage

```tsx
import { SegmentedControl } from './ui/segmented-control';

(
    <SegmentedControl
      options={[
        { value: 'en', label: 'English' },
        { value: 'es', label: 'Spanish' },
      ]}
    />
  )
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/segmented-control.tsx) · [directory.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/directory.tsx#L172) · [forms.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/forms.tsx#L65) · [ops.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/ops.tsx#L197)

API contracts

```ts
export function* SegmentedControl(
  props: {
    options: readonly { value: string; label: string; disabled?: boolean }[];
    value?: string;
    defaultValue?: string;
    fullWidth?: boolean;
    label?: string;
    onChange?: (val: string) => void;
    class?: string;
  },
  ctx: Ctx,
)
```

## select

Mobile-friendly searchable Select / combobox with viewport-clamped opaque Popover dropdown, Lucide indicators, and keyboard nav.

Install with `vp dlx @fierst/ui add select`. Direct registry dependencies: theme, icon. Direct npm dependencies: @lucide/icons.

Exports from `./ui/select`: `SelectOption`, `Select`.

Minimal TSX usage

```tsx
import { Select } from './ui/select';

(
    <Select
      options={[
        { value: 'en', label: 'English' },
        { value: 'es', label: 'Spanish' },
      ]}
    />
  )
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/select.tsx) · [forms.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/forms.tsx#L132)

API contracts

```ts
export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export function* Select(
  props: {
    options: readonly SelectOption[];
    value?: string;
    defaultValue?: string;
    onChange?: (value: string) => void;
    label?: string;
    placeholder?: string;
    searchable?: boolean;
    searchPlaceholder?: string;
    hint?: string;
    error?: string | null;
    disabled?: boolean;
    class?: string;
  },
  ctx: Ctx,
)
```

## separator

Horizontal or vertical 1px hairline divider with optional centered text label.

Install with `vp dlx @fierst/ui add separator`. Direct registry dependencies: theme. Direct npm dependencies: none.

Exports from `./ui/separator`: `Separator`.

Minimal TSX usage

```tsx
import { Separator } from './ui/separator';

<Separator />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/separator.tsx) · [overlays.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/overlays.tsx#L252)

API contracts

```ts
export function Separator({
  orientation = 'horizontal',
  label,
  decorative = true,
  class: extraClass,
}: {
  orientation?: 'horizontal' | 'vertical';
  label?: string;
  decorative?: boolean;
  class?: string;
})
```

## sheet

Opaque slide-over Sheet & mobile bottom drawer built on native <dialog> with cross-browser backdrop dismiss and safe-area padding.

Install with `vp dlx @fierst/ui add sheet`. Direct registry dependencies: theme, icon. Direct npm dependencies: @lucide/icons.

Exports from `./ui/sheet`: `SheetSide`, `Sheet`.

Minimal TSX usage

```tsx
import { Sheet } from './ui/sheet';

<Sheet />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/sheet.tsx) · [ops.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/ops.tsx#L442)

API contracts

```ts
export type SheetSide = 'right' | 'left' | 'bottom';

export function Sheet({
  id,
  open,
  side = 'right',
  title,
  description,
  footer,
  onClose,
  class: extraClass,
  children,
}: {
  id?: string;
  open?: any;
  side?: SheetSide;
  title?: string;
  description?: string;
  footer?: View;
  onClose?: () => void;
  class?: string;
  children?: View;
})
```

## sidebar-nav

Collapsible grouped sidebar navigation sections with active indicators and badge slots.

Install with `vp dlx @fierst/ui add sidebar-nav`. Direct registry dependencies: theme, icon. Direct npm dependencies: @lucide/icons.

Exports from `./ui/sidebar-nav`: `SidebarNavGroup`, `SidebarNav`.

Minimal TSX usage

```tsx
import { SidebarNav } from './ui/sidebar-nav';

(
    <SidebarNav
      groups={[{ id: 'docs', label: 'Docs', items: [{ label: 'Guide', href: '/guide' }] }]}
    />
  )
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/sidebar-nav.tsx) · [overlays.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/overlays.tsx#L262)

API contracts

```ts
export interface SidebarNavGroup {
  id: string;
  label: string;
  defaultOpen?: boolean;
  items: readonly {
    label: string;
    href: string;
    icon?: LucideIconInput;
    badge?: View;
    active?: boolean;
  }[];
}

export function* SidebarNav(
  props: {
    groups: readonly SidebarNavGroup[];
    class?: string;
  },
  ctx: Ctx,
)
```

## slider

Accessible tactile range slider with dynamic filled track, live value badge, adaptive thumb geometry, and optional marks.

Install with `vp dlx @fierst/ui add slider`. Direct registry dependencies: theme. Direct npm dependencies: none.

Exports from `./ui/slider`: `Slider`.

Minimal TSX usage

```tsx
import { Slider } from './ui/slider';

<Slider />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/slider.tsx) · [forms.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/forms.tsx#L310)

API contracts

```ts
export function* Slider(
  props: {
    id?: string;
    label?: string;
    value?: number;
    defaultValue?: number;
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
    showMarks?: boolean;
    disabled?: boolean;
    onChange?: (value: number) => void;
    class?: string;
  },
  ctx: Ctx,
)
```

## sparkline

Compact inline SVG trend sparkline for table cells and compact KPI badges.

Install with `vp dlx @fierst/ui add sparkline`. Direct registry dependencies: theme. Direct npm dependencies: none.

Exports from `./ui/sparkline`: `Sparkline`.

Minimal TSX usage

```tsx
import { Sparkline } from './ui/sparkline';

<Sparkline values={[3, 5, 4, 8]} />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/sparkline.tsx) · [overview.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/overview.tsx#L222)

API contracts

```ts
export function Sparkline({
  values,
  width = 88,
  height = 24,
  tone = 'primary',
  class: extraClass,
}: {
  values: readonly number[];
  width?: number;
  height?: number;
  tone?: 'primary' | 'success' | 'warning' | 'danger';
  class?: string;
})
```

## spinner

Accessible SVG Spinner (xs/sm/md/lg) and container-scoped LoadingOverlay scrim.

Install with `vp dlx @fierst/ui add spinner`. Direct registry dependencies: theme, icon. Direct npm dependencies: @lucide/icons.

Exports from `./ui/spinner`: `Spinner`, `LoadingOverlay`.

Minimal TSX usage

```tsx
import { Spinner } from './ui/spinner';

<Spinner />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/spinner.tsx) · [overview.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/overview.tsx#L231)

API contracts

```ts
export function Spinner({
  size = 'md',
  label,
  class: extraClass,
}: {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  label?: string;
  class?: string;
})

export function LoadingOverlay({
  loading,
  label = 'Loading…',
  class: extraClass,
  children,
}: {
  loading: boolean;
  label?: string;
  class?: string;
  children?: View;
})
```

## stat-card

KPI metric card with tabular numerals, trend delta badge, optional inline SVG sparkline, and responsive StatGrid.

Install with `vp dlx @fierst/ui add stat-card`. Direct registry dependencies: theme, icon. Direct npm dependencies: @lucide/icons.

Exports from `./ui/stat-card`: `StatCard`, `StatGrid`.

Minimal TSX usage

```tsx
import { StatCard } from './ui/stat-card';

<StatCard label="Count" value={0} />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/stat-card.tsx) · [overview.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/overview.tsx#L124)

API contracts

```ts
export function StatCard({
  label,
  value,
  delta,
  trend = 'neutral',
  description,
  icon,
  sparkline,
  class: extraClass,
}: {
  label: string;
  value: string | number;
  delta?: string;
  trend?: 'up' | 'down' | 'neutral';
  description?: string;
  icon?: LucideIconInput;
  sparkline?: readonly number[];
  class?: string;
})

export function StatGrid(props: { class?: string; children?: View })
```

## status-dot

Pulsing live operational status dot and multi-day service uptime bar strip.

Install with `vp dlx @fierst/ui add status-dot`. Direct registry dependencies: theme. Direct npm dependencies: none.

Exports from `./ui/status-dot`: `StatusDot`, `UptimeBar`.

Minimal TSX usage

```tsx
import { StatusDot } from './ui/status-dot';

<StatusDot />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/status-dot.tsx) · [overview.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/overview.tsx#L65)

API contracts

```ts
export function StatusDot({
  status = 'operational',
  label,
  pulse = true,
  class: extraClass,
}: {
  status?: 'operational' | 'degraded' | 'outage' | 'idle';
  label?: string;
  pulse?: boolean;
  class?: string;
})

export function UptimeBar({
  name,
  uptimePct = '99.98%',
  days,
  class: extraClass,
}: {
  name: string;
  uptimePct?: string;
  days: readonly { label: string; status: 'operational' | 'degraded' | 'outage' | 'empty' }[];
  class?: string;
})
```

## stepper

Responsive multi-step progress indicator plus Aster-native yield* runWizard() generator flow.

Install with `vp dlx @fierst/ui add stepper`. Direct registry dependencies: theme, icon, button. Direct npm dependencies: @lucide/icons.

Exports from `./ui/stepper`: `StepItem`, `Stepper`, `WizardStepDef`, `runWizard`.

Minimal TSX usage

```tsx
import { Stepper } from './ui/stepper';

<Stepper steps={[{ id: 'review', title: 'Review' }]} currentStep={0} />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/stepper.tsx) · [forms.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/forms.tsx#L86)

API contracts

```ts
export interface StepItem {
  id: string;
  title: string;
  description?: string;
}

export function Stepper({
  steps,
  currentStep,
  onStepClick,
  class: extraClass,
}: {
  steps: readonly StepItem[];
  currentStep: number;
  onStepClick?: (index: number) => void;
  class?: string;
})

export interface WizardStepDef<TState> {
  id: string;
  title: string;
  description?: string;
  render: (state: TState, update: (patch: Partial<TState>) => void) => View;
  canProceed?: (state: TState) => boolean;
}

export function* runWizard<TState extends Record<string, any>>(
  steps: readonly WizardStepDef<TState>[],
  initial: TState,
  opts: { finishLabel?: string; cancelLabel?: string } = {},
): Generator<View, TState | null, any>
```

## sticky-bar

Bottom-pinned floating bar for unsaved-changes prompts or bulk-selection actions with safe-area padding.

Install with `vp dlx @fierst/ui add sticky-bar`. Direct registry dependencies: theme. Direct npm dependencies: none.

Exports from `./ui/sticky-bar`: `StickyActionBar`.

Minimal TSX usage

```tsx
import { StickyActionBar } from './ui/sticky-bar';

<StickyActionBar message="Saved" />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/sticky-bar.tsx) · [forms.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/forms.tsx#L456)

API contracts

```ts
export function StickyActionBar({
  open = true,
  message,
  actions,
  class: extraClass,
}: {
  open?: boolean;
  message: View;
  actions?: View;
  class?: string;
})
```

## streaming-text

Progressive live token stream renderer with blinking cursor caret.

Install with `vp dlx @fierst/ui add streaming-text`. Direct registry dependencies: theme. Direct npm dependencies: none.

Exports from `./ui/streaming-text`: `StreamingText`.

Minimal TSX usage

```tsx
import { StreamingText } from './ui/streaming-text';

<StreamingText text="Text" />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/streaming-text.tsx) · [ai.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/ai.tsx#L92)

API contracts

```ts
export function StreamingText({
  text,
  streaming = false,
  class: extraClass,
}: {
  text: string;
  streaming?: boolean;
  class?: string;
})
```

## suggestion-chips

Starter prompt and quick-reply pill chips for AI interfaces.

Install with `vp dlx @fierst/ui add suggestion-chips`. Direct registry dependencies: theme, icon. Direct npm dependencies: @lucide/icons.

Exports from `./ui/suggestion-chips`: `SuggestionChips`.

Minimal TSX usage

```tsx
import { SuggestionChips } from './ui/suggestion-chips';

(
    <SuggestionChips prompts={['Summarize this']} onSelect={(prompt) => console.log(prompt)} />
  )
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/suggestion-chips.tsx) · [ai.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/ai.tsx#L133)

API contracts

```ts
export function SuggestionChips({
  prompts,
  onSelect,
  class: extraClass,
}: {
  prompts: readonly string[];
  onSelect: (prompt: string) => void;
  class?: string;
})
```

## switch

Clean pill toggle switch with smooth spring thumb slide, role='switch', and controlled/uncontrolled support.

Install with `vp dlx @fierst/ui add switch`. Direct registry dependencies: theme. Direct npm dependencies: none.

Exports from `./ui/switch`: `Switch`.

Minimal TSX usage

```tsx
import { Switch } from './ui/switch';

<Switch label="Email updates" />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/switch.tsx) · [forms.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/forms.tsx#L222)

API contracts

```ts
export function* Switch(
  props: {
    checked?: boolean;
    defaultChecked?: boolean;
    label?: string;
    description?: string;
    disabled?: boolean;
    onChange?: (checked: boolean) => void;
    class?: string;
  },
  ctx: Ctx,
)
```

## table

Lightweight composable semantic Table primitives (TableHeader, TableBody, TableRow, TableHead, TableCell).

Install with `vp dlx @fierst/ui add table`. Direct registry dependencies: theme. Direct npm dependencies: none.

Exports from `./ui/table`: `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`, `TableCaption`.

Minimal TSX usage

```tsx
import { Table } from './ui/table';

<Table />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/table.tsx) · [ops.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/ops.tsx#L278)

API contracts

```ts
export function Table(props: { class?: string; children?: View })

export function TableHeader(props: { children?: View })

export function TableBody(props: { children?: View })

export function TableRow(props: { children?: View })

export function TableHead(props: { numeric?: boolean; children?: View })

export function TableCell(props: { numeric?: boolean; children?: View })

export function TableCaption(props: { children?: View })
```

## tabs

Accessible Tabs supporting both segmented pill and underline styles with ArrowLeft/ArrowRight/Home/End keyboard focus management.

Install with `vp dlx @fierst/ui add tabs`. Direct registry dependencies: theme. Direct npm dependencies: none.

Exports from `./ui/tabs`: `TabItem`, `Tabs`.

Minimal TSX usage

```tsx
import { Tabs } from './ui/tabs';

<Tabs items={[{ id: 'summary', label: 'Summary', content: 'Monthly totals' }]} />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/tabs.tsx) · [overlays.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/overlays.tsx#L254)

API contracts

```ts
export interface TabItem {
  id: string;
  label: string;
  content: View | (() => View);
}

export function* Tabs(
  props: {
    items: readonly TabItem[];
    variant?: 'segmented' | 'underline';
    value?: string;
    defaultValue?: string;
    label?: string;
    onChange?: (id: string) => void;
    class?: string;
  },
  ctx: Ctx,
)
```

## tag-input

Multi-chip tag entry field with Enter/comma creation, Backspace removal, and maxTags enforcement.

Install with `vp dlx @fierst/ui add tag-input`. Direct registry dependencies: theme, icon. Direct npm dependencies: @lucide/icons.

Exports from `./ui/tag-input`: `TagInput`.

Minimal TSX usage

```tsx
import { TagInput } from './ui/tag-input';

<TagInput />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/tag-input.tsx) · [forms.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/forms.tsx#L160)

API contracts

```ts
export function* TagInput(
  props: {
    label?: string;
    value?: readonly string[];
    defaultValue?: readonly string[];
    placeholder?: string;
    hint?: string;
    maxTags?: number;
    disabled?: boolean;
    onChange?: (tags: string[]) => void;
    class?: string;
  },
  ctx: Ctx,
)
```

## theme

Single-seed OKLCH token engine (zinc monochrome + 5 chromatic seeds), radius scale (none/sm/md/lg), cross-browser Light/Dark roles, and positionPopover() helper.

Install with `vp dlx @fierst/ui add theme`. Direct registry dependencies: none. Direct npm dependencies: none.

Exports from `./ui/theme`: `ThemeMode`, `ThemePreset`, `ThemeRadius`, `ThemeDensity`, `ThemeConfig`, `THEME_PRESETS`, `themeState`, `setTheme`, `initTheme`, `positionPopover`, `navigateMenu`.

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/theme.ts)

API contracts

```ts
export type ThemeMode = 'system' | 'light' | 'dark';

export type ThemePreset = 'zinc' | 'blue' | 'emerald' | 'violet' | 'rose' | 'amber';

export type ThemeRadius = 'none' | 'sm' | 'md' | 'lg';

export type ThemeDensity = 'compact' | 'comfortable';

export interface ThemeConfig {
  mode: ThemeMode;
  preset: ThemePreset;
  radius: ThemeRadius;
  density: ThemeDensity;
  customHue?: number;
}

export const THEME_PRESETS: readonly {
  id: ThemePreset;
  label: string;
  hue: number;
  swatch: string;
}[] = [
  { id: 'zinc', label: 'Zinc', hue: 285, swatch: '#18181b' },
  { id: 'blue', label: 'Blue', hue: 255, swatch: '#2563eb' },
  { id: 'emerald', label: 'Emerald', hue: 158, swatch: '#059669' },
  { id: 'violet', label: 'Violet', hue: 285, swatch: '#7c3aed' },
  { id: 'rose', label: 'Rose', hue: 16, swatch: '#e11d48' },
  { id: 'amber', label: 'Amber', hue: 55, swatch: '#d97706' },
];

export const themeState = signal<ThemeConfig>({
  mode: 'system',
  preset: 'blue',
  radius: 'md',
  density: 'comfortable',
});

export function setTheme(patch: Partial<ThemeConfig>, persist = true): void

export function initTheme(defaults: Partial<ThemeConfig> = {}): ThemeConfig

export function positionPopover(
  trigger: HTMLElement | null | undefined,
  pop: HTMLElement | null | undefined,
  opts: { align?: 'start' | 'end'; gap?: number; matchWidth?: boolean } = {},
): void

export function navigateMenu(event: KeyboardEvent): void
```

CSS tokens defined by the shared theme

- `--aster-seed-hue`
- `--aster-seed-chroma`
- `--aster-neutral-tint`
- `--aster-density`
- `--aster-font-sans`
- `--aster-font-display`
- `--aster-font-mono`
- `--aster-radius-xs`
- `--aster-radius-sm`
- `--aster-radius-md`
- `--aster-radius-lg`
- `--aster-radius-xl`
- `--aster-radius-control`
- `--aster-radius-badge`
- `--aster-radius-full`
- `--aster-ease-motion`
- `--aster-ease-spring`
- `--aster-ease-standard`
- `--aster-dur-fast`
- `--aster-dur-med`
- `--aster-dur-slow`
- `--aster-control-sm`
- `--aster-control-md`
- `--aster-control-lg`
- `--aster-safe-bottom`
- `--aster-safe-left`
- `--aster-safe-right`
- `--aster-primary`
- `--aster-primary-hover`
- `--aster-on-primary`
- `--aster-primary-subtle`
- `--aster-on-primary-subtle`
- `--aster-primary-border`
- `--aster-bg`
- `--aster-surface`
- `--aster-surface-muted`
- `--aster-surface-accent`
- `--aster-on-surface`
- `--aster-on-surface-muted`
- `--aster-on-surface-subtle`
- `--aster-border`
- `--aster-border-strong`
- `--aster-input-border`
- `--aster-inverted-bg`
- `--aster-inverted-fg`
- `--aster-success`
- `--aster-success-subtle`
- `--aster-on-success-subtle`
- `--aster-success-border`
- `--aster-warning`
- `--aster-warning-subtle`
- `--aster-on-warning-subtle`
- `--aster-warning-border`
- `--aster-danger`
- `--aster-danger-hover`
- `--aster-on-danger`
- `--aster-danger-subtle`
- `--aster-on-danger-subtle`
- `--aster-danger-border`
- `--aster-shadow-xs`
- `--aster-shadow-sm`
- `--aster-shadow-md`
- `--aster-shadow-lg`
- `--aster-focus-ring`
- `--aster-primary-container`
- `--aster-on-primary-container`
- `--aster-surface-low`
- `--aster-surface-high`
- `--aster-on-surface-variant`
- `--aster-outline`
- `--aster-outline-variant`

[Token values by mode, preset and media query](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/theme.css)

## time-picker

Accessible 12h/24h time selector with configurable minute step intervals.

Install with `vp dlx @fierst/ui add time-picker`. Direct registry dependencies: theme, icon. Direct npm dependencies: @lucide/icons.

Exports from `./ui/time-picker`: `TimePicker`.

Minimal TSX usage

```tsx
import { TimePicker } from './ui/time-picker';

<TimePicker />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/time-picker.tsx) · [forms.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/forms.tsx#L288)

API contracts

```ts
export function* TimePicker(
  props: {
    label?: string;
    value?: string;
    defaultValue?: string;
    stepMinutes?: number;
    use24h?: boolean;
    disabled?: boolean;
    onChange?: (hhmm: string) => void;
    class?: string;
  },
  ctx: Ctx,
)
```

## timeline

Chronological activity feed and audit trail with status markers, Lucide icons, and monospace timestamps.

Install with `vp dlx @fierst/ui add timeline`. Direct registry dependencies: theme, icon. Direct npm dependencies: @lucide/icons.

Exports from `./ui/timeline`: `TimelineItem`, `Timeline`.

Minimal TSX usage

```tsx
import { Timeline } from './ui/timeline';

<Timeline items={[{ id: 'done', title: 'Published', tone: 'success' }]} />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/timeline.tsx) · [ops.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/ops.tsx#L437)

API contracts

```ts
export interface TimelineItem {
  id: string;
  title: string;
  timestamp?: string;
  description?: View;
  icon?: LucideIconInput;
  tone?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger';
}

export function Timeline({
  items,
  class: extraClass,
}: {
  items: readonly TimelineItem[];
  class?: string;
})
```

## toast

signal()-driven crisp notification stack with mobile safe-area layout, auto-dismiss, and try/finally timer teardown.

Install with `vp dlx @fierst/ui add toast`. Direct registry dependencies: theme, icon. Direct npm dependencies: @lucide/icons.

Exports from `./ui/toast`: `ToastTone`, `ToastItem`, `dismissToast`, `showToast`, `toast`, `Toaster`.

Minimal TSX usage

```tsx
import { Toaster } from './ui/toast';

<Toaster />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/toast.tsx) · [showcase.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase.tsx#L647)

API contracts

```ts
export type ToastTone = 'neutral' | 'success' | 'warning' | 'danger';

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  tone: ToastTone;
}

export function dismissToast(id: string): void

export function showToast(
  title: string,
  opts: { description?: string; tone?: ToastTone; duration?: number } = {},
): string

export const toast = {
  show: (title: string, description?: string) => showToast(title, { description, tone: 'neutral' }),
  success: (title: string, description?: string) =>
    showToast(title, { description, tone: 'success' }),
  warning: (title: string, description?: string) =>
    showToast(title, { description, tone: 'warning' }),
  error: (title: string, description?: string) => showToast(title, { description, tone: 'danger' }),
  dismiss: dismissToast,
};

export function* Toaster()
```

## toggle

Toolbar pressed-state Toggle button and single/multiple selection ToggleGroup.

Install with `vp dlx @fierst/ui add toggle`. Direct registry dependencies: theme. Direct npm dependencies: none.

Exports from `./ui/toggle`: `Toggle`, `ToggleOption`, `ToggleGroup`.

Minimal TSX usage

```tsx
import { Toggle } from './ui/toggle';

<Toggle />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/toggle.tsx) · [forms.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/forms.tsx#L229)

API contracts

```ts
export function* Toggle(
  props: {
    pressed?: boolean;
    defaultPressed?: boolean;
    variant?: 'default' | 'outline';
    size?: 'sm' | 'md';
    disabled?: boolean;
    label?: string;
    onPressedChange?: (pressed: boolean) => void;
    class?: string;
    children?: View;
  },
  ctx: Ctx,
)

export interface ToggleOption {
  value: string;
  label: string;
  content: View;
  disabled?: boolean;
}

export function* ToggleGroup(
  props: {
    type?: 'single' | 'multiple';
    options: readonly ToggleOption[];
    value?: string | readonly string[];
    defaultValue?: string | readonly string[];
    size?: 'sm' | 'md';
    label?: string;
    onChange?: (value: any) => void;
    class?: string;
  },
  ctx: Ctx,
)
```

## token-usage

Context-window and input/cached/output token breakdown bar.

Install with `vp dlx @fierst/ui add token-usage`. Direct registry dependencies: theme. Direct npm dependencies: none.

Exports from `./ui/token-usage`: `TokenUsageBar`.

Minimal TSX usage

```tsx
import { TokenUsageBar } from './ui/token-usage';

<TokenUsageBar inputTokens={0} outputTokens={0} />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/token-usage.tsx) · [ai.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/ai.tsx#L73)

API contracts

```ts
export function TokenUsageBar({
  inputTokens,
  cachedTokens = 0,
  outputTokens,
  limit = 128000,
  class: extraClass,
}: {
  inputTokens: number;
  cachedTokens?: number;
  outputTokens: number;
  limit?: number;
  class?: string;
})
```

## tool-call-card

Expandable AI agent tool-invocation card displaying status badge, latency, arguments, and output.

Install with `vp dlx @fierst/ui add tool-call-card`. Direct registry dependencies: theme, icon, badge. Direct npm dependencies: @lucide/icons.

Exports from `./ui/tool-call-card`: `ToolCallCard`.

Minimal TSX usage

```tsx
import { ToolCallCard } from './ui/tool-call-card';

<ToolCallCard toolName="Search" />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/tool-call-card.tsx) · [ai.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/ai.tsx#L118)

API contracts

```ts
export function ToolCallCard({
  toolName,
  status = 'success',
  durationMs,
  args,
  result,
  defaultOpen = false,
  class: extraClass,
}: {
  toolName: string;
  status?: 'running' | 'waiting' | 'success' | 'error' | 'replayed';
  durationMs?: number;
  args?: unknown;
  result?: unknown;
  defaultOpen?: boolean;
  class?: string;
})
```

## tooltip

High-contrast inverted hover/focus Tooltip with configurable delay, alignment, Escape dismiss, and try/finally timer cleanup.

Install with `vp dlx @fierst/ui add tooltip`. Direct registry dependencies: theme. Direct npm dependencies: none.

Exports from `./ui/tooltip`: `Tooltip`.

Minimal TSX usage

```tsx
import { Tooltip } from './ui/tooltip';

<Tooltip content="Details" />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/tooltip.tsx) · [showcase.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase.tsx#L215) · [overlays.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/overlays.tsx#L139)

API contracts

```ts
export function* Tooltip(
  props: {
    content: string;
    side?: 'top' | 'bottom';
    align?: 'center' | 'start' | 'end';
    delay?: number;
    class?: string;
    children?: View;
  },
  ctx: Ctx,
)
```

## tour

Multi-step product onboarding card plus Aster-native yield* runTour() generator flow.

Install with `vp dlx @fierst/ui add tour`. Direct registry dependencies: theme, icon, button. Direct npm dependencies: @lucide/icons.

Exports from `./ui/tour`: `TourStep`, `TourCard`, `runTour`.

Minimal TSX usage

```tsx
import { TourCard } from './ui/tour';

(
    <TourCard step={{ id: 'intro', title: 'Welcome', description: 'Start' }} index={0} total={1} />
  )
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/tour.tsx) · [overlays.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/overlays.tsx#L299)

API contracts

```ts
export interface TourStep {
  id: string;
  title: string;
  description: string;
}

export function TourCard({
  step,
  index,
  total,
  onPrev,
  onNext,
  onClose,
  class: extraClass,
}: {
  step: TourStep;
  index: number;
  total: number;
  onPrev?: () => void;
  onNext?: () => void;
  onClose?: () => void;
  class?: string;
})

export function* runTour(steps: readonly TourStep[]): Generator<View, boolean, any>
```

## tree-view

Expandable hierarchical file/folder/org tree with Lucide folder and file indicators.

Install with `vp dlx @fierst/ui add tree-view`. Direct registry dependencies: theme, icon. Direct npm dependencies: @lucide/icons.

Exports from `./ui/tree-view`: `TreeNode`, `TreeView`.

Minimal TSX usage

```tsx
import { TreeView } from './ui/tree-view';

(
    <TreeView
      nodes={[{ id: 'docs', label: 'Docs', children: [{ id: 'guide', label: 'Guide' }] }]}
    />
  )
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/tree-view.tsx) · [ops.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/ops.tsx#L350)

API contracts

```ts
export interface TreeNode {
  id: string;
  label: string;
  children?: readonly TreeNode[];
}

export function* TreeView(
  props: {
    nodes: readonly TreeNode[];
    label?: string;
    defaultExpanded?: readonly string[];
    selectedId?: string;
    onSelect?: (node: TreeNode) => void;
    class?: string;
  },
  ctx: Ctx,
)
```

## visually-hidden

Accessible screen-reader-only text wrapper and keyboard SkipLink to main content.

Install with `vp dlx @fierst/ui add visually-hidden`. Direct registry dependencies: theme. Direct npm dependencies: none.

Exports from `./ui/visually-hidden`: `VisuallyHidden`, `SkipLink`.

Minimal TSX usage

```tsx
import { VisuallyHidden } from './ui/visually-hidden';

<VisuallyHidden />
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/visually-hidden.tsx) · [showcase.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase.tsx#L528) · [overlays.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/overlays.tsx#L295)

API contracts

```ts
export function VisuallyHidden(props: { children?: View })

export function SkipLink({
  href = '#main-content',
  label = 'Skip to main content',
}: {
  href?: string;
  label?: string;
})
```

## workflow-graph

Durable @fierst/flow execution step graph visualizing done, replayed, running, waiting, and failed nodes.

Install with `vp dlx @fierst/ui add workflow-graph`. Direct registry dependencies: theme, icon, badge. Direct npm dependencies: @lucide/icons.

Exports from `./ui/workflow-graph`: `WorkflowNode`, `WorkflowGraph`.

Minimal TSX usage

```tsx
import { WorkflowGraph } from './ui/workflow-graph';

(
    <WorkflowGraph nodes={[{ id: 'review', label: 'Human review', status: 'waiting' }]} />
  )
```

[Implementation](https://github.com/fierstdev/ui/blob/v1.0.2/src/ui/workflow-graph.tsx) · [ai.tsx example](https://github.com/fierstdev/ui/blob/v1.0.2/src/showcase/ai.tsx#L72)

API contracts

```ts
export interface WorkflowNode {
  id: string;
  label: string;
  detail?: string;
  status: 'pending' | 'running' | 'waiting' | 'done' | 'replayed' | 'failed';
}

export function WorkflowGraph({
  nodes,
  class: extraClass,
}: {
  nodes: readonly WorkflowNode[];
  class?: string;
})
```
