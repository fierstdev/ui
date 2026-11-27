import { GripVertical } from '@lucide/icons';
import { scope, type Ctx, type View } from '@fierst/aster';
import { Icon } from './icon.tsx';

const resScope = scope`
  :scope {
    display: flex;
    width: 100%;
    min-height: 200px;
    border: 1px solid var(--aster-border);
    border-radius: var(--aster-radius-lg);
    background: var(--aster-surface);
    overflow: hidden;
    font-family: var(--aster-font-sans);
  }
  :scope.dir-vertical { flex-direction: column; }
  .pane {
    min-width: 0;
    min-height: 0;
    overflow: auto;
    padding: 1rem;
  }
  .handle {
    position: relative;
    flex: 0 0 auto;
    width: 9px;
    background: var(--aster-border);
    background-clip: content-box;
    padding: 0 4px;
    cursor: col-resize;
    display: grid;
    place-items: center;
    touch-action: none;
    user-select: none;
    transition: background-color var(--aster-dur-fast);
  }
  :scope.dir-vertical .handle {
    width: auto;
    height: 9px;
    padding: 4px 0;
    cursor: row-resize;
  }
  .handle:hover,
  .handle.is-dragging { background-color: var(--aster-primary); }
  .handle:focus-visible { outline: none; background-color: var(--aster-primary); box-shadow: var(--aster-focus-ring); }
  .grip {
    width: 18px;
    height: 24px;
    border-radius: var(--aster-radius-xs);
    border: 1px solid var(--aster-border);
    background: var(--aster-surface);
    color: var(--aster-on-surface-subtle);
    display: inline-grid;
    place-items: center;
    box-shadow: var(--aster-shadow-xs);
    pointer-events: none;
  }
  :scope.dir-vertical .grip { transform: rotate(90deg); }

  @media (max-width: 639px) {
    :scope.dir-horizontal.stack-mobile {
      flex-direction: column;
      height: auto !important;
    }
    :scope.dir-horizontal.stack-mobile > .pane {
      flex: none !important;
      width: 100% !important;
      max-height: 260px;
    }
    :scope.dir-horizontal.stack-mobile > .handle {
      width: 100%;
      height: 1px;
      padding: 0;
      cursor: default;
      pointer-events: none;
    }
    :scope.dir-horizontal.stack-mobile > .handle .grip {
      display: none;
    }
  }
`;

export function* ResizableSplit(
  props: {
    direction?: 'horizontal' | 'vertical';
    defaultSplit?: number;
    min?: number;
    max?: number;
    height?: string;
    /** Automatically stack horizontal panes vertically on mobile (< 640px). Default: true. */
    stackOnMobile?: boolean;
    first: View;
    second: View;
    onResize?: (pct: number) => void;
    class?: string;
  },
  ctx: Ctx,
) {
  let split = props.defaultSplit ?? 50;
  let dragging = false;
  let rootEl: HTMLDivElement | null = null;

  for (props of ctx) {
    const dir = props.direction ?? 'horizontal';
    const min = props.min ?? 20;
    const max = props.max ?? 80;
    split = Math.max(min, Math.min(max, split));
    const stackOnMobile = props.stackOnMobile ?? true;

    const updateSplit = (next: number) => {
      const clamped = Math.max(min, Math.min(max, Math.round(next)));
      if (clamped !== split) {
        split = clamped;
        props.onResize?.(clamped);
        ctx.refresh();
      }
    };

    const onPointerDown = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      target.setPointerCapture?.((e as PointerEvent).pointerId);
      dragging = true;
      ctx.refresh();

      const onMove = (ev: Event) => {
        if (!rootEl) return;
        const rect = rootEl.getBoundingClientRect();
        if (!(dir === 'horizontal' ? rect.width : rect.height)) return;
        const ratio =
          dir === 'horizontal'
            ? (((ev as MouseEvent).clientX - rect.left) / rect.width) * 100
            : (((ev as MouseEvent).clientY - rect.top) / rect.height) * 100;
        updateSplit(ratio);
      };
      const onUp = () => {
        dragging = false;
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        window.removeEventListener('pointercancel', onUp);
        ctx.refresh();
      };
      window.addEventListener('pointermove', onMove, { signal: ctx.signal });
      window.addEventListener('pointerup', onUp, { signal: ctx.signal });
      window.addEventListener('pointercancel', onUp, { signal: ctx.signal });
    };

    const onKeyDown = (e: Event) => {
      const decKey = dir === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';
      const incKey = dir === 'horizontal' ? 'ArrowRight' : 'ArrowDown';
      if ((e as KeyboardEvent).key === decKey) {
        e.preventDefault();
        updateSplit(split - 5);
      } else if ((e as KeyboardEvent).key === incKey) {
        e.preventDefault();
        updateSplit(split + 5);
      } else if ((e as KeyboardEvent).key === 'Home') {
        e.preventDefault();
        updateSplit(min);
      } else if ((e as KeyboardEvent).key === 'End') {
        e.preventDefault();
        updateSplit(max);
      }
    };

    yield (
      <div
        ref={(el: HTMLDivElement) => (rootEl = el)}
        class={[
          resScope,
          dir === 'vertical' ? 'dir-vertical' : 'dir-horizontal',
          stackOnMobile ? 'stack-mobile' : '',
          props.class,
        ]
          .filter(Boolean)
          .join(' ')}
        style={props.height ? { height: props.height } : undefined}
      >
        <div class="pane" style={{ flex: `0 0 ${split}%` }}>
          {props.first}
        </div>
        <div
          role="separator"
          tabIndex={0}
          aria-orientation={dir === 'horizontal' ? 'vertical' : 'horizontal'}
          aria-valuenow={split}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-label="Resize panels"
          class="handle"
          class:is-dragging={dragging}
          on:pointerdown={onPointerDown}
          onKeyDown={onKeyDown}
        >
          <span class="grip" aria-hidden="true">
            <Icon icon={GripVertical} size={12} />
          </span>
        </div>
        <div class="pane" style={{ flex: '1 1 0%' }}>
          {props.second}
        </div>
      </div>
    );
  }
}
