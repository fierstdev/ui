import { ArrowRight } from '@lucide/icons';
import { type Ctx } from '@fierst/aster';
import { PageHeader } from '../ui/page-header.tsx';
import { SearchInput } from '../ui/search-input.tsx';
import { SegmentedControl } from '../ui/segmented-control.tsx';
import { Grid } from '../ui/grid.tsx';
import { Card } from '../ui/card.tsx';
import { Badge } from '../ui/badge.tsx';
import { CopyButton } from '../ui/copy-button.tsx';
import { Button } from '../ui/button.tsx';
import { Icon } from '../ui/icon.tsx';
import { navSection, type NavSection } from './store.ts';

interface CatalogEntry {
  slug: string;
  category: 'Overview' | 'Ops' | 'AI' | 'Forms' | 'Overlays';
  workspace: NavSection;
}

const CATALOG: CatalogEntry[] = [
  // Overview & Telemetry (20)
  ...[
    'theme',
    'icon',
    'page-header',
    'breadcrumb',
    'alert',
    'stat-card',
    'sparkline',
    'line-chart',
    'bar-chart',
    'donut-chart',
    'calendar-heatmap',
    'metric-list',
    'status-dot',
    'progress',
    'meter',
    'spinner',
    'carousel',
    'banner-cookie',
    'back-to-top',
    'footer',
  ].map((slug) => ({ slug, category: 'Overview' as const, workspace: 'overview' as const })),
  // Deployments & Ops (19)
  ...[
    'command-bar',
    'search-input',
    'segmented-control',
    'data-table',
    'table',
    'pagination',
    'kanban',
    'tree-view',
    'resizable',
    'scroll-area',
    'timeline',
    'description-list',
    'badge',
    'avatar',
    'hover-card',
    'context-menu',
    'empty-state',
    'copy-button',
    'kbd',
  ].map((slug) => ({ slug, category: 'Ops' as const, workspace: 'ops' as const })),
  // AI & Agentic (16)
  ...[
    'chat-message',
    'prompt-input',
    'mention-input',
    'suggestion-chips',
    'streaming-text',
    'reasoning-block',
    'tool-call-card',
    'citation-badge',
    'approval-card',
    'diff-viewer',
    'json-viewer',
    'token-usage',
    'workflow-graph',
    'prose',
    'collapsible',
    'accordion',
  ].map((slug) => ({ slug, category: 'AI' as const, workspace: 'ai' as const })),
  // Forms & Inputs (26)
  ...[
    'stepper',
    'form',
    'label',
    'input',
    'select',
    'multi-select',
    'combobox',
    'checkbox',
    'switch',
    'toggle',
    'slider',
    'range-slider',
    'number-input',
    'currency-input',
    'password-input',
    'phone-input',
    'input-otp',
    'color-picker',
    'calendar',
    'date-range-picker',
    'time-picker',
    'file-upload',
    'tag-input',
    'inline-edit',
    'rating',
    'sticky-bar',
  ].map((slug) => ({ slug, category: 'Forms' as const, workspace: 'forms' as const })),
  // Navigation, Layout & Overlays (23)
  ...[
    'app-shell',
    'navbar',
    'menubar',
    'navigation-menu',
    'sidebar-nav',
    'tabs',
    'dialog',
    'alert-dialog',
    'sheet',
    'drawer',
    'command',
    'popover',
    'tooltip',
    'toast',
    'tour',
    'button',
    'container',
    'grid',
    'card',
    'section-header',
    'separator',
    'aspect-ratio',
    'visually-hidden',
  ].map((slug) => ({ slug, category: 'Overlays' as const, workspace: 'overlays' as const })),
];

export function* DirectoryWorkspace(_props: Record<string, any>, ctx: Ctx) {
  let query = '';
  let cat = 'All';

  for (let _p of ctx) {
    const items = CATALOG.filter((item) => {
      const matchCat = cat === 'All' || item.category === cat;
      const matchQ = !query.trim() || item.slug.includes(query.trim().toLowerCase());
      return matchCat && matchQ;
    });

    yield (
      <div style="display:grid; gap:1.25rem">
        <PageHeader
          eyebrow="Registry Catalog"
          title={`All ${CATALOG.length} AsterUI Modules`}
          description="Search every code-owned component, copy its install command, or jump straight to its live interactive workspace."
        />

        <div style="display:flex; gap:0.75rem; align-items:center; justify-content:space-between; flex-wrap:wrap">
          <div style="flex:1; min-width:220px; max-width:360px">
            <SearchInput
              value={query}
              placeholder="Filter 104 modules (e.g. kanban, otp, chart)…"
              onChange={(v) => {
                query = v;
                ctx.refresh();
              }}
            />
          </div>
          <SegmentedControl
            label="Filter by category"
            value={cat}
            options={[
              { value: 'All', label: `All (${CATALOG.length})` },
              { value: 'Overview', label: 'Overview' },
              { value: 'Ops', label: 'Ops' },
              { value: 'AI', label: 'AI' },
              { value: 'Forms', label: 'Forms' },
              { value: 'Overlays', label: 'Overlays' },
            ]}
            onChange={(v) => {
              cat = v;
              ctx.refresh();
            }}
          />
        </div>

        <Grid cols={3}>
          {items.map((item) => (
            <Card key={item.slug} variant="default">
              <div style="display:grid; gap:0.65rem">
                <div style="display:flex; justify-content:space-between; align-items:center; gap:0.5rem">
                  <code style="font-weight:600; font-size:0.86rem">{item.slug}</code>
                  <Badge tone="neutral">{item.category}</Badge>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; gap:0.5rem">
                  <CopyButton text={`vp dlx @fierst/ui add ${item.slug}`} label="Copy CLI" />
                  <Button size="sm" variant="ghost" onClick={() => navSection.set(item.workspace)}>
                    <span>Open</span>
                    <Icon icon={ArrowRight} size={13} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </Grid>
      </div>
    );
  }
}
