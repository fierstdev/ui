import './ui/theme.css';
import {
  Activity,
  Calendar as CalendarIcon,
  Command,
  LayoutDashboard,
  Monitor,
  Moon,
  PanelBottom,
  PanelRight,
  RefreshCw,
  Rocket,
  Search,
  Settings,
  SlidersHorizontal,
  Sparkles,
  Sun,
  Trash2,
  Users,
} from '@lucide/icons';
import { render, scope, type Ctx } from '@fierst/aster';
import {
  initTheme,
  setTheme,
  themeState,
  THEME_PRESETS,
  type ThemeMode,
  type ThemeRadius,
} from './ui/theme.ts';
import { Icon } from './ui/icon.tsx';
import { Button, ButtonGroup } from './ui/button.tsx';
import { Badge } from './ui/badge.tsx';
import { Card } from './ui/card.tsx';
import { Input, Textarea } from './ui/input.tsx';
import { Switch } from './ui/switch.tsx';
import { Checkbox, CheckboxGroup, RadioGroup } from './ui/checkbox.tsx';
import { Slider } from './ui/slider.tsx';
import { Avatar, AvatarGroup } from './ui/avatar.tsx';
import { Alert } from './ui/alert.tsx';
import { Breadcrumb } from './ui/breadcrumb.tsx';
import { Pagination } from './ui/pagination.tsx';
import { DatePicker, pickDate } from './ui/calendar.tsx';
import { AppShell, Sidebar, NavItem } from './ui/app-shell.tsx';
import { Tabs } from './ui/tabs.tsx';
import { Dialog, confirmDialog } from './ui/dialog.tsx';
import { Sheet, type SheetSide } from './ui/sheet.tsx';
import { CommandPalette, pickCommand, type CommandItem } from './ui/command.tsx';
import { Select } from './ui/select.tsx';
import { Accordion } from './ui/accordion.tsx';
import { Tooltip } from './ui/tooltip.tsx';
import { Progress, ProgressRing, Skeleton } from './ui/progress.tsx';
import { DropdownMenu } from './ui/popover.tsx';
import { Toaster, toast } from './ui/toast.tsx';
import { DataTable, type ColumnDef } from './ui/data-table.tsx';

initTheme();

const pageScope = scope`
  :scope {
    max-width: 1080px;
    margin: 0 auto;
    display: grid;
    gap: 1.25rem;
  }
  .swatches { display: inline-flex; align-items: center; gap: 0.35rem; }
  .swatch {
    width: 20px;
    height: 20px;
    border-radius: 9999px;
    border: 2px solid transparent;
    cursor: pointer;
    transition: transform var(--aster-dur-fast) var(--aster-ease-motion);
  }
  .swatch:hover { transform: scale(1.12); }
  .swatch.is-selected { border-color: var(--aster-on-surface); transform: scale(1.12); }
  .hero { display: grid; gap: 0.45rem; }
  .hero h1 {
    margin: 0;
    font-family: var(--aster-font-display);
    font-size: clamp(1.55rem, 4vw, 2.25rem);
    font-weight: 700;
    letter-spacing: -0.03em;
    line-height: 1.15;
  }
  .hero p { margin: 0; color: var(--aster-on-surface-muted); max-width: 66ch; font-size: 0.92rem; }
  .grid-2 { display: grid; grid-template-columns: 1fr; gap: 1.15rem; }
  @media (min-width: 860px) {
    .grid-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1.25rem; }
  }
  .row { display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap; }
  .stack { display: grid; gap: 0.85rem; }
`;

interface Deployment {
  id: string;
  env: string;
  region: string;
  latencyMs: number;
  status: 'healthy' | 'degraded' | 'building';
}

const DEPLOYMENTS: Deployment[] = [
  { id: 'd1', env: 'Production', region: 'us-west (PDX)', latencyMs: 14, status: 'healthy' },
  { id: 'd2', env: 'Staging', region: 'eu-central (FRA)', latencyMs: 28, status: 'healthy' },
  { id: 'd3', env: 'Canary', region: 'ap-northeast (NRT)', latencyMs: 92, status: 'degraded' },
  { id: 'd4', env: 'Preview #48', region: 'us-east (IAD)', latencyMs: 19, status: 'building' },
];

const COLUMNS: ColumnDef<Deployment>[] = [
  { key: 'env', header: 'Environment', sortable: true },
  { key: 'region', header: 'Edge Region', sortable: true },
  {
    key: 'latencyMs',
    header: 'p99 (ms)',
    sortable: true,
    render: (r) => <code>{r.latencyMs} ms</code>,
  },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    render: (r) => (
      <Badge
        dot
        tone={r.status === 'healthy' ? 'success' : r.status === 'degraded' ? 'warning' : 'primary'}
      >
        {r.status}
      </Badge>
    ),
  },
];

const REGIONS = [
  { value: 'pdx', label: 'us-west (PDX)', description: 'Portland / Vancouver edge cluster' },
  { value: 'iad', label: 'us-east (IAD)', description: 'Northern Virginia primary POP' },
  { value: 'fra', label: 'eu-central (FRA)', description: 'Frankfurt EU data residency' },
  { value: 'nrt', label: 'ap-northeast (NRT)', description: 'Tokyo low-latency edge' },
  {
    value: 'syd',
    label: 'ap-southeast (SYD)',
    description: 'Sydney (maintenance)',
    disabled: true,
  },
];

const TEAM = [
  { name: 'Ada Lovelace', status: 'online' as const },
  { name: 'Grace Hopper', status: 'online' as const },
  { name: 'Linus Torvalds', status: 'away' as const },
  { name: 'Margaret Hamilton', status: 'busy' as const },
  { name: 'Ken Thompson', status: 'offline' as const },
  { name: 'Barbara Liskov', status: 'online' as const },
];

async function* EdgeHealthProbe(props: { run: number }, ctx: Ctx) {
  yield (
    <div class="stack">
      <div class="row">
        <Skeleton width="38px" height="38px" shape="circle" />
        <div class="stack" style="flex:1; gap:0.4rem">
          <Skeleton width="55%" height="0.9rem" />
          <Skeleton width="80%" height="0.75rem" />
        </div>
      </div>
      <Progress label="Probing edge POPs…" />
    </div>
  );

  await new Promise((r) => setTimeout(r, 700));
  if (ctx.signal.aborted) return;

  yield (
    <div class="row" style="justify-content:space-between">
      <div class="stack" style="gap:0.15rem">
        <strong>All 310 Edge POPs Healthy</strong>
        <span style="font-size:0.82rem; color:var(--aster-on-surface-muted)">
          Probe #{props.run} resolved via <code>async function*</code>
        </span>
      </div>
      <Badge tone="success" dot>
        99.99% uptime
      </Badge>
    </div>
  );
}

function* TopbarControls(props: { onOpenCommand: () => void }, ctx: Ctx) {
  for (props of ctx) {
    const cfg = themeState();
    const modes: { id: ThemeMode; icon: any; label: string }[] = [
      { id: 'light', icon: Sun, label: 'Light mode' },
      { id: 'dark', icon: Moon, label: 'Dark mode' },
      { id: 'system', icon: Monitor, label: 'System mode' },
    ];
    const radii: ThemeRadius[] = ['none', 'sm', 'md', 'lg'];

    yield (
      <div class="row">
        <Tooltip content="Command Palette (⌘K)" side="bottom">
          <Button size="sm" variant="outline" onClick={props.onOpenCommand}>
            <Icon icon={Search} size={14} />
            <span>Search</span>
          </Button>
        </Tooltip>

        <div class="swatches" role="group" aria-label="Color seed">
          {THEME_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              title={p.label}
              aria-label={`${p.label} seed`}
              class="swatch"
              class:is-selected={cfg.preset === p.id}
              style={{ background: p.swatch }}
              onClick={() => setTheme({ preset: p.id, customHue: undefined })}
            />
          ))}
        </div>

        <ButtonGroup label="Radius preset">
          {radii.map((r) => (
            <Button
              key={r}
              size="sm"
              variant={cfg.radius === r ? 'secondary' : 'outline'}
              onClick={() => setTheme({ radius: r })}
            >
              {r}
            </Button>
          ))}
        </ButtonGroup>

        <ButtonGroup label="Color mode">
          {modes.map((m) => (
            <Button
              key={m.id}
              size="sm"
              aria-label={m.label}
              variant={cfg.mode === m.id ? 'primary' : 'outline'}
              onClick={() => setTheme({ mode: m.id })}
            >
              <Icon icon={m.icon} size={14} />
            </Button>
          ))}
        </ButtonGroup>
      </div>
    );
  }
}

export function* ShowcaseApp(_props: Record<string, any>, ctx: Ctx) {
  let navSection = 'overview';
  let projectName = 'aster-cloud';
  let region = 'pdx';
  let deployDate = '1995-07-14';
  let notes = '';
  let autoRevive = true;
  let features = ['ssr', 'revive'];
  let plan = 'pro';
  let rolloutPct = 72;
  let currentPage = 2;
  let accordionMode: 'single' | 'multiple' = 'single';
  let dialogOpen = false;
  let sheetOpen = false;
  let sheetSide: SheetSide = 'right';
  let commandOpen = false;
  let activeFlow: 'idle' | 'confirm' | 'pickCmd' | 'pickDate' = 'idle';
  let probeRun = 1;

  const commands: CommandItem[] = [
    {
      id: 'seed-zinc',
      group: 'Theme Seed',
      label: 'Zinc (Monochrome)',
      onSelect: () => setTheme({ preset: 'zinc', customHue: undefined }),
    },
    {
      id: 'seed-blue',
      group: 'Theme Seed',
      label: 'Blue',
      onSelect: () => setTheme({ preset: 'blue', customHue: undefined }),
    },
    {
      id: 'seed-emerald',
      group: 'Theme Seed',
      label: 'Emerald',
      onSelect: () => setTheme({ preset: 'emerald', customHue: undefined }),
    },
    {
      id: 'pick-date',
      group: 'Flows',
      label: 'Pick Date (with Year/Month Dropdowns)…',
      hint: 'Runs yield* pickDate()',
      onSelect: () => {
        activeFlow = 'pickDate';
      },
    },
    {
      id: 'purge-cache',
      group: 'Flows',
      label: 'Purge Global Edge Cache…',
      hint: 'Runs yield* confirmDialog()',
      onSelect: () => {
        activeFlow = 'confirm';
      },
    },
  ];

  for (let _p of ctx) {
    if ((activeFlow as string) === 'confirm') {
      const ok = yield* confirmDialog({
        title: 'Purge Global Edge Cache?',
        description: 'This confirmation ran via native `yield* confirmDialog()`.',
        confirmLabel: 'Purge Cache',
        danger: true,
      });
      activeFlow = 'idle';
      if (ok) toast.success('Edge cache purged');
      else toast.show('Purge cancelled');
    }

    if ((activeFlow as string) === 'pickCmd') {
      const chosen = yield* pickCommand(
        DEPLOYMENTS.map((d) => ({
          id: d.id,
          group: 'Environments',
          label: d.env,
          hint: `${d.region} · ${d.latencyMs}ms`,
          shortcut: d.status,
        })),
        { placeholder: 'Jump to environment…' },
      );
      activeFlow = 'idle';
      if (chosen) toast.success(`Switched to ${chosen.label}`, chosen.hint);
    }

    if ((activeFlow as string) === 'pickDate') {
      const iso = yield* pickDate({
        title: 'Select Date (e.g. Birth Date or Rollout)',
        description: 'Use the Month & Year dropdowns or type YYYY-MM-DD directly.',
        initial: deployDate,
      });
      activeFlow = 'idle';
      if (iso) {
        deployDate = iso;
        toast.success('Date selected', `Selected: ${iso}`);
      }
    }

    yield (
      <AppShell
        brand={
          <span class="row" style="font-weight:600; letter-spacing:-0.015em">
            <Icon icon={Sparkles} size={16} />
            <span>AsterUI</span>
            <Badge tone="neutral">26 Items</Badge>
          </span>
        }
        topbar={<TopbarControls onOpenCommand={() => (commandOpen = true)} />}
        sidebar={({ collapsed, closeMobile }) => (
          <Sidebar
            collapsed={collapsed}
            header={
              <>
                <Avatar name="Fierst Studio" size="sm" status="online" />
                <div class="sb-text" style="min-width:0; line-height:1.25">
                  <div style="font-size:0.875rem; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis">
                    Fierst Studio
                  </div>
                  <div style="font-size:0.75rem; color:var(--aster-on-surface-muted)">
                    ui.fierst.dev
                  </div>
                </div>
              </>
            }
            footer={
              <>
                <Avatar name="Ada Lovelace" size="sm" status="online" />
                <div class="sb-text" style="min-width:0; line-height:1.25">
                  <div style="font-size:0.8125rem; font-weight:500">Ada Lovelace</div>
                  <div style="font-size:0.72rem; color:var(--aster-on-surface-muted)">
                    @fierst/ui
                  </div>
                </div>
              </>
            }
          >
            <NavItem
              label="Overview"
              icon={LayoutDashboard}
              active={navSection === 'overview'}
              compact={collapsed}
              onClick={() => {
                navSection = 'overview';
                closeMobile();
              }}
            />
            <NavItem
              label="Form Controls"
              icon={SlidersHorizontal}
              active={navSection === 'forms'}
              compact={collapsed}
              onClick={() => {
                navSection = 'forms';
                closeMobile();
              }}
            />
            <NavItem
              label="Deployments"
              icon={Activity}
              active={navSection === 'deploys'}
              compact={collapsed}
              badge={<Badge tone="neutral">4</Badge>}
              onClick={() => {
                navSection = 'deploys';
                closeMobile();
              }}
            />
            <NavItem
              label="Team"
              icon={Users}
              active={navSection === 'team'}
              compact={collapsed}
              onClick={() => {
                navSection = 'team';
                closeMobile();
              }}
            />
            <NavItem
              label="Settings"
              icon={Settings}
              active={navSection === 'settings'}
              compact={collapsed}
              onClick={() => {
                navSection = 'settings';
                closeMobile();
              }}
            />
          </Sidebar>
        )}
      >
        <div class={pageScope}>
          <CommandPalette
            items={commands}
            open={commandOpen}
            onOpenChange={(v) => (commandOpen = v)}
          />

          <Breadcrumb
            items={[
              { label: 'Fierst', href: '#fierst' },
              { label: 'AsterUI', href: '#asterui' },
              { label: 'Component Library' },
            ]}
          />

          <section class="hero">
            <h1>Proven UI ergonomics, engineered for Aster.</h1>
            <p>
              26 code-owned, mobile-first components built on crisp opaque surfaces, 1px hairline
              borders, single-seed OKLCH theming, sensible micro-animations, and tree-shakeable{' '}
              <code>@lucide/icons</code>.
            </p>
          </section>

          <Alert
            tone="info"
            title="Consensus-Driven Component Design"
            description="Crisp neutral surfaces with Zinc monochrome or OKLCH chromatic seeds, Month/Year Calendar dropdowns, and single or multiple-expand Accordions."
            dismissible
          />

          <div class="grid-2">
            <Card
              title="Buttons, Overlays & yield* Flows"
              description="Six proven button variants, inverted tooltips, and native modal flows."
            >
              <div class="row">
                <Button
                  variant="primary"
                  onClick={() => toast.success('Deployed', `Target date: ${deployDate}`)}
                >
                  <Icon icon={Rocket} size={15} />
                  <span>Primary</span>
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    sheetSide = 'right';
                    sheetOpen = true;
                    ctx.refresh();
                  }}
                >
                  <Icon icon={PanelRight} size={15} />
                  <span>Sheet</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    sheetSide = 'bottom';
                    sheetOpen = true;
                    ctx.refresh();
                  }}
                >
                  <Icon icon={PanelBottom} size={15} />
                  <span>Drawer</span>
                </Button>
                <Button variant="outline" onClick={() => (activeFlow = 'pickDate')}>
                  <Icon icon={CalendarIcon} size={15} />
                  <span>yield* Date</span>
                </Button>
                <Button variant="outline" onClick={() => (activeFlow = 'pickCmd')}>
                  <Icon icon={Command} size={14} />
                  <span>yield* Pick</span>
                </Button>
                <Button variant="destructive" onClick={() => (activeFlow = 'confirm')}>
                  <Icon icon={Trash2} size={15} />
                  <span>Confirm</span>
                </Button>
                <DropdownMenu
                  label="More"
                  items={[
                    {
                      id: 'dlg',
                      label: 'Open Dialog',
                      onSelect: () => {
                        dialogOpen = true;
                        ctx.refresh();
                      },
                    },
                    {
                      id: 'cmd',
                      label: 'Command Palette',
                      shortcut: '⌘K',
                      onSelect: () => {
                        commandOpen = true;
                        ctx.refresh();
                      },
                    },
                    {
                      id: 'del',
                      label: 'Purge cache…',
                      danger: true,
                      separatorBefore: true,
                      onSelect: () => {
                        activeFlow = 'confirm';
                        ctx.refresh();
                      },
                    },
                  ]}
                />
              </div>

              <div class="row" style="justify-content:space-between; padding-top:0.35rem">
                <AvatarGroup items={TEAM} max={4} />
                <Badge tone="neutral">Selected: {deployDate}</Badge>
              </div>

              <Dialog
                open={[() => dialogOpen, (v: boolean) => (dialogOpen = v)]}
                title="AsterUI Dialog"
                description="Crisp opaque dialog with cross-browser backdrop dismiss."
                footer={
                  <Button variant="primary" onClick={() => (dialogOpen = false)}>
                    Done
                  </Button>
                }
              >
                <p style="margin:0; font-size:0.875rem; color:var(--aster-on-surface-muted)">
                  Click outside or press Escape across Chrome, Safari, Firefox, and Edge.
                </p>
              </Dialog>

              <Sheet
                open={[() => sheetOpen, (v: boolean) => (sheetOpen = v)]}
                side={sheetSide}
                title={(sheetSide as string) === 'bottom' ? 'Quick Drawer' : 'Inspector Sheet'}
                footer={
                  <Button variant="primary" onClick={() => (sheetOpen = false)}>
                    Apply
                  </Button>
                }
              >
                <Select
                  label="Region"
                  options={REGIONS}
                  value={region}
                  searchable
                  onChange={(v) => (region = v)}
                />
                <DatePicker
                  label="Date"
                  value={deployDate}
                  onChange={(iso) => (deployDate = iso)}
                />
              </Sheet>
            </Card>

            <Card
              title="Forms, DatePicker & Slider"
              description="Month/Year dropdowns + direct YYYY-MM-DD input for effortless date entry."
            >
              <div class="stack">
                <Input
                  label="Project Slug"
                  bind:value={projectName}
                  leading="aster.fierst.dev/"
                  error={!projectName.trim() ? 'Project slug is required.' : null}
                />
                <div class="grid-2" style="gap:0.75rem">
                  <Select
                    label="Edge Region"
                    options={REGIONS}
                    value={region}
                    searchable
                    onChange={(v) => (region = v)}
                  />
                  <DatePicker
                    label="Date (try 1995!)"
                    value={deployDate}
                    onChange={(iso) => (deployDate = iso)}
                  />
                </div>
                <Slider
                  label="Traffic Rollout"
                  value={rolloutPct}
                  min={0}
                  max={100}
                  unit="%"
                  showMarks
                  onChange={(v) => (rolloutPct = v)}
                />
                <Textarea
                  label="Release Notes"
                  bind:value={notes}
                  placeholder="Summarize this deployment…"
                />
                <Switch
                  checked={autoRevive}
                  label="Automatic Lazy Revival"
                  description="Zero upfront hydration until interaction."
                  onChange={(v) => (autoRevive = v)}
                />
              </div>
            </Card>
          </div>

          <div class="grid-2">
            <Card
              title="Checkboxes & Radio Cards"
              description="Indeterminate state, card selection, and full keyboard accessibility."
            >
              <div class="stack">
                <CheckboxGroup
                  legend="Enabled Capabilities"
                  value={features}
                  options={[
                    {
                      value: 'ssr',
                      label: 'Streaming SSR',
                      description: 'Out-of-order async function* flushes',
                    },
                    {
                      value: 'revive',
                      label: 'Lazy Revival',
                      description: '~0.6 KB delegated event loader',
                    },
                    {
                      value: 'wc',
                      label: 'Web Components',
                      description: 'Export Shadow DOM custom elements',
                    },
                  ]}
                  onChange={(next) => (features = next)}
                />
                <Checkbox
                  indeterminate={features.length > 0 && features.length < 3}
                  checked={features.length === 3}
                  label="Select all capabilities"
                  onChange={(all) => (features = all ? ['ssr', 'revive', 'wc'] : [])}
                />
                <RadioGroup
                  legend="Deployment Tier"
                  card
                  value={plan}
                  options={[
                    {
                      value: 'hobby',
                      label: 'Starter — Free',
                      description: '100k edge requests/day',
                    },
                    {
                      value: 'pro',
                      label: 'Studio Pro — $20/mo',
                      description: 'Unlimited edge isolates & custom domains',
                    },
                  ]}
                  onChange={(v) => (plan = v)}
                />
              </div>
            </Card>

            <Card
              title="Progress, Probe & Accordion"
              action={
                <div class="row">
                  <Button
                    size="sm"
                    variant={accordionMode === 'single' ? 'secondary' : 'outline'}
                    onClick={() => (accordionMode = 'single')}
                  >
                    Single
                  </Button>
                  <Button
                    size="sm"
                    variant={(accordionMode as string) === 'multiple' ? 'secondary' : 'outline'}
                    onClick={() => (accordionMode = 'multiple')}
                  >
                    Multiple
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => probeRun++}>
                    <Icon icon={RefreshCw} size={14} />
                  </Button>
                </div>
              }
            >
              <div class="stack">
                <div class="row" style="justify-content:space-between">
                  <div style="flex:1; min-width:160px">
                    <Progress label="Rollout Completion" value={rolloutPct} showValue />
                  </div>
                  <ProgressRing value={rolloutPct} />
                </div>
                <EdgeHealthProbe run={probeRun} />
                <Accordion
                  type={accordionMode}
                  items={[
                    {
                      id: 'a1',
                      title: 'Single vs. Multiple Accordion Mode',
                      defaultOpen: true,
                      content:
                        'Pass type="single" to auto-close inactive panels via native <details name>, or type="multiple" to expand all panels simultaneously.',
                    },
                    {
                      id: 'a2',
                      title: 'Fast Year & Month Jumping in Calendar',
                      content:
                        'Month and Year dropdowns (1900–2046) plus direct YYYY-MM-DD entry make picking birth dates like 1995-07-14 effortless.',
                    },
                    {
                      id: 'a3',
                      title: 'Single-Seed OKLCH Theming',
                      content:
                        'Switch between monochrome Zinc and chromatic seeds (Blue, Emerald, Violet, Rose, Amber) with zero runtime CSS-in-JS.',
                    },
                  ]}
                />
              </div>
            </Card>
          </div>

          <Card title="Tabs, Mobile-First DataTable & Pagination">
            <Tabs
              variant="underline"
              items={[
                {
                  id: 'deployments',
                  label: 'Edge Deployments',
                  content: () => (
                    <div class="stack">
                      <DataTable
                        rows={DEPLOYMENTS}
                        columns={COLUMNS}
                        rowKey={(r) => r.id}
                        searchable
                      />
                      <Pagination
                        page={currentPage}
                        totalPages={12}
                        onChange={(p) => (currentPage = p)}
                      />
                    </div>
                  ),
                },
                {
                  id: 'cli',
                  label: 'Install All 26 Items',
                  content: () => (
                    <pre style="margin:0; padding:1rem; border-radius:var(--aster-radius-md); background:var(--aster-surface-muted); border:1px solid var(--aster-border); overflow-x:auto; font-family:var(--aster-font-mono); font-size:0.82rem">
                      {`vp dlx @fierst/ui init
vp add @lucide/icons
vp dlx @fierst/ui add app-shell alert avatar badge breadcrumb button calendar card checkbox command data-table dialog input pagination popover progress select sheet slider switch tabs toast tooltip`}
                    </pre>
                  ),
                },
              ]}
            />
          </Card>

          <Toaster />
        </div>
      </AppShell>
    );
  }
}

render(<ShowcaseApp />, document.getElementById('app')!);
