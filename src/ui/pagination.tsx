import { ChevronLeft, ChevronRight } from '@lucide/icons';
import { scope, type Ctx } from '@fierst/aster';
import { Icon } from './icon.tsx';

const pagScope = scope`
  :scope {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    flex-wrap: wrap;
    font-family: var(--aster-font-sans);
  }
  .pages {
    display: none;
    align-items: center;
    gap: 0.25rem;
  }
  .mobile-summary {
    font-size: 0.85rem;
    color: var(--aster-on-surface-variant);
    font-family: var(--aster-font-mono);
  }
  @media (min-width: 640px) {
    .pages { display: inline-flex; }
    .mobile-summary { display: none; }
  }

  .pg-btn {
    min-width: var(--aster-control-sm);
    min-height: var(--aster-control-sm);
    padding: 0 0.65rem;
    border-radius: var(--aster-radius-control);
    border: 1px solid var(--aster-outline-variant);
    background: var(--aster-surface);
    color: var(--aster-on-surface);
    font: inherit;
    font-size: 0.85rem;
    font-weight: 550;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.3rem;
    cursor: pointer;
    touch-action: manipulation;
    transition:
      background var(--aster-dur-fast) var(--aster-ease-standard),
      border-color var(--aster-dur-fast) var(--aster-ease-standard),
      border-radius var(--aster-dur-fast) var(--aster-ease-motion);
  }
  .pg-btn:hover:not(:disabled) {
    background: var(--aster-surface-low);
    border-color: var(--aster-outline);
  }
  .pg-btn:focus-visible { outline: none; box-shadow: var(--aster-focus-ring); }
  .pg-btn:disabled { opacity: 0.42; cursor: not-allowed; }
  .pg-btn.is-current {
    background: var(--aster-primary);
    color: var(--aster-on-primary);
    border-color: var(--aster-primary);
  }
  .ellipsis {
    padding: 0 0.35rem;
    color: var(--aster-on-surface-variant);
    user-select: none;
  }
`;

function buildPageRange(current: number, total: number, siblings = 1): (number | 'ellipsis')[] {
  if (total <= 5 + siblings * 2) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const left = Math.max(2, current - siblings);
  const right = Math.min(total - 1, current + siblings);
  const out: (number | 'ellipsis')[] = [1];
  if (left > 2) out.push('ellipsis');
  for (let p = left; p <= right; p++) out.push(p);
  if (right < total - 1) out.push('ellipsis');
  out.push(total);
  return out;
}

export function* Pagination(
  props: {
    page?: number;
    defaultPage?: number;
    totalPages: number;
    siblings?: number;
    onChange?: (page: number) => void;
    class?: string;
  },
  ctx: Ctx,
) {
  let internal = props.defaultPage ?? 1;

  for (props of ctx) {
    const total = Math.max(1, props.totalPages);
    const isControlled = props.page !== undefined;
    const current = Math.max(1, Math.min(total, isControlled ? props.page! : internal));

    const goTo = (next: number) => {
      const clamped = Math.max(1, Math.min(total, next));
      if (clamped === current) return;
      if (!isControlled) internal = clamped;
      props.onChange?.(clamped);
    };

    const tokens = buildPageRange(current, total, props.siblings ?? 1);

    yield (
      <nav aria-label="Pagination" class={[pagScope, props.class].filter(Boolean).join(' ')}>
        <button
          type="button"
          class="pg-btn"
          disabled={current <= 1}
          onClick={() => goTo(current - 1)}
        >
          <Icon icon={ChevronLeft} size={15} />
          <span>Prev</span>
        </button>

        <span class="mobile-summary" aria-live="polite">
          Page {current} / {total}
        </span>

        <div class="pages">
          {tokens.map((tok, idx) =>
            tok === 'ellipsis' ? (
              <span key={`e-${idx}`} class="ellipsis" aria-hidden="true">
                …
              </span>
            ) : (
              <button
                key={tok}
                type="button"
                class="pg-btn"
                class:is-current={tok === current}
                aria-current={tok === current ? 'page' : undefined}
                onClick={() => goTo(tok)}
              >
                {tok}
              </button>
            ),
          )}
        </div>

        <button
          type="button"
          class="pg-btn"
          disabled={current >= total}
          onClick={() => goTo(current + 1)}
        >
          <span>Next</span>
          <Icon icon={ChevronRight} size={15} />
        </button>
      </nav>
    );
  }
}
