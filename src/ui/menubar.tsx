import './theme.css';
import { navigateMenu } from './theme';
import { scope, type Ctx } from '@fierst/aster';

const mbScope = scope`
  :scope {
    display: inline-flex;
    align-items: center;
    gap: 0.2rem;
    padding: 3px;
    border-radius: var(--aster-radius-control);
    border: 1px solid var(--aster-border);
    background: var(--aster-surface);
    box-shadow: var(--aster-shadow-xs);
    font-family: var(--aster-font-sans);
    max-width: 100%;
    overflow-x: auto;
    scrollbar-width: none;
  }
  :scope::-webkit-scrollbar { display: none; }
  .mb-group { position: relative; }
  .mb-trigger {
    height: 30px;
    padding: 0 0.65rem;
    border: none;
    border-radius: calc(var(--aster-radius-control) - 2px);
    background: transparent;
    color: var(--aster-on-surface);
    font: inherit;
    font-size: 0.84rem;
    font-weight: 500;
    cursor: pointer;
    white-space: nowrap;
    transition: background-color var(--aster-dur-fast);
  }
  .mb-trigger:hover,
  .mb-trigger.is-open { background: var(--aster-surface-muted); }
  .mb-trigger:focus-visible { outline: none; box-shadow: var(--aster-focus-ring); }
  .mb-menu {
    position: absolute;
    z-index: 55;
    top: calc(100% + 6px);
    left: 0;
    min-width: 196px;
    padding: 0.35rem;
    border-radius: var(--aster-radius-md);
    display: grid;
    gap: 2px;
  }
  .mb-item {
    width: 100%;
    min-height: 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.38rem 0.6rem;
    border: none;
    border-radius: var(--aster-radius-xs);
    background: transparent;
    color: var(--aster-on-surface);
    font: inherit;
    font-size: 0.84rem;
    cursor: pointer;
    text-align: left;
  }
  .mb-item:hover:not(:disabled) { background: var(--aster-surface-muted); }
  .mb-item:disabled { opacity: 0.45; cursor: not-allowed; }
  .mb-kbd { font-family: var(--aster-font-mono); font-size: 0.72rem; color: var(--aster-on-surface-subtle); }
  .mb-sep { height: 1px; background: var(--aster-border); margin: 0.25rem 0.3rem; }
`;

export interface MenubarMenu {
  id: string;
  label: string;
  items: readonly {
    id: string;
    label: string;
    shortcut?: string;
    disabled?: boolean;
    separatorBefore?: boolean;
    onSelect: () => void;
  }[];
}

export function* Menubar(
  props: {
    menus: readonly MenubarMenu[];
    label?: string;
    class?: string;
  },
  ctx: Ctx,
) {
  let openId: string | null = null;

  if (typeof window !== 'undefined') {
    const close = () => {
      if (openId !== null) {
        openId = null;
        ctx.refresh();
      }
    };
    window.addEventListener('pointerdown', close, { signal: ctx.signal });
    window.addEventListener(
      'keydown',
      (e: KeyboardEvent) => {
        if (openId !== null && e.key === 'Escape') {
          (
            document.activeElement
              ?.closest('.mb-group')
              ?.querySelector('.mb-trigger') as HTMLElement | null
          )?.focus();
          close();
        }
      },
      { signal: ctx.signal },
    );
  }

  for (props of ctx) {
    yield (
      <div
        role="menubar"
        aria-label={props.label ?? 'Application menu'}
        class={[mbScope, props.class].filter(Boolean).join(' ')}
        on:pointerdown={(e: Event) => e.stopPropagation()}
      >
        {props.menus.map((menu) => {
          const isOpen = openId === menu.id;
          return (
            <div key={menu.id} class="mb-group">
              <button
                type="button"
                role="menuitem"
                aria-haspopup="menu"
                aria-expanded={isOpen}
                class="mb-trigger"
                class:is-open={isOpen}
                onClick={() => (openId = isOpen ? null : menu.id)}
                onKeyDown={(e: KeyboardEvent) => {
                  const trigger = e.currentTarget as HTMLButtonElement;
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    openId = menu.id;
                    queueMicrotask(() =>
                      trigger.parentElement
                        ?.querySelector<HTMLButtonElement>('.mb-item:enabled')
                        ?.focus(),
                    );
                  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                    e.preventDefault();
                    const triggers = Array.from(
                      trigger
                        .closest('[role="menubar"]')!
                        .querySelectorAll<HTMLButtonElement>('.mb-trigger'),
                    );
                    const next =
                      (triggers.indexOf(trigger) +
                        (e.key === 'ArrowRight' ? 1 : -1) +
                        triggers.length) %
                      triggers.length;
                    openId = null;
                    triggers[next].focus();
                  }
                }}
                onMouseEnter={() => {
                  if (openId !== null && openId !== menu.id) openId = menu.id;
                }}
              >
                {menu.label}
              </button>
              {isOpen ? (
                <div
                  role="menu"
                  aria-label={menu.label}
                  onKeyDown={navigateMenu}
                  class="aster-surface-popover mb-menu"
                >
                  {menu.items.map((item) => (
                    <div key={item.id}>
                      {item.separatorBefore ? <div class="mb-sep" role="separator" /> : null}
                      <button
                        type="button"
                        role="menuitem"
                        disabled={item.disabled}
                        class="mb-item"
                        onClick={() => {
                          openId = null;
                          item.onSelect();
                        }}
                      >
                        <span>{item.label}</span>
                        {item.shortcut ? <span class="mb-kbd">{item.shortcut}</span> : null}
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    );
  }
}
