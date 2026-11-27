import { describe, expect, it } from 'vite-plus/test';
import { renderToString } from '@fierst/aster/ssr';
import { Check } from '@lucide/icons';
import { initTheme } from '../src/ui/theme.ts';
import registry from '../registry.json';
import { Accordion } from '../src/ui/accordion.tsx';
import { AlertDialog } from '../src/ui/alert-dialog.tsx';
import { Alert } from '../src/ui/alert.tsx';
import { AppShell } from '../src/ui/app-shell.tsx';
import { ApprovalCard } from '../src/ui/approval-card.tsx';
import { AspectRatio } from '../src/ui/aspect-ratio.tsx';
import { Avatar } from '../src/ui/avatar.tsx';
import { BackToTop } from '../src/ui/back-to-top.tsx';
import { Badge } from '../src/ui/badge.tsx';
import { ConsentBanner } from '../src/ui/banner-cookie.tsx';
import { BarChart } from '../src/ui/bar-chart.tsx';
import { Breadcrumb } from '../src/ui/breadcrumb.tsx';
import { Button } from '../src/ui/button.tsx';
import { CalendarHeatmap } from '../src/ui/calendar-heatmap.tsx';
import { Calendar } from '../src/ui/calendar.tsx';
import { Card } from '../src/ui/card.tsx';
import { Carousel } from '../src/ui/carousel.tsx';
import { ChatMessage } from '../src/ui/chat-message.tsx';
import { Checkbox } from '../src/ui/checkbox.tsx';
import { CitationBadge } from '../src/ui/citation-badge.tsx';
import { Collapsible } from '../src/ui/collapsible.tsx';
import { ColorPicker } from '../src/ui/color-picker.tsx';
import { Combobox } from '../src/ui/combobox.tsx';
import { FilterBar } from '../src/ui/command-bar.tsx';
import { CommandPalette } from '../src/ui/command.tsx';
import { Container } from '../src/ui/container.tsx';
import { ContextMenu } from '../src/ui/context-menu.tsx';
import { CopyButton } from '../src/ui/copy-button.tsx';
import { CurrencyInput } from '../src/ui/currency-input.tsx';
import { DataTable } from '../src/ui/data-table.tsx';
import { DateRangePicker } from '../src/ui/date-range-picker.tsx';
import { DescriptionList } from '../src/ui/description-list.tsx';
import { Dialog } from '../src/ui/dialog.tsx';
import { DiffViewer } from '../src/ui/diff-viewer.tsx';
import { DonutChart } from '../src/ui/donut-chart.tsx';
import { Drawer } from '../src/ui/drawer.tsx';
import { EmptyState } from '../src/ui/empty-state.tsx';
import { FileUpload } from '../src/ui/file-upload.tsx';
import { Footer } from '../src/ui/footer.tsx';
import { Form } from '../src/ui/form.tsx';
import { Grid } from '../src/ui/grid.tsx';
import { HoverCard } from '../src/ui/hover-card.tsx';
import { Icon } from '../src/ui/icon.tsx';
import { InlineEdit } from '../src/ui/inline-edit.tsx';
import { InputOTP } from '../src/ui/input-otp.tsx';
import { Input } from '../src/ui/input.tsx';
import { JsonViewer } from '../src/ui/json-viewer.tsx';
import { KanbanBoard } from '../src/ui/kanban.tsx';
import { Kbd } from '../src/ui/kbd.tsx';
import { Label } from '../src/ui/label.tsx';
import { LineChart } from '../src/ui/line-chart.tsx';
import { MentionInput } from '../src/ui/mention-input.tsx';
import { Menubar } from '../src/ui/menubar.tsx';
import { Meter } from '../src/ui/meter.tsx';
import { MetricList } from '../src/ui/metric-list.tsx';
import { MultiSelect } from '../src/ui/multi-select.tsx';
import { Navbar } from '../src/ui/navbar.tsx';
import { NavigationMenu } from '../src/ui/navigation-menu.tsx';
import { NumberInput } from '../src/ui/number-input.tsx';
import { PageHeader } from '../src/ui/page-header.tsx';
import { Pagination } from '../src/ui/pagination.tsx';
import { PasswordInput } from '../src/ui/password-input.tsx';
import { PhoneInput } from '../src/ui/phone-input.tsx';
import { Popover } from '../src/ui/popover.tsx';
import { Progress } from '../src/ui/progress.tsx';
import { PromptInput } from '../src/ui/prompt-input.tsx';
import { Prose } from '../src/ui/prose.tsx';
import { RangeSlider } from '../src/ui/range-slider.tsx';
import { Rating } from '../src/ui/rating.tsx';
import { ReasoningBlock } from '../src/ui/reasoning-block.tsx';
import { ResizableSplit } from '../src/ui/resizable.tsx';
import { ScrollArea } from '../src/ui/scroll-area.tsx';
import { SearchInput } from '../src/ui/search-input.tsx';
import { SectionHeader } from '../src/ui/section-header.tsx';
import { SegmentedControl } from '../src/ui/segmented-control.tsx';
import { Select } from '../src/ui/select.tsx';
import { Separator } from '../src/ui/separator.tsx';
import { Sheet } from '../src/ui/sheet.tsx';
import { SidebarNav } from '../src/ui/sidebar-nav.tsx';
import { Slider } from '../src/ui/slider.tsx';
import { Sparkline } from '../src/ui/sparkline.tsx';
import { Spinner } from '../src/ui/spinner.tsx';
import { StatCard } from '../src/ui/stat-card.tsx';
import { StatusDot } from '../src/ui/status-dot.tsx';
import { Stepper } from '../src/ui/stepper.tsx';
import { StickyActionBar } from '../src/ui/sticky-bar.tsx';
import { StreamingText } from '../src/ui/streaming-text.tsx';
import { SuggestionChips } from '../src/ui/suggestion-chips.tsx';
import { Switch } from '../src/ui/switch.tsx';
import { Table } from '../src/ui/table.tsx';
import { Tabs } from '../src/ui/tabs.tsx';
import { TagInput } from '../src/ui/tag-input.tsx';
import { TimePicker } from '../src/ui/time-picker.tsx';
import { Timeline } from '../src/ui/timeline.tsx';
import { Toaster } from '../src/ui/toast.tsx';
import { Toggle } from '../src/ui/toggle.tsx';
import { TokenUsageBar } from '../src/ui/token-usage.tsx';
import { ToolCallCard } from '../src/ui/tool-call-card.tsx';
import { Tooltip } from '../src/ui/tooltip.tsx';
import { TourCard } from '../src/ui/tour.tsx';
import { TreeView } from '../src/ui/tree-view.tsx';
import { VisuallyHidden } from '../src/ui/visually-hidden.tsx';
import { WorkflowGraph } from '../src/ui/workflow-graph.tsx';

const fixtures = {
  accordion: () => <Accordion items={[]} />,
  'alert-dialog': () => <AlertDialog title="Delete?" description="Confirm" onConfirm={() => {}} />,
  alert: () => <Alert />,
  'app-shell': () => <AppShell sidebar="Navigation" />,
  'approval-card': () => <ApprovalCard title="Approve?" onApprove={() => {}} onReject={() => {}} />,
  'aspect-ratio': () => <AspectRatio />,
  avatar: () => <Avatar name="Ada" />,
  'back-to-top': () => <BackToTop />,
  badge: () => <Badge />,
  'banner-cookie': () => <ConsentBanner />,
  'bar-chart': () => <BarChart data={[]} />,
  breadcrumb: () => <Breadcrumb items={[]} />,
  button: () => <Button />,
  'calendar-heatmap': () => <CalendarHeatmap values={[]} />,
  calendar: () => <Calendar />,
  card: () => <Card />,
  carousel: () => <Carousel slides={[]} />,
  'chat-message': () => <ChatMessage />,
  checkbox: () => <Checkbox />,
  'citation-badge': () => <CitationBadge index={1} />,
  collapsible: () => <Collapsible />,
  'color-picker': () => <ColorPicker />,
  combobox: () => <Combobox options={[]} />,
  'command-bar': () => <FilterBar />,
  command: () => <CommandPalette items={[]} />,
  container: () => <Container />,
  'context-menu': () => <ContextMenu items={[]} />,
  'copy-button': () => <CopyButton text="Copy" />,
  'currency-input': () => <CurrencyInput />,
  'data-table': () => <DataTable columns={[]} rows={[]} rowKey={() => 'id'} />,
  'date-range-picker': () => <DateRangePicker />,
  'description-list': () => <DescriptionList items={[]} />,
  dialog: () => <Dialog />,
  'diff-viewer': () => <DiffViewer lines={[]} />,
  'donut-chart': () => <DonutChart data={[]} />,
  drawer: () => <Drawer />,
  'empty-state': () => <EmptyState title="Empty" />,
  'file-upload': () => <FileUpload />,
  footer: () => <Footer brand="Example" columns={[]} />,
  form: () => <Form />,
  grid: () => <Grid />,
  'hover-card': () => <HoverCard trigger="Details" />,
  icon: () => <Icon icon={Check} />,
  'inline-edit': () => <InlineEdit />,
  'input-otp': () => <InputOTP />,
  input: () => <Input />,
  'json-viewer': () => <JsonViewer data={null} />,
  kanban: () => <KanbanBoard columns={[]} cards={[]} />,
  kbd: () => <Kbd />,
  label: () => <Label />,
  'line-chart': () => <LineChart data={[]} />,
  'mention-input': () => <MentionInput candidates={[]} />,
  menubar: () => <Menubar menus={[]} />,
  meter: () => <Meter label="Quota" value={1} />,
  'metric-list': () => <MetricList items={[]} />,
  'multi-select': () => <MultiSelect options={[]} />,
  navbar: () => <Navbar brand="Brand" links={[]} />,
  'navigation-menu': () => <NavigationMenu sections={[]} />,
  'number-input': () => <NumberInput />,
  'page-header': () => <PageHeader title="Title" />,
  pagination: () => <Pagination totalPages={0} />,
  'password-input': () => <PasswordInput />,
  'phone-input': () => <PhoneInput />,
  popover: () => <Popover id="test-popover" />,
  progress: () => <Progress />,
  'prompt-input': () => <PromptInput />,
  prose: () => <Prose />,
  'range-slider': () => <RangeSlider />,
  rating: () => <Rating />,
  'reasoning-block': () => <ReasoningBlock />,
  resizable: () => <ResizableSplit first="Left" second="Right" />,
  'scroll-area': () => <ScrollArea />,
  'search-input': () => <SearchInput />,
  'section-header': () => <SectionHeader title="Title" />,
  'segmented-control': () => <SegmentedControl options={[]} />,
  select: () => <Select options={[]} />,
  separator: () => <Separator />,
  sheet: () => <Sheet />,
  'sidebar-nav': () => <SidebarNav groups={[]} />,
  slider: () => <Slider />,
  sparkline: () => <Sparkline values={[]} />,
  spinner: () => <Spinner />,
  'stat-card': () => <StatCard label="Count" value={0} />,
  'status-dot': () => <StatusDot />,
  stepper: () => <Stepper steps={[]} currentStep={0} />,
  'sticky-bar': () => <StickyActionBar message="Saved" />,
  'streaming-text': () => <StreamingText text="Text" />,
  'suggestion-chips': () => <SuggestionChips prompts={[]} onSelect={() => {}} />,
  switch: () => <Switch />,
  table: () => <Table />,
  tabs: () => <Tabs items={[]} />,
  'tag-input': () => <TagInput />,
  'time-picker': () => <TimePicker />,
  timeline: () => <Timeline items={[]} />,
  toast: () => <Toaster />,
  toggle: () => <Toggle />,
  'token-usage': () => <TokenUsageBar inputTokens={0} outputTokens={0} />,
  'tool-call-card': () => <ToolCallCard toolName="Search" />,
  tooltip: () => <Tooltip content="Details" />,
  tour: () => (
    <TourCard step={{ id: 'intro', title: 'Welcome', description: 'Start' }} index={0} total={1} />
  ),
  'tree-view': () => <TreeView nodes={[]} />,
  'visually-hidden': () => <VisuallyHidden />,
  'workflow-graph': () => <WorkflowGraph nodes={[]} />,
};

describe('registry components on the server', () => {
  it('covers the published inventory', () => {
    expect([...Object.keys(fixtures), 'theme'].sort()).toEqual(
      registry.items.map((i) => i.name).sort(),
    );
    expect(initTheme().mode).toBe('system');
  });
  for (const [name, fixture] of Object.entries(fixtures)) {
    it(name, () => {
      const html = renderToString(fixture(), { revive: false });
      expect(html).not.toMatch(/NaN|\[object Object\]|Infinity/);
    });
  }
});

it('keeps displayed totals and accessible bounds consistent at numeric limits', () => {
  const empty = renderToString(<DonutChart data={[]} />);
  expect(empty).toMatch(/class="dc-total"[^>]*>0/);
  const meter = renderToString(<Meter label="Quota" value={2} max={0.5} />);
  expect(meter).toContain('aria-valuenow="0.5"');
  expect(meter).toContain('100%');
  const progress = renderToString(<Progress value={-3} max={0} />);
  expect(progress).toContain('aria-valuenow="0"');
  expect(progress).toContain('aria-valuemax="100"');
});

it('renders each Lucide path once and splits a controlled international phone number', () => {
  const svg = renderToString(<Icon icon={Check} />);
  expect(svg.match(/<path\b/g)).toHaveLength(Check.node.length);
  const phone = renderToString(<PhoneInput value="+4412345" />);
  expect(phone).toContain('value="12345"');
});
