import { scope, type View } from '@fierst/aster';

const badgeScope = scope`
  :scope {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.15rem 0.55rem;
    border-radius: var(--aster-radius-badge);
    font-family: var(--aster-font-sans);
    font-size: 0.75rem;
    font-weight: 500;
    line-height: 1.35;
    border: 1px solid transparent;
    white-space: nowrap;
  }
  :scope.tone-neutral {
    background: var(--aster-surface-muted);
    color: var(--aster-on-surface-muted);
    border-color: var(--aster-border);
  }
  :scope.tone-primary {
    background: var(--aster-primary-subtle);
    color: var(--aster-on-primary-subtle);
    border-color: var(--aster-primary-border);
  }
  :scope.tone-success {
    background: var(--aster-success-subtle);
    color: var(--aster-on-success-subtle);
    border-color: var(--aster-success-border);
  }
  :scope.tone-warning {
    background: var(--aster-warning-subtle);
    color: var(--aster-on-warning-subtle);
    border-color: var(--aster-warning-border);
  }
  :scope.tone-danger {
    background: var(--aster-danger-subtle);
    color: var(--aster-on-danger-subtle);
    border-color: var(--aster-danger-border);
  }
  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
  }
`;

export type BadgeTone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger';

export function Badge({
  tone = 'neutral',
  dot = false,
  class: extraClass,
  children,
  ...rest
}: {
  tone?: BadgeTone;
  dot?: boolean;
  class?: string;
  children?: View;
  [key: string]: any;
}) {
  return (
    <span {...rest} class={[badgeScope, `tone-${tone}`, extraClass].filter(Boolean).join(' ')}>
      {dot ? <span class="dot" aria-hidden="true" /> : null}
      {children}
    </span>
  );
}
