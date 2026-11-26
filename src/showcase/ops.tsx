import { FolderTree, Inbox, PanelBottom, PanelRight, Rocket } from '@lucide/icons';
import { type Ctx } from '@fierst/aster';
import { PageHeader } from '../ui/page-header.tsx';
import { FilterBar } from '../ui/command-bar.tsx';
import { SearchInput } from '../ui/search-input.tsx';
import { SegmentedControl } from '../ui/segmented-control.tsx';
import { DataTable, type ColumnDef } from '../ui/data-table.tsx';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table.tsx';
import { Pagination } from '../ui/pagination.tsx';
import { KanbanBoard } from '../ui/kanban.tsx';
import { TreeView, type TreeNode } from '../ui/tree-view.tsx';
import { ResizableSplit } from '../ui/resizable.tsx';
import { ScrollArea } from '../ui/scroll-area.tsx';
import { Timeline } from '../ui/timeline.tsx';
import { DescriptionList } from '../ui/description-list.tsx';
import { Badge } from '../ui/badge.tsx';
import { Avatar, AvatarGroup } from '../ui/avatar.tsx';
import { HoverCard } from '../ui/hover-card.tsx';
import { ContextMenu } from '../ui/context-menu.tsx';
import { EmptyState } from '../ui/empty-state.tsx';
import { Sheet } from '../ui/sheet.tsx';
import { Drawer } from '../ui/drawer.tsx';
import { CodeBlock, CopyButton } from '../ui/copy-button.tsx';
import { Kbd, KbdGroup } from '../ui/kbd.tsx';
import { Card } from '../ui/card.tsx';
import { Button } from '../ui/button.tsx';
import { Icon } from '../ui/icon.tsx';
import { toast } from '../ui/toast.tsx';
import {
  deployRelease,
  deployments,
  kanbanCards,
  timelineItems,
  type Deployment,
} from './store.ts';

const REPO_TREE: TreeNode[] = [
  {
    id: 'src',
    label: 'src/',
    children: [
      { id: 'showcase', label: 'showcase.tsx' },
      {
        id: 'ui',
        label: 'ui/ (103 modules)',
        children: [
          { id: 'dialog', label: 'dialog.tsx' },
          { id: 'data-table', label: 'data-table.tsx' },
          { id: 'workflow-graph', label: 'workflow-graph.tsx' },
        ],
      },
    ],
  },
  {
    id: 'public',
    label: 'public/r/',
    children: [
      { id: 'index-json', label: 'index.json' },
      { id: 'schema', label: '104 component manifests' },
    ],
  },
];

const TEAM = [
  { name: 'Ada Lovelace', status: 'online' as const },
  { name: 'Grace Hopper', status: 'online' as const },
  { name: 'Linus Torvalds', status: 'away' as const },
  { name: 'Margaret Hamilton', status: 'busy' as const },
  { name: 'Ken Thompson', status: 'offline' as const },
];

const COLUMNS: ColumnDef<Deployment>[] = [
  { key: 'env', header: 'Environment', sortable: true },
  { key: 'region', header: 'Edge Region', sortable: true },
  { key: 'version', header: 'Release', sortable: true, render: (r) => <code>{r.version}</code> },
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

export function* OpsWorkspace(_props: Record<string, any>, ctx: Ctx) {
  let query = '';
  let statusFilters: string[] = [];
  let viewMode = 'table';
  let page = 1;
  let selectedFile = 'dialog';
  let inspectorOpen = false;
  let quickDrawerOpen = false;
  let showEmptyDemo = false;

  for (let _p of ctx) {
    const all = deployments();
    const filtered = showEmptyDemo
      ? []
      : all.filter((d) => {
          const matchesQuery =
            !query.trim() ||
            `${d.env} ${d.region} ${d.version}`.toLowerCase().includes(query.trim().toLowerCase());
          const matchesStatus = statusFilters.length === 0 || statusFilters.includes(d.status);
          return matchesQuery && matchesStatus;
        });

    const PAGE_SIZE = 4;
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    if (page > totalPages) page = totalPages;
    const pagedRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    yield (
      <div style="display:grid; gap:1.25rem">
        <PageHeader
          eyebrow="Operations"
          title="Deployments, Kanban & Live Inspector"
          description="Filter deployments, drag cards across the release board, right-click the log pane, or inspect files in the split view."
          actions={
            <div style="display:flex; gap:0.5rem; flex-wrap:wrap">
              <Button
                variant="outline"
                onClick={() => {
                  inspectorOpen = true;
                  ctx.refresh();
                }}
              >
                <Icon icon={PanelRight} size={14} />
                <span>Inspector Sheet</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  quickDrawerOpen = true;
                  ctx.refresh();
                }}
              >
                <Icon icon={PanelBottom} size={14} />
                <span>Quick Drawer</span>
              </Button>
              <Button variant="primary" onClick={() => deployRelease('Staging')}>
                <Icon icon={Rocket} size={14} />
                <span>Deploy Staging</span>
              </Button>
            </div>
          }
        />

        <FilterBar
          query={query}
          onQueryChange={(q) => {
            query = q;
            page = 1;
            ctx.refresh();
          }}
          searchPlaceholder="Filter environments, regions, releases…"
          filters={[
            { id: 'healthy', label: 'Healthy' },
            { id: 'degraded', label: 'Degraded' },
            { id: 'building', label: 'Building' },
          ]}
          activeFilters={statusFilters}
          onToggleFilter={(id) => {
            statusFilters = statusFilters.includes(id)
              ? statusFilters.filter((x) => x !== id)
              : [...statusFilters, id];
            page = 1;
            ctx.refresh();
          }}
          onClearAll={() => {
            query = '';
            statusFilters = [];
            showEmptyDemo = false;
            page = 1;
            ctx.refresh();
          }}
          right={
            <SegmentedControl
              label="View mode"
              value={viewMode}
              options={[
                { value: 'table', label: 'DataTable' },
                { value: 'compact', label: 'Semantic Table' },
              ]}
              onChange={(v) => {
                viewMode = v;
                ctx.refresh();
              }}
            />
          }
        />

        <Card
          title="Edge Deployments"
          action={
            <div style="display:flex; gap:0.5rem; align-items:center">
              <HoverCard
                trigger={
                  <span style="cursor:pointer">
                    <AvatarGroup items={TEAM} max={4} size="sm" />
                  </span>
                }
              >
                <div style="display:grid; gap:0.35rem; min-width:200px">
                  <strong>On-Call SRE Rotation</strong>
                  <span style="font-size:0.8rem; color:var(--aster-on-surface-muted)">
                    Primary: Ada Lovelace · Secondary: Grace Hopper
                  </span>
                </div>
              </HoverCard>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  showEmptyDemo = !showEmptyDemo;
                  page = 1;
                  ctx.refresh();
                }}
              >
                {showEmptyDemo ? 'Restore Rows' : 'Preview EmptyState'}
              </Button>
            </div>
          }
        >
          {filtered.length === 0 ? (
            <EmptyState
              icon={Inbox}
              title="No matching deployments"
              description="Clear your active filters or trigger a fresh Staging deployment."
              action={
                <Button
                  variant="primary"
                  onClick={() => {
                    query = '';
                    statusFilters = [];
                    showEmptyDemo = false;
                    page = 1;
                    ctx.refresh();
                  }}
                >
                  Reset Filters
                </Button>
              }
            />
          ) : viewMode === 'table' ? (
            <div style="display:grid; gap:0.85rem">
              <DataTable rows={pagedRows} columns={COLUMNS} rowKey={(r) => r.id} />
              <Pagination
                page={page}
                totalPages={totalPages}
                onChange={(p) => {
                  page = p;
                  ctx.refresh();
                }}
              />
            </div>
          ) : (
            <div style="display:grid; gap:0.85rem">
              <Table>
                <TableCaption>
                  Semantic HTML table primitive with numeric column alignment.
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Environment</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead numeric>p99 Latency</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pagedRows.map((d) => (
                    <TableRow key={d.id}>
                      <TableCell>{d.env}</TableCell>
                      <TableCell>{d.region}</TableCell>
                      <TableCell numeric>{d.latencyMs} ms</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Pagination
                page={page}
                totalPages={totalPages}
                onChange={(p) => {
                  page = p;
                  ctx.refresh();
                }}
              />
            </div>
          )}
        </Card>

        <Card
          title="Release Pipeline (KanbanBoard)"
          description="Drag cards between columns to update release stage."
        >
          <KanbanBoard
            columns={[
              { id: 'queued', title: 'Queued' },
              { id: 'building', title: 'Building' },
              { id: 'verifying', title: 'Verifying' },
              { id: 'live', title: 'Live' },
            ]}
            cards={kanbanCards()}
            onMove={(cardId, toColumnId) => {
              kanbanCards.update((cards) =>
                cards.map((c) => (c.id === cardId ? { ...c, columnId: toColumnId } : c)),
              );
              toast.show('Card moved', `Moved to ${toColumnId}`);
            }}
          />
        </Card>

        <Card
          title="Workspace Explorer (ResizableSplit, TreeView, ContextMenu & ScrollArea)"
          description="Drag the divider, pick a file in the tree, or right-click inside the inspector pane."
        >
          <ResizableSplit
            defaultSplit={34}
            min={24}
            max={60}
            height="300px"
            first={
              <div style="padding:0.75rem; display:grid; gap:0.65rem">
                <SearchInput
                  placeholder="Find file…"
                  shortcutHint="⌘P"
                  onChange={(v) => {
                    if (v) selectedFile = v;
                  }}
                />
                <TreeView
                  nodes={REPO_TREE}
                  defaultExpanded={['src', 'ui', 'public']}
                  selectedId={selectedFile}
                  onSelect={(node) => {
                    selectedFile = node.id;
                    ctx.refresh();
                  }}
                />
              </div>
            }
            second={
              <ContextMenu
                items={[
                  {
                    id: 'copy',
                    label: 'Copy install command',
                    shortcut: '⌘C',
                    onSelect: () => toast.success('Copied CLI command'),
                  },
                  {
                    id: 'deploy',
                    label: 'Trigger canary deploy',
                    onSelect: () => deployRelease('Canary'),
                  },
                  {
                    id: 'purge',
                    label: 'Purge edge cache',
                    danger: true,
                    separatorBefore: true,
                    onSelect: () => toast.warning('Edge cache purge queued'),
                  },
                ]}
              >
                <div style="padding:0.9rem; display:grid; gap:0.85rem">
                  <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem">
                    <span style="display:inline-flex; align-items:center; gap:0.4rem; font-weight:600; font-size:0.88rem">
                      <Icon icon={FolderTree} size={15} />
                      <span>Selected: {selectedFile}</span>
                    </span>
                    <div style="display:flex; gap:0.5rem; align-items:center">
                      <span style="font-size:0.78rem; color:var(--aster-on-surface-muted)">
                        Right-click or
                      </span>
                      <KbdGroup keys={['⌘', 'K']} />
                    </div>
                  </div>

                  <CodeBlock
                    filename={`src/ui/${selectedFile}.tsx`}
                    code={`vp dlx @fierst/ui add ${selectedFile}\n# Zero-VDOM, OKLCH-themed, mobile-first`}
                  />

                  <DescriptionList
                    striped
                    items={[
                      { term: 'Runtime', detail: 'Zero-VDOM Generator (@fierst/aster)' },
                      { term: 'Shortcut', detail: <Kbd>⌘K</Kbd> },
                      {
                        term: 'Quick Copy',
                        detail: (
                          <CopyButton
                            text={`vp dlx @fierst/ui add ${selectedFile}`}
                            label="Copy CLI"
                          />
                        ),
                      },
                    ]}
                  />
                </div>
              </ContextMenu>
            }
          />
        </Card>

        <Card title="Audit Activity (Timeline & Avatar)">
          <div style="display:grid; gap:0.85rem">
            <div style="display:flex; gap:0.65rem; align-items:center">
              <Avatar name="Ada Lovelace" size="md" status="online" />
              <div>
                <strong style="font-size:0.88rem; display:block">Ada Lovelace</strong>
                <span style="font-size:0.78rem; color:var(--aster-on-surface-muted)">
                  Release Captain · Live Stream
                </span>
              </div>
            </div>
            <ScrollArea bordered maxHeight="240px">
              <Timeline items={timelineItems()} />
            </ScrollArea>
          </div>
        </Card>

        <Sheet
          open={[
            () => inspectorOpen,
            (v: boolean) => {
              inspectorOpen = v;
              ctx.refresh();
            },
          ]}
          side="right"
          title="Deployment Inspector"
          description="Live metadata for the active edge cluster."
          footer={
            <Button
              variant="primary"
              onClick={() => {
                inspectorOpen = false;
                ctx.refresh();
              }}
            >
              Done
            </Button>
          }
        >
          <DescriptionList
            items={[
              { term: 'Cluster', detail: 'us-west (PDX)' },
              { term: 'Active Deploys', detail: String(all.length) },
              { term: 'TLS', detail: 'HTTP/3 + QUIC' },
            ]}
          />
        </Sheet>

        <Drawer
          open={[
            () => quickDrawerOpen,
            (v: boolean) => {
              quickDrawerOpen = v;
              ctx.refresh();
            },
          ]}
          title="Quick Ops Drawer"
          description="Mobile-first bottom sheet built on native <dialog>."
          footer={
            <Button
              variant="primary"
              onClick={() => {
                quickDrawerOpen = false;
                ctx.refresh();
              }}
            >
              Close
            </Button>
          }
        >
          <p style="margin:0; font-size:0.88rem; color:var(--aster-on-surface-muted)">
            Trigger deployments or inspect logs without losing scroll position on mobile viewports.
          </p>
        </Drawer>
      </div>
    );
  }
}
