import { signal } from '@fierst/aster';
import type { KanbanCardItem } from '../ui/kanban.tsx';
import type { TimelineItem } from '../ui/timeline.tsx';
import type { WorkflowNode } from '../ui/workflow-graph.tsx';
import type { DateRange } from '../ui/date-range-picker.tsx';
import { toast } from '../ui/toast.tsx';

export type NavSection = 'overview' | 'ops' | 'ai' | 'forms' | 'overlays' | 'directory';

export type ActiveFlow =
  | 'idle'
  | 'confirm'
  | 'destructive'
  | 'pickCmd'
  | 'pickDate'
  | 'drawer'
  | 'wizard'
  | 'tour'
  | 'approval';

export interface Deployment {
  id: string;
  env: string;
  region: string;
  version: string;
  latencyMs: number;
  status: 'healthy' | 'degraded' | 'building';
}

export interface AgentMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  author: string;
  timestamp: string;
  text: string;
  streaming?: boolean;
}

export const navSection = signal<NavSection>('overview');
export const activeFlow = signal<ActiveFlow>('idle');
export const commandOpen = signal(false);
export const dirtySettings = signal(false);

export const deployments = signal<Deployment[]>([
  {
    id: 'd1',
    env: 'Production',
    region: 'us-west (PDX)',
    version: 'v1.0.0-alpha.2',
    latencyMs: 14,
    status: 'healthy',
  },
  {
    id: 'd2',
    env: 'Staging',
    region: 'eu-central (FRA)',
    version: 'v1.0.0-alpha.2',
    latencyMs: 28,
    status: 'healthy',
  },
  {
    id: 'd3',
    env: 'Canary',
    region: 'ap-northeast (NRT)',
    version: 'v1.0.0-alpha.3-rc1',
    latencyMs: 92,
    status: 'degraded',
  },
  {
    id: 'd4',
    env: 'Preview #48',
    region: 'us-east (IAD)',
    version: 'pr-48-a91f',
    latencyMs: 19,
    status: 'building',
  },
  {
    id: 'd5',
    env: 'EU Edge Mirror',
    region: 'eu-west (DUB)',
    version: 'v1.0.0-alpha.2',
    latencyMs: 22,
    status: 'healthy',
  },
  {
    id: 'd6',
    env: 'APAC Gateway',
    region: 'ap-southeast (SIN)',
    version: 'v1.0.0-alpha.2',
    latencyMs: 41,
    status: 'healthy',
  },
  {
    id: 'd7',
    env: 'Preview #47',
    region: 'us-west (SJC)',
    version: 'pr-47-c30b',
    latencyMs: 17,
    status: 'healthy',
  },
  {
    id: 'd8',
    env: 'Sandbox',
    region: 'us-central (DFW)',
    version: 'v1.0.0-alpha.1',
    latencyMs: 31,
    status: 'healthy',
  },
  {
    id: 'd9',
    env: 'Load Test',
    region: 'eu-north (ARN)',
    version: 'bench-09',
    latencyMs: 64,
    status: 'degraded',
  },
  {
    id: 'd10',
    env: 'Docs Site',
    region: 'us-east (IAD)',
    version: 'v1.0.0-alpha.2',
    latencyMs: 11,
    status: 'healthy',
  },
  {
    id: 'd11',
    env: 'Registry CDN',
    region: 'global (ANYCAST)',
    version: 'v1.0.0-alpha.2',
    latencyMs: 9,
    status: 'healthy',
  },
  {
    id: 'd12',
    env: 'Preview #46',
    region: 'sa-east (GRU)',
    version: 'pr-46-88e2',
    latencyMs: 53,
    status: 'building',
  },
]);

export const kanbanCards = signal<KanbanCardItem[]>([
  {
    id: 'k1',
    columnId: 'queued',
    title: 'Sync pnpm-lock.yaml for CI',
    meta: 'fierstdev/ui',
    tag: 'chore',
    tagTone: 'neutral',
  },
  {
    id: 'k2',
    columnId: 'building',
    title: 'Build 104-item registry manifest',
    meta: 'public/r/*.json',
    tag: 'build',
    tagTone: 'primary',
  },
  {
    id: 'k3',
    columnId: 'verifying',
    title: 'Run edge latency smoke probe',
    meta: '310 POPs',
    tag: 'qa',
    tagTone: 'warning',
  },
  {
    id: 'k4',
    columnId: 'live',
    title: 'Publish @fierst/aster@1.0.0-alpha.2',
    meta: 'OIDC provenance',
    tag: 'live',
    tagTone: 'success',
  },
]);

export const timelineItems = signal<TimelineItem[]>([
  {
    id: 't1',
    title: 'Production edge rollout completed',
    timestamp: '2m ago',
    description: 'Zero cold starts across 310 POPs.',
    tone: 'success',
  },
  {
    id: 't2',
    title: 'Canary p99 spike detected in NRT',
    timestamp: '14m ago',
    description: 'Auto-mitigation shifted 20% traffic to PDX.',
    tone: 'warning',
  },
  {
    id: 't3',
    title: 'Schema migration queued for review',
    timestamp: '31m ago',
    description: 'Waiting on Staff DBA approval in AI Studio.',
    tone: 'primary',
  },
]);

export const workflowNodes = signal<WorkflowNode[]>([
  { id: 'w1', label: 'Inspect Schema', detail: '142 ms', status: 'done' },
  { id: 'w2', label: 'Generate DDL Diff', detail: '380 ms', status: 'done' },
  { id: 'w3', label: 'Human Approval', detail: 'Waiting on @ada', status: 'waiting' },
  { id: 'w4', label: 'Apply & Verify', detail: 'Pending', status: 'pending' },
]);

export const approvalState = signal<'pending' | 'approved' | 'rejected'>('pending');

export const tokenUsage = signal({ input: 42800, cached: 28400, output: 6150 });

export const chatMessages = signal<AgentMessage[]>([
  {
    id: 'm1',
    role: 'user',
    author: 'Ada Lovelace',
    timestamp: '09:41',
    text: 'Audit our edge deployment latency in NRT and prepare a safe index migration.',
  },
  {
    id: 'm2',
    role: 'assistant',
    author: 'Fierst Copilot',
    timestamp: '09:41',
    text: 'Found a missing composite index on `deployments(region, created_at)`. I generated a concurrent migration diff and paused for approval before touching Production.',
  },
]);

export const releaseConfig = signal({
  projectName: 'aster-cloud',
  region: 'pdx',
  replicaRegions: ['pdx', 'iad', 'fra'] as string[],
  framework: 'Aster + Vite+',
  deployDate: '2026-11-26',
  windowRange: { start: '2026-11-26', end: '2026-12-03' } as DateRange,
  deployTime: '14:30',
  rolloutPct: 72,
  autoscaleBounds: [20, 85] as [number, number],
  replicas: 4,
  monthlyCap: 240,
  brandHex: '#6366f1',
  phone: '+14155550199',
  otp: '482910',
  tags: ['edge', 'zero-vdom', 'oklch'] as string[],
  features: ['ssr', 'revive'] as string[],
  plan: 'pro',
  autoRevive: true,
  notes: 'Shipping 104 code-owned AsterUI components with OIDC provenance.',
  rating: 5,
  files: [] as string[],
});

export function updateRelease<K extends keyof ReturnType<typeof releaseConfig>>(
  key: K,
  value: ReturnType<typeof releaseConfig>[K],
) {
  releaseConfig.update((prev) => ({ ...prev, [key]: value }));
  dirtySettings.set(true);
}

export function deployRelease(env = 'Production') {
  const cfg = releaseConfig();
  const id = `d-${Date.now()}`;
  const regionLabel =
    cfg.region === 'pdx'
      ? 'us-west (PDX)'
      : cfg.region === 'iad'
        ? 'us-east (IAD)'
        : cfg.region === 'fra'
          ? 'eu-central (FRA)'
          : 'ap-northeast (NRT)';

  deployments.update((list) => [
    {
      id,
      env,
      region: regionLabel,
      version: 'v1.0.0-alpha.2',
      latencyMs: 12 + Math.floor(Math.random() * 14),
      status: 'healthy',
    },
    ...list,
  ]);
  kanbanCards.update((cards) => [
    {
      id: `k-${Date.now()}`,
      columnId: 'live',
      title: `Deploy ${cfg.projectName} (${env})`,
      meta: regionLabel,
      tag: 'live',
      tagTone: 'success',
    },
    ...cards,
  ]);
  timelineItems.update((items) => [
    {
      id: `t-${Date.now()}`,
      title: `Deployed ${cfg.projectName} to ${regionLabel}`,
      timestamp: 'just now',
      description: `Rollout ${cfg.rolloutPct}% · ${cfg.replicas} replicas · scheduled ${cfg.deployDate} ${cfg.deployTime}`,
      tone: 'success',
    },
    ...items,
  ]);
  dirtySettings.set(false);
  toast.success('Deployment live', `${cfg.projectName} pushed to ${regionLabel}`);
}

export function resolveMigration(approved: boolean) {
  approvalState.set(approved ? 'approved' : 'rejected');
  workflowNodes.set([
    { id: 'w1', label: 'Inspect Schema', detail: '142 ms', status: 'done' },
    { id: 'w2', label: 'Generate DDL Diff', detail: '380 ms', status: 'done' },
    {
      id: 'w3',
      label: 'Human Approval',
      detail: approved ? 'Approved by @ada' : 'Rejected by @ada',
      status: approved ? 'done' : 'failed',
    },
    {
      id: 'w4',
      label: 'Apply & Verify',
      detail: approved ? '210 ms · 0 locks' : 'Skipped',
      status: approved ? 'done' : 'pending',
    },
  ]);
  tokenUsage.update((t) => ({ ...t, output: t.output + 840 }));
  timelineItems.update((items) => [
    {
      id: `t-${Date.now()}`,
      title: approved ? 'DDL migration applied cleanly' : 'DDL migration rejected',
      timestamp: 'just now',
      description: approved
        ? 'Composite index created concurrently.'
        : 'Agent paused and rolled back plan.',
      tone: approved ? 'success' : 'danger',
    },
    ...items,
  ]);
  if (approved) toast.success('Migration approved', 'Index applied with zero downtime.');
  else toast.warning('Migration rejected', 'Workflow halted before DDL execution.');
}

export function sendAgentPrompt(prompt: string) {
  const clean = prompt.trim();
  if (!clean) return;
  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  chatMessages.update((list) => [
    ...list,
    { id: `u-${Date.now()}`, role: 'user', author: 'Ada Lovelace', timestamp: now, text: clean },
    {
      id: `a-${Date.now() + 1}`,
      role: 'assistant',
      author: 'Fierst Copilot',
      timestamp: now,
      text: `Analyzed "${clean}" across ${deployments().length} active environments. Current rollout is at ${releaseConfig().rolloutPct}% with 99.99% global availability.`,
      streaming: true,
    },
  ]);
  tokenUsage.update((t) => ({
    input: t.input + 1200,
    cached: t.cached + 600,
    output: t.output + 420,
  }));
}
