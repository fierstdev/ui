import { Star } from '@lucide/icons';
import { scope, type Ctx } from '@fierst/aster';
import { Icon } from './icon.tsx';

const rateScope = scope`
  :scope {
    display: inline-flex;
    align-items: center;
    gap: 0.2rem;
    font-family: var(--aster-font-sans);
  }
  .star-btn {
    border: none;
    background: transparent;
    padding: 0.18rem;
    border-radius: var(--aster-radius-xs);
    color: var(--aster-border-strong);
    display: inline-grid;
    place-items: center;
    cursor: pointer;
    touch-action: manipulation;
    transition: transform var(--aster-dur-fast) var(--aster-ease-motion), color var(--aster-dur-fast);
  }
  .star-btn:hover:not(:disabled) { transform: scale(1.12); }
  .star-btn:focus-visible { outline: none; box-shadow: var(--aster-focus-ring); }
  .star-btn:disabled { cursor: default; }
  .star-btn.is-filled { color: var(--aster-warning); }
  .star-btn.is-filled svg { fill: currentColor; }
  .rate-text {
    margin-left: 0.35rem;
    font-size: 0.8rem;
    font-family: var(--aster-font-mono);
    color: var(--aster-on-surface-muted);
  }
`;

export function* Rating(
  props: {
    value?: number;
    defaultValue?: number;
    max?: number;
    size?: number;
    readOnly?: boolean;
    showValue?: boolean;
    label?: string;
    onChange?: (rating: number) => void;
    class?: string;
  },
  ctx: Ctx,
) {
  let internal = props.defaultValue ?? 0;
  let hovered = 0;

  for (props of ctx) {
    const max = Math.max(1, Math.trunc(props.max ?? 5));
    const isControlled = props.value !== undefined;
    const current = Math.max(0, Math.min(max, Math.round(isControlled ? props.value! : internal)));
    const display = hovered || current;

    const select = (n: number) => {
      if (props.readOnly) return;
      if (!isControlled) internal = n;
      props.onChange?.(n);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (props.readOnly) return;
      const focusRating = (next: number) => {
        select(next);
        (e.currentTarget as HTMLElement).querySelectorAll('button')[next - 1]?.focus();
      };
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        e.preventDefault();
        focusRating(current >= max ? 1 : current + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        e.preventDefault();
        focusRating(current <= 1 ? max : current - 1);
      }
    };

    yield (
      <div
        role="radiogroup"
        aria-label={props.label ?? 'Rating'}
        class={[rateScope, props.class].filter(Boolean).join(' ')}
        on:pointerleave={() => (hovered = 0)}
        onKeyDown={onKeyDown}
      >
        {Array.from({ length: max }, (_, idx) => {
          const n = idx + 1;
          return (
            <button
              key={n}
              type="button"
              role="radio"
              tabIndex={n === (current || 1) ? 0 : -1}
              aria-checked={n === current}
              aria-label={`${n} of ${max} stars`}
              disabled={props.readOnly}
              class="star-btn"
              class:is-filled={n <= display}
              on:pointerenter={() => !props.readOnly && (hovered = n)}
              onClick={() => select(n)}
            >
              <Icon icon={Star} size={props.size ?? 18} />
            </button>
          );
        })}
        {props.showValue ? (
          <span class="rate-text">
            {current}/{max}
          </span>
        ) : null}
      </div>
    );
  }
}
