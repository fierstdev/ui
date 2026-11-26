import './ui/theme.css';
import {
  Activity,
  Bot,
  Layers,
  LayoutDashboard,
  LayoutGrid,
  Monitor,
  Moon,
  Search,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
  Sun,
  X,
} from '@lucide/icons';
import { render, scope, signal, type Ctx } from '@fierst/aster';
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
import { Avatar } from './ui/avatar.tsx';
import { AppShell, NavItem, Sidebar } from './ui/app-shell.tsx';
import { Tooltip } from './ui/tooltip.tsx';
import { CommandPalette, pickCommand, type CommandItem } from './ui/command.tsx';
import { confirmDialog } from './ui/dialog.tsx';
import { confirmDestructive } from './ui/alert-dialog.tsx';
import { pickDate } from './ui/calendar.tsx';
import { promptDrawer } from './ui/drawer.tsx';
import { runWizard } from './ui/stepper.tsx';
import { runTour } from './ui/tour.tsx';
import { requestApproval } from './ui/approval-card.tsx';
import { Input } from './ui/input.tsx';
import { SkipLink } from './ui/visually-hidden.tsx';
import { Toaster, toast } from './ui/toast.tsx';
import {
  activeFlow,
  commandOpen,
  deployRelease,
  deployments,
  navSection,
  releaseConfig,
  resolveMigration,
  updateRelease,
  type NavSection,
} from './showcase/store.ts';
import { OverviewWorkspace } from './showcase/overview.tsx';
import { OpsWorkspace } from './showcase/ops.tsx';
import { AiStudioWorkspace } from './showcase/ai.tsx';
import { FormsWorkspace } from './showcase/forms.tsx';
import { OverlaysWorkspace } from './showcase/overlays.tsx';
import { DirectoryWorkspace } from './showcase/directory.tsx';

initTheme();

const isEmbeddedMobile =
  typeof window !== 'undefined' &&
  new URLSearchParams(window.location.search).get('mobile') === '1';

if (typeof window !== 'undefined') {
  const initialSec = new URLSearchParams(window.location.search).get(
    'section',
  ) as NavSection | null;
  if (
    initialSec &&
    ['overview', 'ops', 'ai', 'forms', 'overlays', 'directory'].includes(initialSec)
  ) {
    navSection.set(initialSec);
  }
}

const mobilePreview = signal(false);

const topbarScope = scope`
  :scope {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    flex-wrap: wrap;
  }
  .swatches {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
  }
  .swatch {
    width: 20px;
    height: 20px;
    padding: 0;
    border-radius: 9999px;
    border: 2px solid transparent;
    cursor: pointer;
    flex-shrink: 0;
    transition: transform var(--aster-dur-fast) var(--aster-ease-motion);
  }
  .swatch:hover { transform: scale(1.12); }
  .swatch.is-selected {
    border-color: var(--aster-on-surface);
    transform: scale(1.12);
  }
  .chroma-wrap {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
  }
  .chroma-slider {
    -webkit-appearance: none;
    appearance: none;
    width: 96px;
    height: 10px;
    border-radius: 9999px;
    border: 1px solid var(--aster-border);
    cursor: pointer;
    background: linear-gradient(
      to right,
      oklch(0.65 0.22 0),
      oklch(0.65 0.22 60),
      oklch(0.65 0.22 120),
      oklch(0.65 0.22 180),
      oklch(0.65 0.22 240),
      oklch(0.65 0.22 300),
      oklch(0.65 0.22 360)
    );
  }
  .chroma-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 9999px;
    background: var(--aster-surface);
    border: 2px solid var(--aster-on-surface);
    box-shadow: var(--aster-shadow-xs);
  }
  .chroma-slider::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 9999px;
    background: var(--aster-surface);
    border: 2px solid var(--aster-on-surface);
    box-shadow: var(--aster-shadow-xs);
  }
`;

const pageScope = scope`
  :scope {
    max-width: 1180px;
    margin: 0 auto;
    display: grid;
    gap: 1.25rem;
  }
`;

const mobileFrameScope = scope`
  :scope {
    min-height: 100dvh;
    background: var(--aster-bg);
    color: var(--aster-on-surface);
    display: grid;
    grid-template-rows: auto 1fr;
    place-items: center;
    gap: 1rem;
    padding: 1rem;
    font-family: var(--aster-font-sans);
  }
  .mf-bar {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.45rem 0.75rem;
    border-radius: 9999px;
    border: 1px solid var(--aster-border);
    background: var(--aster-surface);
    box-shadow: var(--aster-shadow-sm);
    font-size: 0.82rem;
  }
  .mf-shell {
    width: 390px;
    height: min(844px, calc(100dvh - 5.5rem));
    border-radius: 36px;
    border: 8px solid var(--aster-border-strong);
    background: var(--aster-surface);
    box-shadow: var(--aster-shadow-lg, 0 24px 60px rgba(0, 0, 0, 0.35));
    overflow: hidden;
  }
  .mf-iframe {
    width: 100%;
    height: 100%;
    border: none;
    display: block;
    background: var(--aster-bg);
  }
`;

function* TopbarControls(props: { onOpenCommand: () => void }, ctx: Ctx) {
  for (props of ctx) {
    const cfg = themeState();
    const modes: { id: ThemeMode; icon: any; label: string }[] = [
      { id: 'light', icon: Sun, label: 'Light mode' },
      { id: 'dark', icon: Moon, label: 'Dark mode' },
      { id: 'system', icon: Monitor, label: 'System mode' },
    ];
    const radii: ThemeRadius[] = ['none', 'sm', 'md', 'lg'];
    const activeHue = cfg.customHue ?? 255;

    yield (
      <div class={topbarScope}>
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
              class:is-selected={cfg.customHue === undefined && cfg.preset === p.id}
              style={{ background: p.swatch }}
              onClick={() => setTheme({ preset: p.id, customHue: undefined })}
            />
          ))}
        </div>

        <Tooltip content={`OKLCH Hue: ${activeHue}°`} side="bottom">
          <div class="chroma-wrap">
            <input
              type="range"
              min="0"
              max="360"
              step="1"
              value={String(activeHue)}
              aria-label="OKLCH chroma hue"
              class="chroma-slider"
              onInput={(e: Event) => {
                const hue = Number((e.target as HTMLInputElement).value);
                setTheme({ customHue: hue });
              }}
            />
          </div>
        </Tooltip>

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

        {!isEmbeddedMobile ? (
          <Tooltip content="Mobile viewport preview (390×844)" side="bottom">
            <Button
              size="sm"
              variant={mobilePreview() ? 'primary' : 'outline'}
              aria-label="Toggle mobile preview"
              onClick={() => mobilePreview.update((v) => !v)}
            >
              <Icon icon={Smartphone} size={14} />
            </Button>
          </Tooltip>
        ) : null}
      </div>
    );
  }
}

function* FlowHost(_props: Record<string, any>, ctx: Ctx) {
  for (let _p of ctx) {
    const flow = activeFlow();

    if (flow === 'confirm') {
      const ok = yield* confirmDialog({
        title: 'Purge Global Edge Cache?',
        description: 'Ran via native `yield* confirmDialog()`.',
        confirmLabel: 'Purge Cache',
        danger: true,
      });
      activeFlow.set('idle');
      if (ok) toast.success('Edge cache purged');
      else toast.show('Purge cancelled');
    } else if (flow === 'destructive') {
      const ok = yield* confirmDestructive({
        title: 'Destroy Canary Cluster?',
        description: 'Type DESTROY to confirm tearing down ap-northeast (NRT).',
        confirmPhrase: 'DESTROY',
        confirmLabel: 'Destroy Cluster',
      });
      activeFlow.set('idle');
      if (ok) toast.warning('Canary cluster destroyed');
      else toast.show('Action cancelled');
    } else if (flow === 'pickCmd') {
      const chosen = yield* pickCommand(
        deployments().map((d) => ({
          id: d.id,
          group: 'Environments',
          label: d.env,
          hint: `${d.region} · ${d.latencyMs}ms`,
          shortcut: d.status,
        })),
        { placeholder: 'Jump to environment…' },
      );
      activeFlow.set('idle');
      if (chosen) toast.success(`Switched to ${chosen.label}`, chosen.hint);
    } else if (flow === 'pickDate') {
      const iso = yield* pickDate({
        title: 'Select Release Date',
        description: 'Use Month/Year dropdowns or type YYYY-MM-DD directly.',
        initial: releaseConfig().deployDate,
      });
      activeFlow.set('idle');
      if (iso) {
        updateRelease('deployDate', iso);
        toast.success('Release date updated', iso);
      }
    } else if (flow === 'drawer') {
      const action = yield* promptDrawer({
        title: 'Deployment Actions',
        description: 'Choose an edge operation for Production.',
        actions: [
          { id: 'redeploy', label: 'Trigger Instant Redeploy' },
          { id: 'rollback', label: 'Rollback to v1.0.0-alpha.1' },
          { id: 'drain', label: 'Drain NRT Traffic', danger: true },
        ],
      });
      activeFlow.set('idle');
      if (action === 'redeploy') deployRelease('Production');
      else if (action) toast.show('Drawer action selected', action);
    } else if (flow === 'wizard') {
      const result = yield* runWizard(
        [
          {
            id: 'name',
            title: 'Project Slug',
            render: (st, update) => (
              <Input
                label="Project Name"
                value={st.name}
                onInput={(e: Event) => update({ name: (e.target as HTMLInputElement).value })}
              />
            ),
            canProceed: (st) => st.name.trim().length > 0,
          },
          {
            id: 'env',
            title: 'Target Environment',
            render: (st, update) => (
              <Input
                label="Environment"
                value={st.env}
                onInput={(e: Event) => update({ env: (e.target as HTMLInputElement).value })}
              />
            ),
          },
        ],
        { name: releaseConfig().projectName, env: 'Production' },
        { finishLabel: 'Deploy' },
      );
      activeFlow.set('idle');
      if (result) {
        updateRelease('projectName', result.name);
        deployRelease(result.env);
      }
    } else if (flow === 'tour') {
      const finished = yield* runTour([
        {
          id: 't1',
          title: '104 Code-Owned Components',
          description:
            'Use the left sidebar to explore Telemetry, Ops, AI Studio, Forms, Overlays, and the full Directory.',
        },
        {
          id: 't2',
          title: 'Live Connected State',
          description:
            'Deployments, approvals, and theme seeds update every workspace in real time.',
        },
      ]);
      activeFlow.set('idle');
      if (finished) toast.success('Tour completed');
    } else if (flow === 'approval') {
      const approved = yield* requestApproval({
        title: 'Approve Production Index Migration',
        description: 'Paused inline via `yield* requestApproval()`.',
        assigneeRole: 'Staff DBA',
        artifactHash: 'sha256:9f4c2a8e1b7d',
        codePreview:
          'CREATE INDEX CONCURRENTLY idx_deployments_region_created ON deployments (region, created_at DESC);',
        danger: true,
      });
      activeFlow.set('idle');
      resolveMigration(approved);
    }

    if (activeFlow() === 'idle') {
      yield null;
    }
  }
}

export function* ShowcaseApp(_props: Record<string, any>, ctx: Ctx) {
  const commands: CommandItem[] = [
    {
      id: 'go-overview',
      group: 'Workspaces',
      label: 'Overview & Telemetry',
      onSelect: () => navSection.set('overview'),
    },
    {
      id: 'go-ops',
      group: 'Workspaces',
      label: 'Deployments & Ops',
      onSelect: () => navSection.set('ops'),
    },
    {
      id: 'go-ai',
      group: 'Workspaces',
      label: 'AI Agent Studio',
      onSelect: () => navSection.set('ai'),
    },
    {
      id: 'go-forms',
      group: 'Workspaces',
      label: 'Release & Billing Forms',
      onSelect: () => navSection.set('forms'),
    },
    {
      id: 'go-overlays',
      group: 'Workspaces',
      label: 'Navigation & Overlays',
      onSelect: () => navSection.set('overlays'),
    },
    {
      id: 'go-dir',
      group: 'Workspaces',
      label: 'All 104 Components Directory',
      onSelect: () => navSection.set('directory'),
    },
    {
      id: 'act-deploy',
      group: 'Actions',
      label: 'Deploy Production Now',
      onSelect: () => deployRelease('Production'),
    },
    {
      id: 'flow-date',
      group: 'yield* Flows',
      label: 'Pick Release Date…',
      onSelect: () => activeFlow.set('pickDate'),
    },
    {
      id: 'flow-wizard',
      group: 'yield* Flows',
      label: 'Launch Release Wizard…',
      onSelect: () => activeFlow.set('wizard'),
    },
    {
      id: 'flow-confirm',
      group: 'yield* Flows',
      label: 'Purge Global Edge Cache…',
      onSelect: () => activeFlow.set('confirm'),
    },
  ];

  for (let _p of ctx) {
    const section = navSection();
    const isMobileFrame = !isEmbeddedMobile && mobilePreview();

    if (isMobileFrame) {
      const base =
        typeof window !== 'undefined'
          ? `${window.location.origin}${window.location.pathname}`
          : '/';
      const iframeSrc = `${base}?mobile=1&section=${section}`;

      yield (
        <div class={mobileFrameScope}>
          <div class="mf-bar">
            <Icon icon={Smartphone} size={14} />
            <strong>Mobile Preview</strong>
            <span style="color:var(--aster-on-surface-muted)">390 × 844</span>
            <Button size="sm" variant="outline" onClick={() => mobilePreview.set(false)}>
              <Icon icon={X} size={13} />
              <span>Desktop View</span>
            </Button>
          </div>
          <div class="mf-shell">
            <iframe class="mf-iframe" src={iframeSrc} title="AsterUI Mobile Preview" />
          </div>
        </div>
      );
      continue;
    }

    yield (
      <>
        <SkipLink href="#main-content" />
        <AppShell
          brand={
            <span style="display:inline-flex; align-items:center; gap:0.45rem; font-weight:600; letter-spacing:-0.015em">
              <Icon icon={Sparkles} size={16} />
              <span>AsterUI</span>
              <Badge tone="neutral">104 Items</Badge>
            </span>
          }
          topbar={<TopbarControls onOpenCommand={() => commandOpen.set(true)} />}
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
                label="Overview & Telemetry"
                icon={LayoutDashboard}
                active={section === 'overview'}
                compact={collapsed}
                onClick={() => {
                  navSection.set('overview');
                  closeMobile();
                }}
              />
              <NavItem
                label="Deployments & Ops"
                icon={Activity}
                active={section === 'ops'}
                compact={collapsed}
                badge={<Badge tone="neutral">{deployments().length}</Badge>}
                onClick={() => {
                  navSection.set('ops');
                  closeMobile();
                }}
              />
              <NavItem
                label="AI Agent Studio"
                icon={Bot}
                active={section === 'ai'}
                compact={collapsed}
                badge={<Badge tone="primary">HITL</Badge>}
                onClick={() => {
                  navSection.set('ai');
                  closeMobile();
                }}
              />
              <NavItem
                label="Release & Billing"
                icon={SlidersHorizontal}
                active={section === 'forms'}
                compact={collapsed}
                onClick={() => {
                  navSection.set('forms');
                  closeMobile();
                }}
              />
              <NavItem
                label="Navigation & Overlays"
                icon={Layers}
                active={section === 'overlays'}
                compact={collapsed}
                onClick={() => {
                  navSection.set('overlays');
                  closeMobile();
                }}
              />
              <NavItem
                label="All 104 Directory"
                icon={LayoutGrid}
                active={section === 'directory'}
                compact={collapsed}
                badge={<Badge tone="neutral">104</Badge>}
                onClick={() => {
                  navSection.set('directory');
                  closeMobile();
                }}
              />
            </Sidebar>
          )}
        >
          <div id="main-content" class={pageScope}>
            <CommandPalette
              items={commands}
              open={commandOpen()}
              onOpenChange={(v) => commandOpen.set(v)}
            />
            <FlowHost />

            {section === 'overview' ? <OverviewWorkspace /> : null}
            {section === 'ops' ? <OpsWorkspace /> : null}
            {section === 'ai' ? <AiStudioWorkspace /> : null}
            {section === 'forms' ? <FormsWorkspace /> : null}
            {section === 'overlays' ? <OverlaysWorkspace /> : null}
            {section === 'directory' ? <DirectoryWorkspace /> : null}

            <Toaster />
          </div>
        </AppShell>
      </>
    );
  }
}

render(<ShowcaseApp />, document.getElementById('app')!);
