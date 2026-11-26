import { ChevronDown, Wrench } from '@lucide/icons';
import { scope } from '@fierst/aster';
import { Badge, type BadgeTone } from './badge.tsx';
import { Icon } from './icon.tsx';

const tcScope = scope`
  :scope {
    border-radius: var(--aster-radius-md);
    border: 1px solid var(--aster-border);
    background: var(--aster-surface);
    font-family: var(--aster-font-sans);
    overflow: hidden;
  }
  summary {
    list-style: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.6rem;
    padding: 0.6rem 0.85rem;
    cursor: pointer;
    user-select: none;
  }
  summary::-webkit-details-marker { display: none; }
  summary:hover { background: var(--aster-surface-muted); }
  .tc-left { display: inline-flex; align-items: center; gap: 0.5rem; min-width: 0; }
  .tc-name { font-family: var(--aster-font-mono); font-size: 0.8125rem; font-weight: 600; color: var(--aster-on-surface); }
  .tc-right { display: inline-flex; align-items: center; gap: 0.45rem; }
  .tc-chev { color: var(--aster-on-surface-subtle); display: inline-flex; transition: transform var(--aster-dur-fast); }
  :scope[open] .tc-chev { transform: rotate(180deg); }
  .tc-body {
    border-top: 1px solid var(--aster-border);
    padding: 0.7rem 0.85rem;
    display: grid;
    gap: 0.6rem;
    background: var(--aster-surface-muted);
  }
  .tc-sec-lbl { font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--aster-on-surface-subtle); margin-bottom: 0.2rem; display: block; }
  pre {
    margin: 0;
    padding: 0.55rem 0.7rem;
    border-radius: var(--aster-radius-xs);
    border: 1px solid var(--aster-border);
    background: var(--aster-surface);
    font-family: var(--aster-font-mono);
    font-size: 0.76rem;
    overflow-x: auto;
    color: var(--aster-on-surface);
  }
`;

const STATUS_TONE: Record<string, BadgeTone> = {
  running: 'primary',
  waiting: 'warning',
  success: 'success',
  error: 'danger',
  replayed: 'neutral',
};

export function ToolCallCard({
  toolName,
  status = 'success',
  durationMs,
  args,
  result,
  defaultOpen = false,
  class: extraClass,
}: {
  toolName: string;
  status?: 'running' | 'waiting' | 'success' | 'error' | 'replayed';
  durationMs?: number;
  args?: unknown;
  result?: unknown;
  defaultOpen?: boolean;
  class?: string;
}) {
  return (
    <details class={[tcScope, extraClass].filter(Boolean).join(' ')} open={defaultOpen}>
      <summary>
        <span class="tc-left">
          <Icon icon={Wrench} size={14} />
          <span class="tc-name">{toolName}</span>
        </span>
        <span class="tc-right">
          {durationMs !== undefined ? (
            <span style="font-family:var(--aster-font-mono); font-size:0.72rem; color:var(--aster-on-surface-subtle)">
              {durationMs}ms
            </span>
          ) : null}
          <Badge dot tone={STATUS_TONE[status] ?? 'neutral'}>
            {status}
          </Badge>
          <span class="tc-chev" aria-hidden="true">
            <Icon icon={ChevronDown} size={14} />
          </span>
        </span>
      </summary>
      <div class="tc-body">
        {args !== undefined ? (
          <div>
            <span class="tc-sec-lbl">Arguments</span>
            <pre>{typeof args === 'string' ? args : JSON.stringify(args, null, 2)}</pre>
          </div>
        ) : null}
        {result !== undefined ? (
          <div>
            <span class="tc-sec-lbl">Output</span>
            <pre>{typeof result === 'string' ? result : JSON.stringify(result, null, 2)}</pre>
          </div>
        ) : null}
      </div>
    </details>
  );
}
