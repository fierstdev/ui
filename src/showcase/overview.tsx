import { Activity, Cpu, Globe, Play, RefreshCw, Rocket, Sparkles, Zap } from '@lucide/icons';
import { type Ctx } from '@fierst/aster';
import { PageHeader } from '../ui/page-header.tsx';
import { Breadcrumb } from '../ui/breadcrumb.tsx';
import { Alert, Banner } from '../ui/alert.tsx';
import { StatCard, StatGrid } from '../ui/stat-card.tsx';
import { Sparkline } from '../ui/sparkline.tsx';
import { AreaChart, LineChart } from '../ui/line-chart.tsx';
import { BarChart } from '../ui/bar-chart.tsx';
import { DonutChart } from '../ui/donut-chart.tsx';
import { CalendarHeatmap } from '../ui/calendar-heatmap.tsx';
import { MetricList } from '../ui/metric-list.tsx';
import { StatusDot, UptimeBar } from '../ui/status-dot.tsx';
import { Progress, ProgressRing, Skeleton } from '../ui/progress.tsx';
import { Meter } from '../ui/meter.tsx';
import { LoadingOverlay, Spinner } from '../ui/spinner.tsx';
import { Carousel } from '../ui/carousel.tsx';
import { ConsentBanner } from '../ui/banner-cookie.tsx';
import { BackToTop } from '../ui/back-to-top.tsx';
import { Footer } from '../ui/footer.tsx';
import { BentoCard, BentoGrid, Grid } from '../ui/grid.tsx';
import { Card } from '../ui/card.tsx';
import { Badge } from '../ui/badge.tsx';
import { Button } from '../ui/button.tsx';
import { Icon } from '../ui/icon.tsx';
import { toast } from '../ui/toast.tsx';
import { activeFlow, deployRelease, deployments, navSection, releaseConfig } from './store.ts';

const HEATMAP_VALUES = Array.from({ length: 56 }, (_, i) => {
  const d = new Date(2026, 9, 1 + i);
  const iso = d.toISOString().slice(0, 10);
  return { date: iso, count: (i * 7 + 3) % 14 };
});

const UPTIME_DAYS = Array.from({ length: 30 }, (_, i) => ({
  label: `Day ${i + 1}`,
  status: i === 18 ? ('degraded' as const) : ('operational' as const),
}));

async function* EdgeHealthProbe(props: { run: number }, ctx: Ctx) {
  yield (
    <div style="display:grid; gap:0.65rem">
      <div style="display:flex; gap:0.65rem; align-items:center">
        <Skeleton width="36px" height="36px" shape="circle" />
        <div style="flex:1; display:grid; gap:0.35rem">
          <Skeleton width="55%" height="0.85rem" />
          <Skeleton width="80%" height="0.7rem" />
        </div>
      </div>
      <Progress label="Probing 310 global POPs…" />
    </div>
  );

  await new Promise((r) => setTimeout(r, 650));
  if (ctx.signal.aborted) return;

  yield (
    <div style="display:flex; justify-content:space-between; align-items:center; gap:0.75rem; flex-wrap:wrap">
      <div>
        <strong style="display:block; font-size:0.9rem">All 310 Edge POPs Healthy</strong>
        <span style="font-size:0.8rem; color:var(--aster-on-surface-muted)">
          Probe #{props.run} resolved via <code>async function*</code>
        </span>
      </div>
      <StatusDot status="operational" label="99.99% uptime" />
    </div>
  );
}

export function* OverviewWorkspace(_props: Record<string, any>, ctx: Ctx) {
  let probeRun = 1;
  let simulatingLoad = false;

  for (let _p of ctx) {
    const list = deployments();
    const cfg = releaseConfig();
    const avgLatency = Math.round(
      list.reduce((s, d) => s + d.latencyMs, 0) / Math.max(1, list.length),
    );

    yield (
      <div style="display:grid; gap:1.25rem">
        <PageHeader
          eyebrow="Fierst Cloud Console"
          title="Edge Fleet & Telemetry"
          description="Live interactive showcase of all 104 AsterUI components working together on shared signals and native yield* flows."
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'Fierst', href: '#fierst', onClick: (e) => e.preventDefault() },
                { label: 'AsterUI', href: '#asterui', onClick: (e) => e.preventDefault() },
                { label: 'Overview' },
              ]}
            />
          }
          meta={
            <div style="display:flex; gap:0.5rem; align-items:center; flex-wrap:wrap">
              <StatusDot status="operational" label="All regions nominal" />
              <Badge tone="primary">v1.0.0-alpha.2</Badge>
              <Badge tone="neutral">{list.length} active deploys</Badge>
            </div>
          }
          actions={
            <div style="display:flex; gap:0.5rem; flex-wrap:wrap">
              <Button variant="outline" onClick={() => activeFlow.set('tour')}>
                <Icon icon={Play} size={14} />
                <span>Guided Tour</span>
              </Button>
              <Button variant="primary" onClick={() => deployRelease('Production')}>
                <Icon icon={Rocket} size={14} />
                <span>Deploy Now</span>
              </Button>
            </div>
          }
        />

        <Banner
          tone="info"
          title="Connected Showcase"
          description="Click Deploy Now, approve migrations in AI Studio, or tweak Release Forms—telemetry, Kanban, and Timeline stay in sync."
          dismissible
        />

        <StatGrid>
          <StatCard
            label="Active Deployments"
            value={list.length}
            delta="+14% this week"
            trend="up"
            icon={Rocket}
            sparkline={[2, 3, 3, 4, 3, 5, list.length]}
          />
          <StatCard
            label="Global p99 Latency"
            value={`${avgLatency} ms`}
            delta="-6 ms vs baseline"
            trend="up"
            icon={Zap}
            sparkline={[44, 38, 36, 31, 29, 27, avgLatency]}
          />
          <StatCard
            label="Rollout Traffic"
            value={`${cfg.rolloutPct}%`}
            delta={`${cfg.replicas} replicas`}
            trend="neutral"
            icon={Globe}
            sparkline={[15, 25, 40, 52, 60, 68, cfg.rolloutPct]}
          />
          <StatCard
            label="Edge Compute Quota"
            value="68.4%"
            delta="Within SLA"
            trend="up"
            icon={Cpu}
            sparkline={[51, 55, 59, 62, 64, 66, 68]}
          />
        </StatGrid>

        <Grid cols={2}>
          <Card
            title="Requests per Second (AreaChart)"
            description="Streaming edge traffic across primary POPs."
          >
            <AreaChart
              label="Edge RPS"
              unit="k"
              data={[
                { label: '00:00', value: 18 },
                { label: '04:00', value: 24 },
                { label: '08:00', value: 42 },
                { label: '12:00', value: 68 },
                { label: '16:00', value: 74 },
                { label: '20:00', value: 59 },
              ]}
            />
          </Card>

          <Card
            title="Latency by Environment (BarChart)"
            description="Updates live whenever you deploy a new environment."
          >
            <BarChart
              label="Environment p99"
              unit="ms"
              data={list.slice(0, 6).map((d) => ({ label: d.env, value: d.latencyMs }))}
            />
          </Card>
        </Grid>

        <BentoGrid>
          <BentoCard
            title="Traffic Split (DonutChart)"
            description="Requests routed by edge cluster."
          >
            <DonutChart
              centerLabel="100%"
              data={[
                { label: 'us-west (PDX)', value: 42 },
                { label: 'eu-central (FRA)', value: 28 },
                { label: 'us-east (IAD)', value: 19 },
                { label: 'ap-northeast (NRT)', value: 11 },
              ]}
            />
          </BentoCard>

          <BentoCard
            title="Top Routes (MetricList & Sparkline)"
            description="Hottest streaming endpoints."
          >
            <div style="display:grid; gap:0.75rem">
              <MetricList
                unit=" req/s"
                items={[
                  { label: '/api/v1/stream', value: 14280 },
                  { label: '/r/index.json', value: 9840 },
                  { label: '/edge/revive', value: 6410 },
                  { label: '/webhooks/oidc', value: 2190 },
                ]}
              />
              <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.8rem; color:var(--aster-on-surface-muted)">
                <span>Error budget burn</span>
                <Sparkline values={[4, 3, 5, 2, 2, 1, 1]} tone="success" />
              </div>
            </div>
          </BentoCard>

          <BentoCard
            title="Live Probe & Quotas"
            description="Async generator probe, Meter, ProgressRing & LoadingOverlay."
          >
            <LoadingOverlay loading={simulatingLoad} label="Syncing telemetry…">
              <div style="display:grid; gap:0.85rem">
                <div style="display:flex; justify-content:space-between; align-items:center; gap:0.75rem">
                  <div style="flex:1">
                    <Progress label="Rollout Completion" value={cfg.rolloutPct} showValue />
                  </div>
                  <ProgressRing value={cfg.rolloutPct} />
                </div>
                <Meter
                  label="KV Cache Memory"
                  value={78}
                  max={100}
                  warnAt={75}
                  dangerAt={90}
                  valueLabel="78%"
                />
                <EdgeHealthProbe run={probeRun} />
                <div style="display:flex; gap:0.5rem; align-items:center; flex-wrap:wrap">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      probeRun++;
                      ctx.refresh();
                    }}
                  >
                    <Icon icon={RefreshCw} size={13} />
                    <span>Re-probe</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      simulatingLoad = true;
                      ctx.refresh();
                      setTimeout(() => {
                        simulatingLoad = false;
                        ctx.refresh();
                        toast.show('Telemetry refreshed');
                      }, 700);
                    }}
                  >
                    <Spinner size="xs" />
                    <span>Test Overlay</span>
                  </Button>
                </div>
              </div>
            </LoadingOverlay>
          </BentoCard>
        </BentoGrid>

        <Grid cols={2}>
          <Card
            title="30-Day Uptime & Deployment Activity"
            description="UptimeBar + CalendarHeatmap + LineChart."
          >
            <div style="display:grid; gap:1rem">
              <UptimeBar name="Global Edge Router" uptimePct="99.98%" days={UPTIME_DAYS} />
              <CalendarHeatmap values={HEATMAP_VALUES} label="8-week release cadence" />
              <LineChart
                height={120}
                unit="%"
                label="Cache Hit Ratio"
                data={[
                  { label: 'Mon', value: 94 },
                  { label: 'Tue', value: 96 },
                  { label: 'Wed', value: 95 },
                  { label: 'Thu', value: 98 },
                  { label: 'Fri', value: 99 },
                ]}
              />
            </div>
          </Card>

          <Card
            title="Release Highlights (Carousel & Alert)"
            description="Swipe or step through key AsterUI capabilities."
          >
            <div style="display:grid; gap:1rem">
              <Carousel
                label="Platform highlights"
                slides={[
                  {
                    id: 's1',
                    content: (
                      <div style="padding:1.25rem; display:grid; gap:0.4rem">
                        <Badge tone="primary">Zero-VDOM</Badge>
                        <strong style="font-size:1rem">Native yield* UI Flows</strong>
                        <p style="margin:0; font-size:0.85rem; color:var(--aster-on-surface-muted)">
                          Modals, date pickers, command palettes, approvals, and wizards return
                          typed values straight inline.
                        </p>
                      </div>
                    ),
                  },
                  {
                    id: 's2',
                    content: (
                      <div style="padding:1.25rem; display:grid; gap:0.4rem">
                        <Badge tone="success">OKLCH</Badge>
                        <strong style="font-size:1rem">Single-Seed Theme Engine</strong>
                        <p style="margin:0; font-size:0.85rem; color:var(--aster-on-surface-muted)">
                          Switch Zinc, Blue, Emerald, Violet, Rose, or Amber seeds in the topbar
                          with zero runtime CSS-in-JS.
                        </p>
                      </div>
                    ),
                  },
                  {
                    id: 's3',
                    content: (
                      <div style="padding:1.25rem; display:grid; gap:0.4rem">
                        <Badge tone="warning">104 Items</Badge>
                        <strong style="font-size:1rem">Code-Owned Registry</strong>
                        <p style="margin:0; font-size:0.85rem; color:var(--aster-on-surface-muted)">
                          Install any component into your repo with{' '}
                          <code>vp dlx @fierst/ui add</code> and customize freely.
                        </p>
                      </div>
                    ),
                  },
                ]}
              />
              <Alert
                tone="success"
                title="Registry Verified"
                description="All 104 modules compiled with zero TypeScript errors."
                action={
                  <Button size="sm" variant="outline" onClick={() => navSection.set('directory')}>
                    <Icon icon={Activity} size={13} />
                    <span>Browse All 104</span>
                  </Button>
                }
              />
            </div>
          </Card>
        </Grid>

        <ConsentBanner
          title="Telemetry & Local Preferences"
          description="AsterUI stores your chosen OKLCH seed, radius, and color mode locally in localStorage."
          onAccept={() => toast.success('Preferences saved')}
          onDecline={() => toast.show('Using session defaults')}
        />

        <Footer
          brand={
            <span style="display:inline-flex; align-items:center; gap:0.4rem; font-weight:600">
              <Icon icon={Sparkles} size={15} />
              <span>AsterUI</span>
            </span>
          }
          tagline="104 mobile-first, code-owned components for @fierst/aster."
          columns={[
            {
              heading: 'Workspaces',
              links: [
                { label: 'Overview & Telemetry', href: '#overview' },
                { label: 'Deployments & Ops', href: '#ops' },
                { label: 'AI Agent Studio', href: '#ai' },
              ],
            },
            {
              heading: 'Resources',
              links: [
                { label: 'Component Directory', href: '#directory' },
                { label: 'GitHub Repository', href: 'https://github.com/fierstdev/ui' },
                { label: '@fierst/aster Core', href: 'https://github.com/fierstdev/aster' },
              ],
            },
          ]}
          copyright="© 2026 Fierst LLC. MIT License."
        />

        <BackToTop threshold={260} label="Back to top" />
      </div>
    );
  }
}
