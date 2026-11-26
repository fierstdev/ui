import {
  Calendar,
  Command,
  Globe,
  Layers,
  PanelBottom,
  Play,
  ShieldAlert,
  Sparkles,
  Trash2,
} from '@lucide/icons';
import { type Ctx } from '@fierst/aster';
import { PageHeader } from '../ui/page-header.tsx';
import { Navbar } from '../ui/navbar.tsx';
import { Menubar } from '../ui/menubar.tsx';
import { NavigationMenu } from '../ui/navigation-menu.tsx';
import { SidebarNav } from '../ui/sidebar-nav.tsx';
import { Tabs } from '../ui/tabs.tsx';
import { Dialog } from '../ui/dialog.tsx';
import { AlertDialog } from '../ui/alert-dialog.tsx';
import { DropdownMenu, Popover } from '../ui/popover.tsx';
import { Tooltip } from '../ui/tooltip.tsx';
import { Button, ButtonGroup } from '../ui/button.tsx';
import { Cluster, Container, Stack } from '../ui/container.tsx';
import { Card } from '../ui/card.tsx';
import { SectionHeader } from '../ui/section-header.tsx';
import { Separator } from '../ui/separator.tsx';
import { AspectRatio } from '../ui/aspect-ratio.tsx';
import { TourCard } from '../ui/tour.tsx';
import { VisuallyHidden } from '../ui/visually-hidden.tsx';
import { Icon } from '../ui/icon.tsx';
import { toast } from '../ui/toast.tsx';
import { activeFlow, commandOpen } from './store.ts';

export function* OverlaysWorkspace(_props: Record<string, any>, ctx: Ctx) {
  let dialogOpen = false;
  let alertOpen = false;
  let tourIdx = 0;

  for (let _p of ctx) {
    yield (
      <Container size="full">
        <Stack gap="1.25rem">
          <PageHeader
            eyebrow="Navigation & Flows"
            title="Menus, Overlays, Layout & yield* Flows"
            description="Test native <dialog> overlays, Popover API menus, responsive layout primitives, and all 8 Aster yield* flows."
          />

          <Card
            title="Native yield* Interactive Flows"
            description="Each button delegates rendering to a generator sub-flow that returns a typed result."
          >
            <Cluster gap="0.5rem">
              <Button variant="primary" onClick={() => activeFlow.set('confirm')}>
                <Icon icon={Sparkles} size={14} />
                <span>yield* confirmDialog</span>
              </Button>
              <Button variant="destructive" onClick={() => activeFlow.set('destructive')}>
                <Icon icon={Trash2} size={14} />
                <span>yield* confirmDestructive</span>
              </Button>
              <Button variant="outline" onClick={() => activeFlow.set('pickCmd')}>
                <Icon icon={Command} size={14} />
                <span>yield* pickCommand</span>
              </Button>
              <Button variant="outline" onClick={() => activeFlow.set('pickDate')}>
                <Icon icon={Calendar} size={14} />
                <span>yield* pickDate</span>
              </Button>
              <Button variant="outline" onClick={() => activeFlow.set('drawer')}>
                <Icon icon={PanelBottom} size={14} />
                <span>yield* promptDrawer</span>
              </Button>
              <Button variant="outline" onClick={() => activeFlow.set('wizard')}>
                <Icon icon={Layers} size={14} />
                <span>yield* runWizard</span>
              </Button>
              <Button variant="outline" onClick={() => activeFlow.set('tour')}>
                <Icon icon={Play} size={14} />
                <span>yield* runTour</span>
              </Button>
              <Button variant="outline" onClick={() => activeFlow.set('approval')}>
                <Icon icon={ShieldAlert} size={14} />
                <span>yield* requestApproval</span>
              </Button>
            </Cluster>
          </Card>

          <Card title="Declarative Overlays, Popovers, Tooltips & Buttons">
            <Stack gap="0.9rem">
              <Cluster gap="0.5rem">
                <Button
                  variant="secondary"
                  onClick={() => {
                    dialogOpen = true;
                    ctx.refresh();
                  }}
                >
                  Open Dialog
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    alertOpen = true;
                    ctx.refresh();
                  }}
                >
                  Open AlertDialog
                </Button>
                <Button variant="outline" onClick={() => commandOpen.set(true)}>
                  Command Palette (⌘K)
                </Button>
                <Button variant="outline" popovertarget="demo-popover">
                  Native Popover
                </Button>
                <DropdownMenu
                  label="DropdownMenu"
                  items={[
                    {
                      id: 't1',
                      label: 'Success toast',
                      onSelect: () => toast.success('Saved cleanly'),
                    },
                    {
                      id: 't2',
                      label: 'Warning toast',
                      onSelect: () => toast.warning('High memory usage'),
                    },
                    {
                      id: 't3',
                      label: 'Error toast',
                      danger: true,
                      separatorBefore: true,
                      onSelect: () => toast.error('Connection reset'),
                    },
                  ]}
                />
                <Tooltip content="Inverted high-contrast tooltip" side="top">
                  <Button variant="ghost">Hover Tooltip</Button>
                </Tooltip>
                <Button variant="link" onClick={() => toast.show('Link button clicked')}>
                  Link Variant
                </Button>
              </Cluster>

              <ButtonGroup label="Quick actions">
                <Button size="sm" variant="outline" onClick={() => toast.show('Copied')}>
                  Copy
                </Button>
                <Button size="sm" variant="outline" onClick={() => toast.show('Duplicated')}>
                  Duplicate
                </Button>
                <Button size="sm" variant="outline" onClick={() => toast.show('Archived')}>
                  Archive
                </Button>
              </ButtonGroup>

              <Popover id="demo-popover">
                <div style="padding:0.85rem; max-width:260px; display:grid; gap:0.4rem">
                  <strong>HTML Popover API</strong>
                  <p style="margin:0; font-size:0.82rem; color:var(--aster-on-surface-muted)">
                    Zero-JS light-dismiss top-layer popover powered by native{' '}
                    <code>popover="auto"</code>.
                  </p>
                </div>
              </Popover>
            </Stack>
          </Card>

          <Card title="Navigation Chrome (Navbar, Menubar, NavigationMenu & SidebarNav)">
            <Stack gap="1rem">
              <Navbar
                brand={
                  <span style="display:inline-flex; align-items:center; gap:0.4rem; font-weight:600">
                    <Icon icon={Globe} size={15} />
                    <span>Fierst Edge</span>
                  </span>
                }
                links={[
                  { label: 'Docs', href: '#docs', active: true },
                  { label: 'Registry', href: '#registry' },
                  { label: 'Pricing', href: '#pricing' },
                ]}
                actions={
                  <Button size="sm" variant="primary" onClick={() => toast.success('Signed in')}>
                    Launch
                  </Button>
                }
              />

              <Cluster gap="1rem">
                <Menubar
                  menus={[
                    {
                      id: 'file',
                      label: 'File',
                      items: [
                        {
                          id: 'new',
                          label: 'New Project',
                          shortcut: '⌘N',
                          onSelect: () => toast.show('New project'),
                        },
                        {
                          id: 'export',
                          label: 'Export Manifest',
                          shortcut: '⌘E',
                          onSelect: () => toast.show('Exported'),
                        },
                      ],
                    },
                    {
                      id: 'view',
                      label: 'View',
                      items: [
                        {
                          id: 'cmd',
                          label: 'Command Palette',
                          shortcut: '⌘K',
                          onSelect: () => commandOpen.set(true),
                        },
                      ],
                    },
                  ]}
                />

                <NavigationMenu
                  sections={[
                    {
                      id: 'products',
                      label: 'Ecosystem',
                      links: [
                        {
                          title: '@fierst/aster',
                          description: 'Zero-VDOM generator framework',
                          href: '#aster',
                          icon: Sparkles,
                        },
                        {
                          title: '@fierst/ui',
                          description: '104 code-owned UI components',
                          href: '#ui',
                          icon: Layers,
                        },
                      ],
                    },
                  ]}
                />
              </Cluster>

              <Separator label="SidebarNav & Layout" />

              <Tabs
                variant="segmented"
                defaultValue="nav"
                items={[
                  {
                    id: 'nav',
                    label: 'SidebarNav',
                    content: () => (
                      <SidebarNav
                        groups={[
                          {
                            id: 'g1',
                            label: 'Infrastructure',
                            items: [
                              { label: 'Edge Clusters', href: '#clusters', active: true },
                              { label: 'Custom Domains', href: '#domains' },
                            ],
                          },
                          {
                            id: 'g2',
                            label: 'Observability',
                            defaultOpen: false,
                            items: [{ label: 'Live Tail Logs', href: '#logs' }],
                          },
                        ]}
                      />
                    ),
                  },
                  {
                    id: 'layout',
                    label: 'AspectRatio & TourCard',
                    content: () => (
                      <Stack gap="1rem">
                        <SectionHeader
                          title="Media Container"
                          description="16:9 locked aspect ratio + TourCard preview."
                        />
                        <AspectRatio ratio={16 / 9}>
                          <div style="width:100%; height:100%; display:grid; place-items:center; background:var(--aster-surface-muted); border:1px solid var(--aster-border); border-radius:var(--aster-radius-md)">
                            <span style="font-size:0.85rem; color:var(--aster-on-surface-muted)">
                              16:9 AspectRatio Preview
                              <VisuallyHidden>Accessible screen-reader description</VisuallyHidden>
                            </span>
                          </div>
                        </AspectRatio>
                        <TourCard
                          step={{
                            id: 'demo-tour',
                            title:
                              tourIdx === 0 ? 'Welcome to AsterUI' : 'Built for Keyboard & Mobile',
                            description:
                              'Step through onboarding highlights using TourCard or runTour().',
                          }}
                          index={tourIdx}
                          total={2}
                          onPrev={() => {
                            tourIdx = 0;
                            ctx.refresh();
                          }}
                          onNext={() => {
                            tourIdx = tourIdx === 0 ? 1 : 0;
                            ctx.refresh();
                          }}
                          onClose={() => toast.show('Tour dismissed')}
                        />
                      </Stack>
                    ),
                  },
                ]}
              />
            </Stack>
          </Card>

          <Dialog
            open={[
              () => dialogOpen,
              (v: boolean) => {
                dialogOpen = v;
                ctx.refresh();
              },
            ]}
            title="Declarative Dialog"
            description="Native <dialog> with Safari-safe flex scrolling and backdrop dismiss."
            footer={
              <Button
                variant="primary"
                onClick={() => {
                  dialogOpen = false;
                  ctx.refresh();
                }}
              >
                Close
              </Button>
            }
          >
            <p style="margin:0; font-size:0.88rem; color:var(--aster-on-surface-muted)">
              Press Escape or click outside to dismiss cleanly across all browsers.
            </p>
          </Dialog>

          <AlertDialog
            open={[
              () => alertOpen,
              (v: boolean) => {
                alertOpen = v;
                ctx.refresh();
              },
            ]}
            title="Delete Staging Environment?"
            description="Type DELETE to confirm permanent removal of the staging cluster."
            confirmPhrase="DELETE"
            confirmLabel="Delete Cluster"
            onConfirm={() => {
              alertOpen = false;
              ctx.refresh();
              toast.warning('Staging cluster deleted');
            }}
            onCancel={() => {
              alertOpen = false;
              ctx.refresh();
            }}
          />
        </Stack>
      </Container>
    );
  }
}
