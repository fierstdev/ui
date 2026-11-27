import { scope, type Ctx } from '@fierst/aster';

const segScope = scope`
  :scope {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    padding: 3px;
    border-radius: var(--aster-radius-control);
    background: var(--aster-surface-muted);
    border: 1px solid var(--aster-border);
    font-family: var(--aster-font-sans);
    max-width: 100%;
    overflow-x: auto;
    scrollbar-width: none;
  }
  :scope::-webkit-scrollbar { display: none; }
  :scope.is-full { display: flex; width: 100%; }
  :scope.is-full .seg-btn { flex: 1; }
  .seg-btn {
    height: calc(var(--aster-control-sm) - 2px);
    padding: 0 0.75rem;
    border: none;
    border-radius: calc(var(--aster-radius-control) - 2px);
    background: transparent;
    color: var(--aster-on-surface-muted);
    font: inherit;
    font-size: 0.8125rem;
    font-weight: 500;
    cursor: pointer;
    white-space: nowrap;
    touch-action: manipulation;
    transition: background-color var(--aster-dur-fast), color var(--aster-dur-fast), box-shadow var(--aster-dur-fast);
  }
  .seg-btn:hover:not(:disabled) { color: var(--aster-on-surface); }
  .seg-btn:focus-visible { outline: none; box-shadow: var(--aster-focus-ring); }
  .seg-btn.is-active {
    background: var(--aster-surface);
    color: var(--aster-on-surface);
    box-shadow: var(--aster-shadow-xs);
  }
  .seg-btn:disabled { opacity: 0.45; cursor: not-allowed; }
`;

export function* SegmentedControl(
  props: {
    options: readonly { value: string; label: string; disabled?: boolean }[];
    value?: string;
    defaultValue?: string;
    fullWidth?: boolean;
    label?: string;
    onChange?: (val: string) => void;
    class?: string;
  },
  ctx: Ctx,
) {
  let internal = props.defaultValue ?? props.options.find((opt) => !opt.disabled)?.value ?? '';

  for (props of ctx) {
    const isControlled = props.value !== undefined;
    const current = isControlled ? props.value! : internal;

    const enabled = props.options.filter((opt) => !opt.disabled);
    const tabStop = enabled.find((opt) => opt.value === current) ?? enabled[0];

    const choose = (val: string) => {
      if (!isControlled) internal = val;
      props.onChange?.(val);
    };

    yield (
      <div
        role="radiogroup"
        aria-label={props.label ?? 'Options'}
        class={[segScope, props.fullWidth ? 'is-full' : '', props.class].filter(Boolean).join(' ')}
      >
        {props.options.map((opt) => {
          const active = opt.value === current;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={active}
              tabIndex={tabStop === opt ? 0 : -1}
              onKeyDown={(e: KeyboardEvent) => {
                const direction = ['ArrowLeft', 'ArrowUp'].includes(e.key)
                  ? -1
                  : ['ArrowRight', 'ArrowDown'].includes(e.key)
                    ? 1
                    : 0;
                if (!direction || !enabled.length) return;
                e.preventDefault();
                const next = (enabled.indexOf(opt) + direction + enabled.length) % enabled.length;
                const group = (e.currentTarget as HTMLElement).parentElement;
                group?.querySelectorAll<HTMLButtonElement>('button:enabled')[next]?.focus();
                choose(enabled[next].value);
              }}
              disabled={opt.disabled}
              class="seg-btn"
              class:is-active={active}
              onClick={() => !opt.disabled && choose(opt.value)}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    );
  }
}
