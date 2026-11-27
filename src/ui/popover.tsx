import { ChevronDown } from '@lucide/icons';
import { scope, type View } from '@fierst/aster';
import { Button, type ButtonVariant } from './button.tsx';
import { Icon } from './icon.tsx';
import { navigateMenu, positionPopover } from './theme.ts';

const popScope = scope`
  :scope {
    position: fixed;
    inset: auto;
    margin: 0;
    padding: 0.45rem;
    border-radius: var(--aster-radius-md);
    color: var(--aster-on-surface);
    min-width: 210px;
    max-width: calc(100vw - 1.5rem);
    height: auto;
    overflow-y: auto;
    overscroll-behavior: contain;
    opacity: 1;
    transform: translateY(0) scale(1);
    transition:
      opacity var(--aster-dur-fast) var(--aster-ease-standard),
      transform var(--aster-dur-fast) var(--aster-ease-motion),
      display var(--aster-dur-fast),
      overlay var(--aster-dur-fast);
    transition-behavior: allow-discrete;
  }
  :scope:not(:popover-open) { display: none; }
  @starting-style {
    :scope:popover-open {
      opacity: 0;
      transform: translateY(-4px) scale(0.97);
    }
  }
  .menu-item {
    width: 100%;
    min-height: var(--aster-control-sm);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.5rem 0.7rem;
    border: none;
    border-radius: var(--aster-radius-xs);
    background: transparent;
    color: var(--aster-on-surface);
    font-family: var(--aster-font-sans);
    font-size: 0.88rem;
    font-weight: 500;
    cursor: pointer;
    text-align: left;
    transition: background var(--aster-dur-fast) var(--aster-ease-standard);
  }
  .menu-item:hover { background: var(--aster-surface-muted); color: var(--aster-on-surface); }
  .menu-item.is-danger { color: var(--aster-danger); }
  .menu-item.is-danger:hover { background: var(--aster-danger-subtle); color: var(--aster-on-danger-subtle); }
  .shortcut { font-family: var(--aster-font-mono); font-size: 0.74rem; opacity: 0.65; }
  .sep { height: 1px; background: var(--aster-outline-variant); margin: 0.35rem 0.4rem; }
`;

export function Popover({
  id,
  mode = 'auto',
  align = 'start',
  onToggle,
  class: extraClass,
  children,
}: {
  id: string;
  mode?: 'auto' | 'manual';
  align?: 'start' | 'end';
  onToggle?: (e: any) => void;
  class?: string;
  children?: View;
}) {
  const handleToggle = (e: any) => {
    if (e.newState === 'open') {
      const pop = e.currentTarget as HTMLElement;
      const trigger =
        (e.source as HTMLElement | null) ??
        document.querySelector<HTMLElement>(`[popovertarget="${CSS.escape(id)}"]`);
      if (trigger) {
        positionPopover(trigger, pop, { align });
      }
    }
    onToggle?.(e);
  };

  return (
    <div
      id={id}
      popover={mode}
      on:toggle={handleToggle}
      class={['aster-surface-popover', popScope, extraClass].filter(Boolean).join(' ')}
    >
      {children}
    </div>
  );
}

export interface MenuItem {
  id: string;
  label: string;
  shortcut?: string;
  danger?: boolean;
  separatorBefore?: boolean;
  onSelect: () => void;
}

let menuSeq = 0;

export function DropdownMenu({
  label,
  variant = 'outline',
  align = 'start',
  items,
}: {
  label: string;
  variant?: ButtonVariant;
  align?: 'start' | 'end';
  items: readonly MenuItem[];
}) {
  const uid = `aster-menu-${++menuSeq}`;
  const trigId = `${uid}-btn`;
  const popId = `${uid}-pop`;

  const onToggle = (e: any) => {
    if (e.newState === 'open') {
      const trig = document.getElementById(trigId);
      const pop = document.getElementById(popId);
      positionPopover(trig, pop, { align });
      pop?.querySelector<HTMLButtonElement>('[role="menuitem"]:enabled')?.focus();
    }
  };

  const invoke = (item: MenuItem) => {
    const el = document.getElementById(popId) as any;
    el?.hidePopover?.();
    item.onSelect();
  };

  return (
    <div style="display:inline-block">
      <Button id={trigId} variant={variant} popovertarget={popId} aria-haspopup="menu">
        <span>{label}</span>
        <Icon icon={ChevronDown} size={15} />
      </Button>
      <Popover id={popId} align={align} onToggle={onToggle}>
        <div role="menu" aria-label={label} onKeyDown={navigateMenu}>
          {items.map((item) => (
            <div key={item.id}>
              {item.separatorBefore ? <div class="sep" role="separator" /> : null}
              <button
                type="button"
                role="menuitem"
                class="menu-item"
                class:is-danger={Boolean(item.danger)}
                onClick={() => invoke(item)}
              >
                <span>{item.label}</span>
                {item.shortcut ? <span class="shortcut">{item.shortcut}</span> : null}
              </button>
            </div>
          ))}
        </div>
      </Popover>
    </div>
  );
}
