import './theme.css';
import { Check, Pencil, X } from '@lucide/icons';
import { scope, type Ctx } from '@fierst/aster';
import { Icon } from './icon';

const ieScope = scope`
  :scope { display: inline-flex; align-items: center; gap: 0.35rem; font-family: var(--aster-font-sans); max-width: 100%; }
  .ie-view {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.25rem 0.5rem;
    border: 1px solid transparent;
    border-radius: var(--aster-radius-sm);
    background: transparent;
    color: var(--aster-on-surface);
    font: inherit;
    font-weight: 500;
    cursor: pointer;
    transition: background-color var(--aster-dur-fast), border-color var(--aster-dur-fast);
  }
  .ie-view:hover { background: var(--aster-surface-muted); border-color: var(--aster-border); }
  .ie-pen { color: var(--aster-on-surface-subtle); opacity: 0.7; display: inline-flex; }
  .ie-input {
    height: 30px;
    padding: 0 0.55rem;
    border-radius: var(--aster-radius-sm);
    border: 1px solid var(--aster-primary);
    box-shadow: var(--aster-focus-ring);
    background: var(--aster-surface);
    color: var(--aster-on-surface);
    font: inherit;
    font-size: 0.875rem;
    outline: none;
  }
  .ie-btn {
    width: 28px;
    height: 28px;
    border-radius: var(--aster-radius-sm);
    border: 1px solid var(--aster-border);
    background: var(--aster-surface);
    color: var(--aster-on-surface);
    display: inline-grid;
    place-items: center;
    cursor: pointer;
  }
  .ie-btn.save { background: var(--aster-primary); color: var(--aster-on-primary); border-color: var(--aster-primary); }
`;

export function* InlineEdit(
  props: {
    value?: string;
    defaultValue?: string;
    placeholder?: string;
    onSave?: (next: string) => void;
    class?: string;
  },
  ctx: Ctx,
) {
  let internal = props.defaultValue ?? '';
  let editing = false;
  let root: HTMLElement | null = null;
  let draft = '';

  for (props of ctx) {
    const isControlled = props.value !== undefined;
    const current = isControlled ? props.value! : internal;

    const start = () => {
      draft = current;
      editing = true;
      queueMicrotask(() => root?.querySelector('input')?.focus());
    };
    const commit = () => {
      const next = draft.trim();
      if (next) {
        if (!isControlled) internal = next;
        props.onSave?.(next);
      }
      editing = false;
      queueMicrotask(() => root?.querySelector<HTMLButtonElement>('.ie-view')?.focus());
    };
    const cancel = () => {
      editing = false;
      queueMicrotask(() => root?.querySelector<HTMLButtonElement>('.ie-view')?.focus());
    };

    yield (
      <span
        ref={(el: HTMLElement) => (root = el)}
        class={[ieScope, props.class].filter(Boolean).join(' ')}
      >
        {editing ? (
          <>
            <input
              type="text"
              class="ie-input"
              aria-label={props.placeholder ?? 'Edit value'}
              bind:value={draft}
              onKeyDown={(e: KeyboardEvent) => {
                if (e.key === 'Enter' && !e.isComposing) {
                  e.preventDefault();
                  commit();
                } else if (e.key === 'Escape') cancel();
              }}
            />
            <button type="button" class="ie-btn save" aria-label="Save" onClick={commit}>
              <Icon icon={Check} size={13} />
            </button>
            <button type="button" class="ie-btn" aria-label="Cancel" onClick={cancel}>
              <Icon icon={X} size={13} />
            </button>
          </>
        ) : (
          <button type="button" class="ie-view" onClick={start}>
            <span>{current || (props.placeholder ?? 'Click to edit')}</span>
            <span class="ie-pen" aria-hidden="true">
              <Icon icon={Pencil} size={13} />
            </span>
          </button>
        )}
      </span>
    );
  }
}
