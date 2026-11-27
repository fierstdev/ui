import { ArrowUp } from '@lucide/icons';
import { scope, type Ctx } from '@fierst/aster';
import { Icon } from './icon.tsx';

const bttScope = scope`
  :scope {
    position: fixed;
    right: calc(1.25rem + var(--aster-safe-right));
    bottom: calc(1.25rem + var(--aster-safe-bottom));
    z-index: 40;
    height: 38px;
    padding: 0 0.85rem;
    border-radius: 9999px;
    border: 1px solid var(--aster-border);
    background: var(--aster-surface);
    color: var(--aster-on-surface);
    box-shadow: var(--aster-shadow-md);
    font-family: var(--aster-font-sans);
    font-size: 0.8125rem;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    cursor: pointer;
    transition: transform var(--aster-dur-fast), background-color var(--aster-dur-fast);
  }
  :scope:hover { background: var(--aster-surface-muted); transform: translateY(-2px); }
  :scope:focus-visible { outline: none; box-shadow: var(--aster-focus-ring), var(--aster-shadow-md); }
`;

export function* BackToTop(
  props: {
    threshold?: number;
    label?: string;
    class?: string;
  },
  ctx: Ctx,
) {
  let visible = false;

  if (typeof window !== 'undefined') {
    const onScroll = () => {
      const next = window.scrollY > (props.threshold ?? 320);
      if (next !== visible) {
        visible = next;
        ctx.refresh();
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true, signal: ctx.signal });
  }

  for (props of ctx) {
    if (!visible) {
      yield null;
      continue;
    }
    yield (
      <button
        type="button"
        class={[bttScope, props.class].filter(Boolean).join(' ')}
        aria-label={props.label ?? 'Back to top'}
        onClick={() =>
          window.scrollTo({
            top: 0,
            behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
              ? 'instant'
              : 'smooth',
          })
        }
      >
        <Icon icon={ArrowUp} size={14} />
        <span>{props.label ?? 'Top'}</span>
      </button>
    );
  }
}
