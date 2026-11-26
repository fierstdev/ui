import { X } from '@lucide/icons';
import { scope, type View } from '@fierst/aster';
import { Icon } from './icon.tsx';

const sheetScope = scope`
  :scope {
    margin: 0;
    padding: 0;
    color: var(--aster-on-surface);
    max-width: none;
    max-height: none;
    overflow: hidden;
    overscroll-behavior: contain;
    opacity: 1;
    transition:
      opacity var(--aster-dur-med) var(--aster-ease-standard),
      transform var(--aster-dur-slow) var(--aster-ease-motion),
      display var(--aster-dur-med),
      overlay var(--aster-dur-med);
    transition-behavior: allow-discrete;
  }
  :scope[open] { display: flex; flex-direction: column; }
  :scope:not([open]) { display: none; }
  :scope::backdrop {
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
  }

  :scope.side-right {
    margin-left: auto;
    height: 100dvh;
    width: 100vw;
    border-radius: 0;
    border-top: none;
    border-right: none;
    border-bottom: none;
    transform: translateX(0);
  }
  :scope.side-left {
    margin-right: auto;
    height: 100dvh;
    width: 100vw;
    border-radius: 0;
    border-top: none;
    border-left: none;
    border-bottom: none;
    transform: translateX(0);
  }
  :scope.side-bottom {
    margin: auto auto 0 auto;
    width: 100vw;
    height: fit-content;
    max-height: 85dvh;
    border-radius: var(--aster-radius-lg) var(--aster-radius-lg) 0 0;
    border-left: none;
    border-right: none;
    border-bottom: none;
    padding-bottom: var(--aster-safe-bottom);
    transform: translateY(0);
  }
  @media (min-width: 640px) {
    :scope.side-right,
    :scope.side-left {
      width: min(420px, 90vw);
    }
    :scope.side-bottom {
      width: min(560px, calc(100vw - 2rem));
      border-left: 1px solid var(--aster-border);
      border-right: 1px solid var(--aster-border);
    }
  }

  @starting-style {
    :scope.side-right[open] { opacity: 0; transform: translateX(36px); }
    :scope.side-left[open] { opacity: 0; transform: translateX(-36px); }
    :scope.side-bottom[open] { opacity: 0; transform: translateY(36px); }
  }

  .grabber {
    width: 36px;
    height: 4px;
    border-radius: 9999px;
    background: var(--aster-border-strong);
    margin: 0.6rem auto 0;
    flex-shrink: 0;
  }
  .sheet-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    padding: 1.15rem 1.25rem 0.95rem;
    border-bottom: 1px solid var(--aster-border);
    flex-shrink: 0;
  }
  .sheet-title {
    margin: 0;
    font-family: var(--aster-font-display);
    font-size: 1.05rem;
    font-weight: 600;
    letter-spacing: -0.015em;
  }
  .sheet-desc {
    margin: 0.2rem 0 0;
    font-size: 0.85rem;
    color: var(--aster-on-surface-muted);
  }
  .sheet-close {
    width: 32px;
    height: 32px;
    border-radius: var(--aster-radius-sm);
    border: none;
    background: transparent;
    color: var(--aster-on-surface-muted);
    display: inline-grid;
    place-items: center;
    cursor: pointer;
    flex-shrink: 0;
    transition: background-color var(--aster-dur-fast), color var(--aster-dur-fast);
  }
  .sheet-close:hover { background: var(--aster-surface-muted); color: var(--aster-on-surface); }
  .sheet-body {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .sheet-body > * { flex-shrink: 0; }
  .sheet-footer {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
    gap: 0.5rem;
    padding: 0.9rem 1.25rem calc(0.9rem + var(--aster-safe-bottom));
    background: var(--aster-surface-muted);
    border-top: 1px solid var(--aster-border);
    flex-shrink: 0;
  }
`;

export type SheetSide = 'right' | 'left' | 'bottom';

export function Sheet({
  id,
  open,
  side = 'right',
  title,
  description,
  footer,
  onClose,
  class: extraClass,
  children,
}: {
  id?: string;
  open?: any;
  side?: SheetSide;
  title?: string;
  description?: string;
  footer?: View;
  onClose?: () => void;
  class?: string;
  children?: View;
}) {
  let dialogEl: HTMLDialogElement | null = null;

  const getOpen = () =>
    Array.isArray(open)
      ? Boolean(open[0]?.())
      : typeof open === 'function'
        ? Boolean(open())
        : Boolean(open);

  const setOpen = (v: boolean) => {
    if (Array.isArray(open)) open[1]?.(v);
    else open?.set?.(v);
  };

  const closeSheet = () => {
    setOpen(false);
    dialogEl?.close?.();
  };

  const onBackdropClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeSheet();
    }
  };

  return (
    <dialog
      id={id}
      ref={(el: Element) => {
        dialogEl = el as HTMLDialogElement;
      }}
      bind:open={[getOpen, setOpen]}
      closedby="any"
      onClick={onBackdropClick}
      onClose={onClose}
      class={['aster-surface-popover', sheetScope, `side-${side}`, extraClass]
        .filter(Boolean)
        .join(' ')}
    >
      {side === 'bottom' ? <div class="grabber" aria-hidden="true" /> : null}
      {title || description ? (
        <header class="sheet-header">
          <div>
            {title ? <h3 class="sheet-title">{title}</h3> : null}
            {description ? <p class="sheet-desc">{description}</p> : null}
          </div>
          <button type="button" class="sheet-close" aria-label="Close sheet" onClick={closeSheet}>
            <Icon icon={X} size={16} />
          </button>
        </header>
      ) : null}
      <div class="sheet-body">{children}</div>
      {footer ? <footer class="sheet-footer">{footer}</footer> : null}
    </dialog>
  );
}
