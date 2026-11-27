import { scope, type Ctx, type View } from '@fierst/aster';

const hcScope = scope`
  :scope {
    position: relative;
    display: inline-flex;
    align-items: center;
  }
  .hc-card {
    position: absolute;
    z-index: 50;
    left: 0;
    top: calc(100% + 8px);
    width: min(300px, calc(100vw - 2rem));
    padding: 0.9rem;
    border-radius: var(--aster-radius-lg);
    font-family: var(--aster-font-sans);
    opacity: 0;
    transform: translateY(-4px) scale(0.98);
    pointer-events: none;
    transition:
      opacity var(--aster-dur-fast) var(--aster-ease-standard),
      transform var(--aster-dur-fast) var(--aster-ease-motion);
  }
  .hc-card.side-top {
    top: auto;
    bottom: calc(100% + 8px);
    transform: translateY(4px) scale(0.98);
  }
  .hc-card.align-end { left: auto; right: 0; }
  .hc-card.is-open {
    opacity: 1;
    transform: translateY(0) scale(1);
    pointer-events: auto;
  }
`;

export function* HoverCard(
  props: {
    label?: string;
    trigger: View;
    side?: 'bottom' | 'top';
    align?: 'start' | 'end';
    openDelay?: number;
    closeDelay?: number;
    class?: string;
    children?: View;
  },
  ctx: Ctx,
) {
  let open = false;
  let openTimer: ReturnType<typeof setTimeout> | null = null;
  let closeTimer: ReturnType<typeof setTimeout> | null = null;

  const clearAll = () => {
    if (openTimer) {
      clearTimeout(openTimer);
      openTimer = null;
    }
    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }
  };

  const scheduleOpen = () => {
    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }
    if (open || openTimer) return;
    openTimer = setTimeout(() => {
      openTimer = null;
      open = true;
      ctx.refresh();
    }, props.openDelay ?? 180);
  };

  const scheduleClose = () => {
    if (openTimer) {
      clearTimeout(openTimer);
      openTimer = null;
    }
    if (closeTimer) clearTimeout(closeTimer);
    closeTimer = setTimeout(() => {
      open = false;
      ctx.refresh();
    }, props.closeDelay ?? 140);
  };

  try {
    for (props of ctx) {
      yield (
        <span
          class={[hcScope, props.class].filter(Boolean).join(' ')}
          on:pointerenter={scheduleOpen}
          on:pointerleave={scheduleClose}
          on:focusin={scheduleOpen}
          on:focusout={scheduleClose}
          onKeyDown={(e: KeyboardEvent) => {
            if (e.key === 'Escape') {
              clearAll();
              open = false;
            }
          }}
        >
          {props.trigger}
          <div
            role="dialog"
            aria-label={props.label ?? 'Details'}
            class={[
              'aster-surface-popover',
              'hc-card',
              props.side === 'top' ? 'side-top' : '',
              props.align === 'end' ? 'align-end' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            class:is-open={open}
          >
            {props.children}
          </div>
        </span>
      );
    }
  } finally {
    clearAll();
  }
}
