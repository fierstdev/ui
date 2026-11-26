import { Check, Clock, Pause, Play, X } from '@lucide/icons';
import { scope } from '@fierst/aster';
import { Badge, type BadgeTone } from './badge.tsx';
import { Icon } from './icon.tsx';

const wgScope = scope`
  :scope {
    display: flex;
    flex-direction: column;
    gap: 0;
    font-family: var(--aster-font-sans);
  }
  .wg-node {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0.7rem 0.9rem;
    border-radius: var(--aster-radius-md);
    border: 1px solid var(--aster-border);
    background: var(--aster-surface);
    box-shadow: var(--aster-shadow-xs);
  }
  .wg-node.st-waiting { border-color: var(--aster-warning-border); background: var(--aster-warning-subtle); }
  .wg-node.st-running { border-color: var(--aster-primary-border); }
  .wg-conn {
    width: 1px;
    height: 16px;
    background: var(--aster-border-strong);
    margin-left: 1.45rem;
  }
  .wg-left { display: flex; align-items: center; gap: 0.65rem; min-width: 0; }
  .wg-ic {
    width: 26px;
    height: 26px;
    border-radius: 9999px;
    border: 1px solid var(--aster-border);
    background: var(--aster-surface-muted);
    color: var(--aster-on-surface-muted);
    display: inline-grid;
    place-items: center;
    flex-shrink: 0;
  }
  .wg-node.st-done .wg-ic,
  .wg-node.st-replayed .wg-ic { background: var(--aster-success-subtle); border-color: var(--aster-success-border); color: var(--aster-on-success-subtle); }
  .wg-node.st-waiting .wg-ic { background: var(--aster-surface); border-color: var(--aster-warning-border); color: var(--aster-warning); }
  .wg-node.st-failed .wg-ic { background: var(--aster-danger-subtle); border-color: var(--aster-danger-border); color: var(--aster-danger); }
  .wg-name { font-size: 0.85rem; font-weight: 600; color: var(--aster-on-surface); display: block; }
  .wg-sub { font-family: var(--aster-font-mono); font-size: 0.74rem; color: var(--aster-on-surface-muted); }
`;

export interface WorkflowNode {
  id: string;
  label: string;
  detail?: string;
  status: 'pending' | 'running' | 'waiting' | 'done' | 'replayed' | 'failed';
}

const NODE_TONE: Record<WorkflowNode['status'], BadgeTone> = {
  pending: 'neutral',
  running: 'primary',
  waiting: 'warning',
  done: 'success',
  replayed: 'primary',
  failed: 'danger',
};

export function WorkflowGraph({
  nodes,
  class: extraClass,
}: {
  nodes: readonly WorkflowNode[];
  class?: string;
}) {
  return (
    <div
      class={[wgScope, extraClass].filter(Boolean).join(' ')}
      role="list"
      aria-label="Workflow execution graph"
    >
      {nodes.map((node, idx) => {
        const icon =
          node.status === 'done' || node.status === 'replayed'
            ? Check
            : node.status === 'waiting'
              ? Pause
              : node.status === 'running'
                ? Play
                : node.status === 'failed'
                  ? X
                  : Clock;
        return (
          <div key={node.id} role="listitem">
            {idx > 0 ? <div class="wg-conn" aria-hidden="true" /> : null}
            <div class={`wg-node st-${node.status}`}>
              <div class="wg-left">
                <span class="wg-ic" aria-hidden="true">
                  <Icon icon={icon} size={13} />
                </span>
                <div style="min-width:0">
                  <span class="wg-name">{node.label}</span>
                  {node.detail ? <span class="wg-sub">{node.detail}</span> : null}
                </div>
              </div>
              <Badge tone={NODE_TONE[node.status]}>{node.status}</Badge>
            </div>
          </div>
        );
      })}
    </div>
  );
}
