import { navigateMenu } from './theme.ts';
import { scope, type Ctx, type View } from '@fierst/aster';

const cmScope = scope`
  :scope { display: block; }
  .cm-panel {
    position: fixed;
    z-index: 60;
    min-width: 196px;
    max-width: calc(100vw - 1.5rem);
    padding: 0.35rem;
    border-radius: var(--aster-radius-md);
    display: grid;
    gap: 2px;
  }
  .cm-item {
    width: 100%;
    min-height: 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.4rem 0.65rem;
    border: none;
    border-radius: var(--aster-radius-xs);
    background: transparent;
    color: var(--aster-on-surface);
    font-family: var(--aster-font-sans);
    font-size: 0.85rem;
    font-weight: 500;
    cursor: pointer;
    text-align: left;
    transition: background-color var(--aster-dur-fast);
  }
  .cm-item:hover:not(:disabled) { background: var(--aster-surface-muted); }
  .cm-item:disabled { opacity: 0.45; cursor: not-allowed; }
  .cm-item.is-danger { color: var(--aster-danger); }
  .cm-item.is-danger:hover:not(:disabled) { background: var(--aster-danger-subtle); color: var(--aster-on-danger-subtle); }
  .cm-kbd { font-family: var(--aster-font-mono); font-size: 0.72rem; color: var(--aster-on-surface-subtle); }
  .cm-sep { height: 1px; background: var(--aster-border); margin: 0.25rem 0.35rem; }
`;

export interface ContextMenuItem {
  id: string;
  label: string;
  shortcut?: string;
  danger?: boolean;
  disabled?: boolean;
  separatorBefore?: boolean;
  onSelect: () => void;
}

export function* ContextMenu(
  props: {
    items: readonly ContextMenuItem[];
    class?: string;
    children?: View;
  },
  ctx: Ctx,
) {
  let open = false;
  let root: HTMLElement | null = null;
  let x = 0;
  let y = 0;

  if (typeof window !== 'undefined') {
    const dismiss = () => {
      if (open) {
        open = false;
        ctx.refresh();
      }
    };
    window.addEventListener('pointerdown', dismiss, { signal: ctx.signal });
    window.addEventListener(
      'keydown',
      (e: KeyboardEvent) => {
        if (open && e.key === 'Escape') {
          dismiss();
          root?.focus();
        }
      },
      { signal: ctx.signal },
    );
    window.addEventListener('scroll', dismiss, {
      capture: true,
      passive: true,
      signal: ctx.signal,
    });
  }

  for (props of ctx) {
    const onContext = (e: Event) => {
      e.preventDefault();
      const vw = typeof window !== 'undefined' ? window.innerWidth : 1024;
      const vh = typeof window !== 'undefined' ? window.innerHeight : 768;
      x = Math.max(8, Math.min((e as MouseEvent).clientX, vw - 220));
      y = Math.max(8, Math.min((e as MouseEvent).clientY, vh - 240));
      open = true;
      queueMicrotask(() =>
        root?.querySelector<HTMLButtonElement>('[role="menuitem"]:enabled')?.focus(),
      );
    };

    yield (
      <div
        class={[cmScope, props.class].filter(Boolean).join(' ')}
        ref={(el: HTMLElement) => (root = el)}
        tabIndex={0}
        on:contextmenu={onContext}
        onKeyDown={(e: KeyboardEvent) => {
          if (e.key === 'ContextMenu' || (e.shiftKey && e.key === 'F10')) {
            e.preventDefault();
            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
            x = Math.max(8, Math.min(rect.left, window.innerWidth - 220));
            y = Math.max(8, Math.min(rect.bottom, window.innerHeight - 240));
            open = true;
            queueMicrotask(() =>
              root?.querySelector<HTMLButtonElement>('[role="menuitem"]:enabled')?.focus(),
            );
          }
        }}
      >
        {props.children}
        {open ? (
          <div
            role="menu"
            aria-label="Actions"
            onKeyDown={navigateMenu}
            class="aster-surface-popover cm-panel"
            style={{ left: `${x}px`, top: `${y}px` }}
            on:pointerdown={(e: Event) => e.stopPropagation()}
          >
            {props.items.map((item) => (
              <div key={item.id}>
                {item.separatorBefore ? <div class="cm-sep" role="separator" /> : null}
                <button
                  type="button"
                  role="menuitem"
                  disabled={item.disabled}
                  class="cm-item"
                  class:is-danger={Boolean(item.danger)}
                  onClick={() => {
                    open = false;
                    root?.focus();
                    item.onSelect();
                  }}
                >
                  <span>{item.label}</span>
                  {item.shortcut ? <span class="cm-kbd">{item.shortcut}</span> : null}
                </button>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    );
  }
}
