import { LoaderCircle, Search, X } from '@lucide/icons';
import { scope, type Ctx } from '@fierst/aster';
import { Icon } from './icon.tsx';

const srchScope = scope`
  :scope {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    min-height: var(--aster-control-md);
    padding: 0 0.55rem 0 0.7rem;
    border-radius: var(--aster-radius-control);
    border: 1px solid var(--aster-input-border);
    background: var(--aster-surface);
    box-shadow: var(--aster-shadow-xs);
    font-family: var(--aster-font-sans);
    transition: border-color var(--aster-dur-fast), box-shadow var(--aster-dur-fast);
  }
  :scope:focus-within { border-color: var(--aster-primary); box-shadow: var(--aster-focus-ring); }
  .lead { color: var(--aster-on-surface-subtle); display: inline-flex; flex-shrink: 0; }
  input {
    flex: 1;
    min-width: 0;
    border: none;
    outline: none;
    background: transparent;
    color: var(--aster-on-surface);
    font: inherit;
    font-size: 1rem;
  }
  @media (min-width: 640px) { input { font-size: 0.875rem; } }
  input::placeholder { color: var(--aster-on-surface-subtle); }
  .clr-btn {
    width: 24px;
    height: 24px;
    border: none;
    border-radius: var(--aster-radius-xs);
    background: transparent;
    color: var(--aster-on-surface-muted);
    display: inline-grid;
    place-items: center;
    cursor: pointer;
  }
  .clr-btn:hover { background: var(--aster-surface-muted); color: var(--aster-on-surface); }
  .kbd-hint {
    font-family: var(--aster-font-mono);
    font-size: 0.7rem;
    padding: 0.1rem 0.35rem;
    border-radius: var(--aster-radius-xs);
    border: 1px solid var(--aster-border);
    background: var(--aster-surface-muted);
    color: var(--aster-on-surface-subtle);
  }
`;

export function* SearchInput(
  props: {
    value?: string;
    defaultValue?: string;
    placeholder?: string;
    loading?: boolean;
    shortcutHint?: string;
    onChange?: (val: string) => void;
    onSubmit?: (val: string) => void;
    class?: string;
  },
  ctx: Ctx,
) {
  let internal = props.defaultValue ?? '';

  for (props of ctx) {
    const isControlled = props.value !== undefined;
    const current = isControlled ? props.value! : internal;

    const setVal = (v: string) => {
      if (!isControlled) internal = v;
      props.onChange?.(v);
    };

    yield (
      <div class={[srchScope, props.class].filter(Boolean).join(' ')}>
        <span class="lead" aria-hidden="true">
          {props.loading ? (
            <Icon icon={LoaderCircle} size={15} spin />
          ) : (
            <Icon icon={Search} size={15} />
          )}
        </span>
        <input
          type="search"
          aria-label={props.placeholder ?? 'Search'}
          placeholder={props.placeholder ?? 'Search…'}
          value={current}
          onInput={(e: Event) => setVal((e.target as HTMLInputElement).value)}
          onKeyDown={(e: KeyboardEvent) => {
            if (e.key === 'Enter') props.onSubmit?.(current);
            else if (e.key === 'Escape' && current) setVal('');
          }}
        />
        {current ? (
          <button
            type="button"
            class="clr-btn"
            aria-label="Clear search"
            onClick={() => setVal('')}
          >
            <Icon icon={X} size={13} />
          </button>
        ) : props.shortcutHint ? (
          <span class="kbd-hint">{props.shortcutHint}</span>
        ) : null}
      </div>
    );
  }
}
