import { scope, type Ctx, type View } from '@fierst/aster';

const tipScope = scope`
  :scope {
    position: relative;
    display: inline-flex;
    align-items: center;
  }
  .tip-bubble {
    position: absolute;
    z-index: 50;
    left: 50%;
    bottom: calc(100% + 6px);
    transform: translateX(-50%) translateY(3px) scale(0.97);
    opacity: 0;
    pointer-events: none;
    width: max-content;
    max-width: min(260px, calc(100vw - 2rem));
    text-align: center;
    padding: 0.32rem 0.62rem;
    border-radius: var(--aster-radius-sm);
    background: var(--aster-inverted-bg);
    color: var(--aster-inverted-fg);
    box-shadow: var(--aster-shadow-md);
    font-family: var(--aster-font-sans);
    font-size: 0.75rem;
    font-weight: 500;
    transition:
      opacity var(--aster-dur-fast) var(--aster-ease-standard),
      transform var(--aster-dur-fast) var(--aster-ease-motion);
  }
  .tip-bubble.align-start { left: 0; transform: translateY(3px) scale(0.97); }
  .tip-bubble.align-end { left: auto; right: 0; transform: translateY(3px) scale(0.97); }
  .tip-bubble.side-bottom { bottom: auto; top: calc(100% + 6px); transform: translateX(-50%) translateY(-3px) scale(0.97); }
  .tip-bubble.side-bottom.align-start { transform: translateY(-3px) scale(0.97); }
  .tip-bubble.side-bottom.align-end { transform: translateY(-3px) scale(0.97); }
  .tip-bubble.is-open { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
  .tip-bubble.align-start.is-open,
  .tip-bubble.align-end.is-open { transform: translateY(0) scale(1); }
  @media (hover: none) { .tip-bubble { display: none; } }
`;

let tipSeq = 0;

export function* Tooltip(
  props: {
    content: string;
    side?: 'top' | 'bottom';
    align?: 'center' | 'start' | 'end';
    delay?: number;
    class?: string;
    children?: View;
  },
  ctx: Ctx,
) {
  const tipId = `aster-tip-${++tipSeq}`;
  let open = false;
  let timer: ReturnType<typeof setTimeout> | null = null;

  const clearTimer = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };

  const show = (e?: Event) => {
    if ((e as PointerEvent)?.pointerType === 'touch') return;
    clearTimer();
    const wait = props.delay ?? 160;
    if (wait <= 0) {
      open = true;
      ctx.refresh();
      return;
    }
    timer = setTimeout(() => {
      open = true;
      ctx.refresh();
    }, wait);
  };

  const hide = () => {
    clearTimer();
    if (open) {
      open = false;
      ctx.refresh();
    }
  };

  try {
    for (props of ctx) {
      const alignCls =
        props.align === 'start' ? 'align-start' : props.align === 'end' ? 'align-end' : '';
      yield (
        <span
          class={[tipScope, props.class].filter(Boolean).join(' ')}
          aria-describedby={open ? tipId : undefined}
          on:pointerenter={show}
          on:pointerleave={hide}
          onFocus={show}
          onBlur={hide}
          onKeyDown={(e: KeyboardEvent) => {
            if (e.key === 'Escape') hide();
          }}
        >
          {props.children}
          <span
            id={tipId}
            role="tooltip"
            class={['tip-bubble', props.side === 'bottom' ? 'side-bottom' : '', alignCls]
              .filter(Boolean)
              .join(' ')}
            class:is-open={open}
          >
            {props.content}
          </span>
        </span>
      );
    }
  } finally {
    clearTimer();
  }
}
