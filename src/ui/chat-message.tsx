import { Bot, User } from '@lucide/icons';
import { scope, type View } from '@fierst/aster';
import { Icon } from './icon.tsx';

const msgScope = scope`
  :scope {
    display: flex;
    align-items: flex-start;
    gap: 0.7rem;
    font-family: var(--aster-font-sans);
  }
  :scope.role-user { flex-direction: row-reverse; }
  .cm-avatar {
    width: 30px;
    height: 30px;
    border-radius: var(--aster-radius-badge);
    border: 1px solid var(--aster-border);
    background: var(--aster-surface-muted);
    color: var(--aster-on-surface);
    display: inline-grid;
    place-items: center;
    flex-shrink: 0;
  }
  :scope.role-assistant .cm-avatar {
    background: var(--aster-primary-subtle);
    border-color: var(--aster-primary-border);
    color: var(--aster-on-primary-subtle);
  }
  .cm-col { display: grid; gap: 0.25rem; max-width: min(640px, 85%); min-width: 0; }
  :scope.role-user .cm-col { justify-items: end; }
  .cm-meta { display: flex; align-items: center; gap: 0.45rem; font-size: 0.74rem; color: var(--aster-on-surface-subtle); }
  .cm-author { font-weight: 600; color: var(--aster-on-surface-muted); }
  .cm-bubble {
    padding: 0.7rem 0.9rem;
    border-radius: var(--aster-radius-lg);
    border: 1px solid var(--aster-border);
    background: var(--aster-surface);
    color: var(--aster-on-surface);
    font-size: 0.875rem;
    line-height: 1.55;
    box-shadow: var(--aster-shadow-xs);
  }
  :scope.role-user .cm-bubble {
    background: var(--aster-primary);
    color: var(--aster-on-primary);
    border-color: transparent;
  }
  :scope.role-system .cm-bubble {
    background: var(--aster-surface-muted);
    color: var(--aster-on-surface-muted);
    font-size: 0.8125rem;
  }
  .cm-actions { display: flex; align-items: center; gap: 0.35rem; margin-top: 0.1rem; }
`;

const listScope = scope`
  :scope { display: flex; flex-direction: column; gap: 1rem; }
`;

export function ChatMessage({
  role = 'assistant',
  author,
  timestamp,
  actions,
  class: extraClass,
  children,
}: {
  role?: 'user' | 'assistant' | 'system';
  author?: string;
  timestamp?: string;
  actions?: View;
  class?: string;
  children?: View;
}) {
  return (
    <div class={[msgScope, `role-${role}`, extraClass].filter(Boolean).join(' ')}>
      <span class="cm-avatar" aria-hidden="true">
        <Icon icon={role === 'user' ? User : Bot} size={15} />
      </span>
      <div class="cm-col">
        <div class="cm-meta">
          <span class="cm-author">
            {author ?? (role === 'user' ? 'You' : role === 'system' ? 'System' : 'Assistant')}
          </span>
          {timestamp ? <span>{timestamp}</span> : null}
        </div>
        <div class="cm-bubble">{children}</div>
        {actions ? <div class="cm-actions">{actions}</div> : null}
      </div>
    </div>
  );
}

export function ChatList(props: { class?: string; children?: View }) {
  return (
    <div role="log" aria-live="polite" class={[listScope, props.class].filter(Boolean).join(' ')}>
      {props.children}
    </div>
  );
}
