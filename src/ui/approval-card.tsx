import { ShieldCheck } from '@lucide/icons';
import { scope, signal, type View } from '@fierst/aster';
import { Badge } from './badge.tsx';
import { Button } from './button.tsx';
import { Icon } from './icon.tsx';

const apScope = scope`
  :scope {
    border-radius: var(--aster-radius-lg);
    border: 1px solid var(--aster-primary-border);
    background: var(--aster-surface);
    box-shadow: var(--aster-shadow-sm);
    font-family: var(--aster-font-sans);
    overflow: hidden;
  }
  .ap-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0.95rem 1.1rem;
    background: var(--aster-primary-subtle);
    border-bottom: 1px solid var(--aster-primary-border);
  }
  .ap-title-row { display: flex; align-items: center; gap: 0.45rem; color: var(--aster-on-primary-subtle); font-weight: 600; font-size: 0.92rem; }
  .ap-desc { margin: 0.2rem 0 0; font-size: 0.8125rem; color: var(--aster-on-primary-subtle); opacity: 0.85; }
  .ap-body { padding: 1rem 1.1rem; display: grid; gap: 0.75rem; }
  .ap-code {
    margin: 0;
    padding: 0.75rem 0.9rem;
    border-radius: var(--aster-radius-md);
    border: 1px solid var(--aster-border);
    background: var(--aster-surface-muted);
    font-family: var(--aster-font-mono);
    font-size: 0.78rem;
    overflow-x: auto;
    color: var(--aster-on-surface);
  }
  .ap-meta { display: flex; flex-wrap: wrap; gap: 0.45rem; font-family: var(--aster-font-mono); font-size: 0.72rem; color: var(--aster-on-surface-subtle); }
  .ap-foot {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 0.5rem;
    padding: 0.8rem 1.1rem;
    background: var(--aster-surface-muted);
    border-top: 1px solid var(--aster-border);
  }
`;

export function ApprovalCard({
  title,
  description,
  assigneeRole,
  artifactHash,
  codePreview,
  danger = false,
  approveLabel = 'Approve & Resume',
  rejectLabel = 'Reject',
  onApprove,
  onReject,
  class: extraClass,
}: {
  title: string;
  description?: string;
  assigneeRole?: string;
  artifactHash?: string;
  codePreview?: string;
  danger?: boolean;
  approveLabel?: string;
  rejectLabel?: string;
  onApprove: () => void;
  onReject: () => void;
  class?: string;
}) {
  return (
    <section
      role="region"
      aria-label={title}
      class={[apScope, extraClass].filter(Boolean).join(' ')}
    >
      <header class="ap-head">
        <div>
          <div class="ap-title-row">
            <Icon icon={ShieldCheck} size={16} />
            <span>{title}</span>
          </div>
          {description ? <p class="ap-desc">{description}</p> : null}
        </div>
        {assigneeRole ? <Badge tone="primary">{assigneeRole}</Badge> : null}
      </header>
      <div class="ap-body">
        {codePreview ? (
          <pre class="ap-code" tabIndex={0}>
            <code>{codePreview}</code>
          </pre>
        ) : null}
        {artifactHash ? (
          <div class="ap-meta">
            <span>SHA-256: {artifactHash.slice(0, 16)}…</span>
          </div>
        ) : null}
      </div>
      <footer class="ap-foot">
        <Button size="sm" variant="outline" onClick={onReject}>
          {rejectLabel}
        </Button>
        <Button size="sm" variant={danger ? 'destructive' : 'primary'} onClick={onApprove}>
          {approveLabel}
        </Button>
      </footer>
    </section>
  );
}

/**
 * Aster-native `yield*` Inline Approval Checkpoint Flow (pairs directly with `@fierst/flow`).
 */
export function* requestApproval(opts: {
  title: string;
  description?: string;
  assigneeRole?: string;
  artifactHash?: string;
  codePreview?: string;
  danger?: boolean;
}): Generator<View, boolean, any> {
  const decided = signal<boolean | null>(null);
  while (decided() === null) {
    yield (
      <ApprovalCard
        {...opts}
        onApprove={() => decided.set(true)}
        onReject={() => decided.set(false)}
      />
    );
  }
  return decided()!;
}
