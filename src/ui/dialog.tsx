import { X } from '@lucide/icons';
import { scope, type View } from '@fierst/aster';
import { Button } from './button.tsx';
import { Icon } from './icon.tsx';

const dialogScope = scope`
  :scope {
    padding: 0;
    margin: auto auto calc(0.75rem + var(--aster-safe-bottom));
    border-radius: var(--aster-radius-lg);
    color: var(--aster-on-surface);
    width: calc(100vw - 1.5rem);
    max-width: 480px;
    height: auto;
    max-height: calc(100dvh - 2rem);
    overflow: hidden;
    overscroll-behavior: contain;
    opacity: 1;
    transform: translateY(0) scale(1);
    transition:
      opacity var(--aster-dur-med) var(--aster-ease-standard),
      transform var(--aster-dur-med) var(--aster-ease-motion),
      display var(--aster-dur-med),
      overlay var(--aster-dur-med);
    transition-behavior: allow-discrete;
  }
  :scope[open] {
    display: flex;
    flex-direction: column;
  }
  :scope:not([open]) { display: none; }
  @media (min-width: 640px) {
    :scope { margin: auto; }
  }
  @starting-style {
    :scope[open] {
      opacity: 0;
      transform: translateY(6px) scale(0.97);
    }
  }
  :scope::backdrop {
    background: rgba(0, 0, 0, 0.52);
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
    overscroll-behavior: contain;
  }
  .dlg-header {
    flex: 0 0 auto;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    padding: 1.25rem 1.35rem 1rem;
    border-bottom: 1px solid var(--aster-border);
  }
  .dlg-title {
    margin: 0;
    font-family: var(--aster-font-display);
    font-size: 1.05rem;
    font-weight: 600;
    letter-spacing: -0.015em;
  }
  .dlg-desc {
    margin: 0.25rem 0 0;
    font-size: 0.85rem;
    color: var(--aster-on-surface-muted);
  }
  .dlg-close {
    width: 30px;
    height: 30px;
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
  .dlg-close:hover { background: var(--aster-surface-muted); color: var(--aster-on-surface); }
  .dlg-close:focus-visible { outline: none; box-shadow: var(--aster-focus-ring); }
  .dlg-body {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
    padding: 1.15rem 1.35rem;
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
  }
  .dlg-body > * { flex-shrink: 0; }
  .dlg-footer {
    flex: 0 0 auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 0.5rem;
    padding: 0.9rem 1.35rem;
    background: var(--aster-surface-muted);
    border-top: 1px solid var(--aster-border);
  }
`;

export function Dialog({
  id,
  open,
  title,
  description,
  footer,
  showClose = true,
  onClose,
  class: extraClass,
  children,
}: {
  id?: string;
  open?: any;
  title?: string;
  description?: string;
  footer?: View;
  showClose?: boolean;
  onClose?: () => void;
  class?: string;
  children?: View;
}) {
  const closeDialog = (el?: HTMLDialogElement | null) => {
    if (Array.isArray(open)) open[1]?.(false);
    else open?.set?.(false);
    el?.close?.();
  };

  const onBackdropClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeDialog(e.currentTarget as HTMLDialogElement);
    }
  };

  return (
    <dialog
      id={id}
      bind:open={open}
      closedby="any"
      onClick={onBackdropClick}
      onClose={onClose}
      class={['aster-surface-popover', dialogScope, extraClass].filter(Boolean).join(' ')}
    >
      {title || description ? (
        <header class="dlg-header">
          <div>
            {title ? <h3 class="dlg-title">{title}</h3> : null}
            {description ? <p class="dlg-desc">{description}</p> : null}
          </div>
          {showClose ? (
            <button
              type="button"
              class="dlg-close"
              aria-label="Close dialog"
              onClick={(e: MouseEvent) =>
                closeDialog((e.currentTarget as HTMLElement).closest('dialog'))
              }
            >
              <Icon icon={X} size={15} />
            </button>
          ) : null}
        </header>
      ) : null}
      {children ? <div class="dlg-body">{children}</div> : null}
      {footer ? <footer class="dlg-footer">{footer}</footer> : null}
    </dialog>
  );
}

export interface ConfirmDialogOptions {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
}

/**
 * Aster-native `yield*` Confirmation Modal Flow.
 */
export function* confirmDialog(opts: ConfirmDialogOptions): Generator<View, boolean, any> {
  let decision: boolean | null = null;
  let isOpen = true;

  const choose = (val: boolean) => {
    isOpen = false;
    decision = val;
  };

  while (decision === null) {
    yield (
      <Dialog
        open={[
          () => isOpen,
          (v: boolean) => {
            isOpen = v;
            if (!v && decision === null) decision = false;
          },
        ]}
        title={opts.title}
        description={opts.description}
        showClose={false}
        footer={
          <>
            <Button variant="outline" onClick={() => choose(false)}>
              {opts.cancelLabel ?? 'Cancel'}
            </Button>
            <Button variant={opts.danger ? 'destructive' : 'primary'} onClick={() => choose(true)}>
              {opts.confirmLabel ?? 'Confirm'}
            </Button>
          </>
        }
      />
    );
  }

  return decision;
}
