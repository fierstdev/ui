import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from '@lucide/icons';
import { scope, type Ctx, type View } from '@fierst/aster';
import { Icon } from './icon.tsx';

const alertScope = scope`
  :scope {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 0.9rem 1.05rem;
    border-radius: var(--aster-radius-md);
    border: 1px solid var(--aster-outline-variant);
    background: var(--aster-surface-low);
    color: var(--aster-on-surface);
    font-family: var(--aster-font-sans);
    transition: border-radius var(--aster-dur-fast) var(--aster-ease-motion);
  }
  :scope.tone-info {
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
  :scope.is-banner {
    border-radius: 0;
    border-left: none;
    border-right: none;
    align-items: center;
    padding: 0.7rem 1rem;
  }
  .lead-icon {
    margin-top: 2px;
    display: inline-flex;
    flex-shrink: 0;
  }
  .body {
    flex: 1;
    min-width: 0;
    display: grid;
    gap: 0.2rem;
  }
  .title {
    margin: 0;
    font-size: 0.92rem;
    font-weight: 650;
    letter-spacing: -0.01em;
  }
  .desc {
    margin: 0;
    font-size: 0.85rem;
    opacity: 0.9;
    line-height: 1.45;
  }
  .actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
    margin-top: 0.35rem;
  }
  .dismiss {
    border: none;
    background: transparent;
    color: currentColor;
    opacity: 0.7;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: var(--aster-radius-xs);
    display: inline-grid;
    place-items: center;
    flex-shrink: 0;
    touch-action: manipulation;
  }
  .dismiss:hover { opacity: 1; background: rgba(0, 0, 0, 0.06); }
`;

export type AlertTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

const TONE_ICONS = {
  neutral: Info,
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: AlertCircle,
};

export function* Alert(
  props: {
    tone?: AlertTone;
    title?: string;
    description?: string;
    action?: View;
    dismissible?: boolean;
    banner?: boolean;
    onDismiss?: () => void;
    class?: string;
    children?: View;
  },
  ctx: Ctx,
) {
  let dismissed = false;

  for (props of ctx) {
    if (dismissed) {
      yield null;
      continue;
    }

    const tone = props.tone ?? 'neutral';
    const role = tone === 'danger' || tone === 'warning' ? 'alert' : 'status';

    yield (
      <div
        role={role}
        class={[alertScope, `tone-${tone}`, props.banner ? 'is-banner' : '', props.class]
          .filter(Boolean)
          .join(' ')}
      >
        <span class="lead-icon" aria-hidden="true">
          <Icon icon={TONE_ICONS[tone]} size={18} />
        </span>
        <div class="body">
          {props.title ? <p class="title">{props.title}</p> : null}
          {props.description ? <p class="desc">{props.description}</p> : null}
          {props.children ? <div class="desc">{props.children}</div> : null}
          {props.action ? <div class="actions">{props.action}</div> : null}
        </div>
        {props.dismissible ? (
          <button
            type="button"
            class="dismiss"
            aria-label="Dismiss notification"
            onClick={() => {
              dismissed = true;
              props.onDismiss?.();
            }}
          >
            <Icon icon={X} size={16} />
          </button>
        ) : null}
      </div>
    );
  }
}

export function Banner(props: {
  tone?: AlertTone;
  title?: string;
  description?: string;
  action?: View;
  dismissible?: boolean;
  onDismiss?: () => void;
  class?: string;
  children?: View;
}) {
  return <Alert {...props} banner />;
}
