import { Inbox } from '@lucide/icons';
import { scope, type View } from '@fierst/aster';
import { Icon, type LucideIconInput } from './icon.tsx';

const emptyScope = scope`
  :scope {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 0.55rem;
    padding: 2.25rem 1.5rem;
    border-radius: var(--aster-radius-lg);
    border: 1px dashed var(--aster-border-strong);
    background: var(--aster-surface);
    font-family: var(--aster-font-sans);
  }
  .em-icon {
    width: 44px;
    height: 44px;
    border-radius: var(--aster-radius-md);
    border: 1px solid var(--aster-border);
    background: var(--aster-surface-muted);
    color: var(--aster-on-surface-muted);
    display: inline-grid;
    place-items: center;
    margin-bottom: 0.2rem;
  }
  .em-title {
    margin: 0;
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--aster-on-surface);
  }
  .em-desc {
    margin: 0;
    font-size: 0.84rem;
    color: var(--aster-on-surface-muted);
    max-width: 42ch;
    line-height: 1.5;
  }
  .em-actions {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    flex-wrap: wrap;
    margin-top: 0.5rem;
  }
`;

export function EmptyState({
  title,
  description,
  icon = Inbox,
  action,
  class: extraClass,
}: {
  title: string;
  description?: string;
  icon?: LucideIconInput;
  action?: View;
  class?: string;
}) {
  return (
    <div class={[emptyScope, extraClass].filter(Boolean).join(' ')}>
      <span class="em-icon" aria-hidden="true">
        <Icon icon={icon} size={20} />
      </span>
      <h4 class="em-title">{title}</h4>
      {description ? <p class="em-desc">{description}</p> : null}
      {action ? <div class="em-actions">{action}</div> : null}
    </div>
  );
}
