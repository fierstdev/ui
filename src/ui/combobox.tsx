import { Check, Plus } from '@lucide/icons';
import { scope, type Ctx } from '@fierst/aster';
import { Icon } from './icon.tsx';

const cbScope = scope`
  :scope {
    position: relative;
    display: grid;
    gap: 0.375rem;
    font-family: var(--aster-font-sans);
  }
  .cb-label { font-size: 0.84rem; font-weight: 500; color: var(--aster-on-surface); }
  .cb-input {
    width: 100%;
    min-height: var(--aster-control-md);
    padding: 0 0.75rem;
    border-radius: var(--aster-radius-control);
    border: 1px solid var(--aster-input-border);
    background: var(--aster-surface);
    color: var(--aster-on-surface);
    box-shadow: var(--aster-shadow-xs);
    font: inherit;
    font-size: 1rem;
    outline: none;
    transition: border-color var(--aster-dur-fast), box-shadow var(--aster-dur-fast);
  }
  @media (min-width: 640px) { .cb-input { font-size: 0.875rem; } }
  .cb-input:focus { border-color: var(--aster-primary); box-shadow: var(--aster-focus-ring); }
  .cb-menu {
    position: absolute;
    z-index: 45;
    top: calc(100% + 4px);
    left: 0;
    right: 0;
    max-height: 220px;
    overflow-y: auto;
    padding: 0.3rem;
    border-radius: var(--aster-radius-md);
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .cb-opt {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    padding: 0.45rem 0.6rem;
    border: none;
    border-radius: var(--aster-radius-xs);
    background: transparent;
    color: var(--aster-on-surface);
    font: inherit;
    font-size: 0.85rem;
    cursor: pointer;
    text-align: left;
  }
  .cb-opt:hover,
  .cb-opt.is-hi { background: var(--aster-surface-muted); }
  .cb-create { color: var(--aster-primary); font-weight: 500; }
`;

let cbSeq = 0;

export function* Combobox(
  props: {
    label?: string;
    options: readonly string[];
    value?: string;
    defaultValue?: string;
    placeholder?: string;
    creatable?: boolean;
    onChange?: (value: string) => void;
    class?: string;
  },
  ctx: Ctx,
) {
  const uid = `aster-cb-${++cbSeq}`;
  let internal = props.defaultValue ?? '';
  let query = props.value ?? props.defaultValue ?? '';
  let open = false;
  let hiIdx = 0;

  for (props of ctx) {
    const isControlled = props.value !== undefined;
    const current = isControlled ? props.value! : internal;
    const q = query.trim().toLowerCase();
    const matches = q
      ? props.options.filter((o) => o.toLowerCase().includes(q))
      : [...props.options];
    const canCreate = Boolean(
      props.creatable && query.trim() && !props.options.some((o) => o.toLowerCase() === q),
    );
    const total = matches.length + (canCreate ? 1 : 0);
    if (hiIdx >= total) hiIdx = Math.max(0, total - 1);

    const pick = (val: string) => {
      if (!isControlled) internal = val;
      query = val;
      open = false;
      props.onChange?.(val);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        open = true;
        if (total > 0) hiIdx = (hiIdx + 1) % total;
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (total > 0) hiIdx = (hiIdx - 1 + total) % total;
      } else if (e.key === 'Escape') {
        open = false;
      } else if (e.key === 'Enter' && open) {
        e.preventDefault();
        if (hiIdx < matches.length) pick(matches[hiIdx]);
        else if (canCreate) pick(query.trim());
      }
    };

    yield (
      <div class={[cbScope, props.class].filter(Boolean).join(' ')}>
        {props.label ? (
          <label class="cb-label" for={uid}>
            {props.label}
          </label>
        ) : null}
        <input
          id={uid}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={`${uid}-list`}
          autocomplete="off"
          class="cb-input"
          placeholder={props.placeholder ?? 'Search or type…'}
          bind:value={query}
          onFocus={() => (open = true)}
          onBlur={() =>
            setTimeout(() => {
              open = false;
              ctx.refresh();
            }, 130)
          }
          onKeyDown={onKeyDown}
        />
        {open && total > 0 ? (
          <div id={`${uid}-list`} role="listbox" class="aster-surface-popover cb-menu">
            {matches.map((opt, idx) => (
              <button
                key={opt}
                type="button"
                role="option"
                aria-selected={opt === current}
                class="cb-opt"
                class:is-hi={idx === hiIdx}
                on:mousedown={(e: Event) => {
                  e.preventDefault();
                  pick(opt);
                }}
              >
                <span>{opt}</span>
                {opt === current ? (
                  <Icon icon={Check} size={14} color="var(--aster-primary)" />
                ) : null}
              </button>
            ))}
            {canCreate ? (
              <button
                type="button"
                role="option"
                class="cb-opt cb-create"
                class:is-hi={hiIdx === matches.length}
                on:mousedown={(e: Event) => {
                  e.preventDefault();
                  pick(query.trim());
                }}
              >
                <span style="display:inline-flex; align-items:center; gap:0.35rem">
                  <Icon icon={Plus} size={14} />
                  <span>Create "{query.trim()}"</span>
                </span>
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  }
}
