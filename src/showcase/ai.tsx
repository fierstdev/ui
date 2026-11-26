import { Sparkles } from '@lucide/icons';
import { type Ctx } from '@fierst/aster';
import { PageHeader } from '../ui/page-header.tsx';
import { ChatList, ChatMessage } from '../ui/chat-message.tsx';
import { PromptInput } from '../ui/prompt-input.tsx';
import { MentionInput } from '../ui/mention-input.tsx';
import { SuggestionChips } from '../ui/suggestion-chips.tsx';
import { StreamingText } from '../ui/streaming-text.tsx';
import { ReasoningBlock } from '../ui/reasoning-block.tsx';
import { ToolCallCard } from '../ui/tool-call-card.tsx';
import { CitationBadge, SourceList } from '../ui/citation-badge.tsx';
import { ApprovalCard } from '../ui/approval-card.tsx';
import { DiffViewer, type DiffLine } from '../ui/diff-viewer.tsx';
import { JsonViewer } from '../ui/json-viewer.tsx';
import { TokenUsageBar } from '../ui/token-usage.tsx';
import { WorkflowGraph } from '../ui/workflow-graph.tsx';
import { Prose, Text } from '../ui/prose.tsx';
import { Collapsible } from '../ui/collapsible.tsx';
import { Accordion } from '../ui/accordion.tsx';
import { Grid } from '../ui/grid.tsx';
import { Card } from '../ui/card.tsx';
import { Badge } from '../ui/badge.tsx';
import { Button } from '../ui/button.tsx';
import { Icon } from '../ui/icon.tsx';
import {
  activeFlow,
  approvalState,
  chatMessages,
  deployments,
  resolveMigration,
  sendAgentPrompt,
  tokenUsage,
  workflowNodes,
} from './store.ts';

const MIGRATION_DIFF: DiffLine[] = [
  { kind: 'ctx', lineNo: 1, text: '-- Migration 20261126_edge_latency_idx.sql' },
  { kind: 'del', lineNo: 2, text: 'CREATE INDEX idx_deployments_region ON deployments (region);' },
  { kind: 'add', lineNo: 2, text: 'CREATE INDEX CONCURRENTLY idx_deployments_region_created' },
  { kind: 'add', lineNo: 3, text: '  ON deployments (region, created_at DESC);' },
  { kind: 'ctx', lineNo: 4, text: 'ANALYZE deployments;' },
];

export function* AiStudioWorkspace(_props: Record<string, any>, ctx: Ctx) {
  let promptDraft = '';
  let mentionNote = 'Assigning @ada to review the NRT index plan.';

  for (let _p of ctx) {
    const msgs = chatMessages();
    const status = approvalState();
    const usage = tokenUsage();

    yield (
      <div style="display:grid; gap:1.25rem">
        <PageHeader
          eyebrow="Agentic UI"
          title="AI Agent Studio & Human-in-the-Loop"
          description="Chat composer, reasoning traces, tool invocations, SQL diff review, DAG workflow graph, and approval gates."
          actions={
            <Button variant="primary" onClick={() => activeFlow.set('approval')}>
              <Icon icon={Sparkles} size={14} />
              <span>Run yield* Approval Flow</span>
            </Button>
          }
        />

        <Card
          title="Workflow Execution Graph"
          description="Live durable DAG state updated by approvals below."
        >
          <div style="display:grid; gap:0.85rem">
            <WorkflowGraph nodes={workflowNodes()} />
            <TokenUsageBar
              inputTokens={usage.input}
              cachedTokens={usage.cached}
              outputTokens={usage.output}
              limit={128000}
            />
          </div>
        </Card>

        <Grid cols={2}>
          <Card
            title="Copilot Thread"
            description="ChatMessage, StreamingText, ReasoningBlock, ToolCallCard & Citations."
          >
            <div style="display:grid; gap:0.9rem">
              <ChatList>
                {msgs.map((m) => (
                  <ChatMessage key={m.id} role={m.role} author={m.author} timestamp={m.timestamp}>
                    {m.streaming ? (
                      <StreamingText text={m.text} streaming />
                    ) : (
                      <Prose>
                        <Text size="sm">
                          {m.text}{' '}
                          {m.role === 'assistant' ? (
                            <CitationBadge
                              index={1}
                              href="https://github.com/fierstdev/ui"
                              title="Edge Diagnostics"
                            />
                          ) : null}
                        </Text>
                      </Prose>
                    )}
                  </ChatMessage>
                ))}
              </ChatList>

              <ReasoningBlock label="Thought process" durationLabel="1.4s" defaultOpen>
                <Text size="xs" tone="muted">
                  1. Inspected p99 latency spikes in ap-northeast (NRT). 2. Verified sequential scan
                  on deployments table. 3. Selected CONCURRENTLY to avoid write locks.
                </Text>
              </ReasoningBlock>

              <ToolCallCard
                toolName="sql.explain_analyze"
                status="success"
                durationMs={142}
                args={{ region: 'ap-northeast', limit: 50 }}
                result={{ scanType: 'Seq Scan', estimatedGain: '78% faster' }}
              />

              <SourceList
                sources={[
                  { title: 'Edge Telemetry Runbook', href: 'https://github.com/fierstdev/ui' },
                  { title: 'Aster Generator Flows', href: 'https://github.com/fierstdev/aster' },
                ]}
              />

              <SuggestionChips
                prompts={[
                  'Summarize NRT latency anomalies',
                  'Draft release notes for v1.0.0-alpha.2',
                  'Check cache hit ratio across POPs',
                ]}
                onSelect={(p) => sendAgentPrompt(p)}
              />

              <PromptInput
                value={promptDraft}
                placeholder="Ask Fierst Copilot about your fleet…"
                onChange={(v) => {
                  promptDraft = v;
                  ctx.refresh();
                }}
                onSubmit={(text) => {
                  sendAgentPrompt(text);
                  promptDraft = '';
                  ctx.refresh();
                }}
              />
            </div>
          </Card>

          <div style="display:grid; gap:1.15rem; align-content:start">
            <ApprovalCard
              title="Approve Production DDL Migration"
              description="Human-in-the-loop gate bound to SHA-256 artifact hash."
              assigneeRole="Staff DBA"
              artifactHash="sha256:9f4c2a8e1b7d"
              codePreview="CREATE INDEX CONCURRENTLY idx_deployments_region_created ON deployments (region, created_at DESC);"
              danger
              approveLabel={status === 'approved' ? 'Approved' : 'Approve & Apply'}
              rejectLabel={status === 'rejected' ? 'Rejected' : 'Reject'}
              onApprove={() => resolveMigration(true)}
              onReject={() => resolveMigration(false)}
            />

            <Card
              title="SQL Diff & Live Payload"
              action={
                <Badge
                  tone={
                    status === 'approved' ? 'success' : status === 'rejected' ? 'danger' : 'warning'
                  }
                >
                  {status}
                </Badge>
              }
            >
              <div style="display:grid; gap:0.85rem">
                <DiffViewer filename="20261126_edge_latency_idx.sql" lines={MIGRATION_DIFF} />
                <Collapsible title="Inspect Live Agent Payload (JsonViewer)" defaultOpen>
                  <JsonViewer
                    defaultExpandedDepth={2}
                    data={{
                      approvalStatus: status,
                      activeEnvironments: deployments().length,
                      tokenUsage: usage,
                    }}
                  />
                </Collapsible>
              </div>
            </Card>

            <Card title="Escalation & Runbook (MentionInput & Accordion)">
              <div style="display:grid; gap:0.85rem">
                <MentionInput
                  label="Reviewer Handoff Note (type @)"
                  value={mentionNote}
                  candidates={[
                    { handle: 'ada', name: 'Ada Lovelace' },
                    { handle: 'grace', name: 'Grace Hopper' },
                    { handle: 'margaret', name: 'Margaret Hamilton' },
                  ]}
                  onChange={(v) => {
                    mentionNote = v;
                    ctx.refresh();
                  }}
                />
                <Accordion
                  type="single"
                  items={[
                    {
                      id: 'ai-1',
                      title: 'Why pause agents with yield*?',
                      defaultOpen: true,
                      content:
                        'Generator delegation lets approval gates pause inline and return a typed boolean without state-machine boilerplate.',
                    },
                    {
                      id: 'ai-2',
                      title: 'How are tool payloads audited?',
                      content:
                        'Every ToolCallCard and ApprovalCard binds to an immutable argument snapshot and SHA-256 artifact hash.',
                    },
                  ]}
                />
              </div>
            </Card>
          </div>
        </Grid>
      </div>
    );
  }
}
