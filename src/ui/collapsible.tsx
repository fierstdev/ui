import './theme.css';
import { ChevronsUpDown } from '@lucide/icons';
import { scope, type Ctx, type View } from '@fierst/aster';
import { Icon } from './icon';

const colScope = scope`
  :scope {
    display: grid;
    gap: 0.5rem;
    font-family: var(--aster-font-sans);
  }
  .col-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
  }
  .col-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--aster-on-surface);
  }
  .col-toggle {
    width: 32px;
    height: 32px;
    border-radius: var(--aster-radius-control);
    border: 1px solid var(--aster-border);
    background: var(--aster-surface);
    color: var(--aster-on-surface-muted);
    display: inline-grid;
    place-items: center;
    cursor: pointer;
    touch-action: manipulation;
    transition: background-color var(--aster-dur-fast), color var(--aster-dur-fast);
  }
  .col-toggle:hover { background: var(--aster-surface-muted); color: var(--aster-on-surface); }
  .col-toggle:focus-visible { outline: none; box-shadow: var(--aster-focus-ring); }
  .col-body {
    display: grid;
    gap: 0.5rem;
  }
`;

let colSeq = 0;

export function* Collapsible(
  props: {
    title?: string;
    open?: boolean;
    defaultOpen?: boolean;
    preview?: View;
    onOpenChange?: (open: boolean) => void;
    class?: string;
    children?: View;
  },
  ctx: Ctx,
) {
  const panelId = `aster-col-${++colSeq}`;
  let internalOpen = props.defaultOpen ?? false;

  for (props of ctx) {
    const isControlled = props.open !== undefined;
    const isOpen = isControlled ? Boolean(props.open) : internalOpen;

    const toggle = () => {
      const next = !isOpen;
      if (!isControlled) internalOpen = next;
      props.onOpenChange?.(next);
    };

    yield (
      <div class={[colScope, props.class].filter(Boolean).join(' ')}>
        <div class="col-head">
          {props.title ? <span class="col-title">{props.title}</span> : <span />}
          <button
            type="button"
            class="col-toggle"
            aria-expanded={isOpen}
            aria-controls={panelId}
            aria-label={isOpen ? 'Collapse section' : 'Expand section'}
            onClick={toggle}
          >
            <Icon icon={ChevronsUpDown} size={15} />
          </button>
        </div>
        {props.preview ?? null}
        {isOpen ? (
          <div id={panelId} class="col-body">
            {props.children}
          </div>
        ) : null}
      </div>
    );
  }
}
