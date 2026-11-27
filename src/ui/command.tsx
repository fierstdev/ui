import './theme.css';
import { Search, X } from '@lucide/icons';
import { scope, signal, type Ctx, type View } from '@fierst/aster';
import { Icon } from './icon';

const cmdScope = scope`
  :scope {
    padding: 0;
    margin: 0.75rem auto auto;
    width: calc(100vw - 1.5rem);
    max-width: 560px;
    border-radius: var(--aster-radius-lg);
    color: var(--aster-on-surface);
    height: fit-content;
    max-height: min(520px, calc(100dvh - 2rem));
    overflow: hidden;
    overscroll-behavior: contain;
    opacity: 1;
    transform: translateY(0) scale(1);
    transition:
      opacity var(--aster-dur-fast) var(--aster-ease-standard),
      transform var(--aster-dur-med) var(--aster-ease-motion),
      display var(--aster-dur-fast),
      overlay var(--aster-dur-fast);
    transition-behavior: allow-discrete;
  }
  :scope[open] { display: flex; flex-direction: column; }
  :scope:not([open]) { display: none; }
  @media (min-width: 640px) {
    :scope { margin: min(12vh, 110px) auto auto; }
  }
  @starting-style {
    :scope[open] {
      opacity: 0;
      transform: translateY(-8px) scale(0.97);
    }
  }
  :scope::backdrop {
    background: rgba(0, 0, 0, 0.42);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    overscroll-behavior: contain;
  }
  .cmd-search-bar {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    gap: 0.65rem;
    padding: 0.85rem 1rem;
    border-bottom: 1px solid var(--aster-outline-variant);
  }
  .cmd-icon {
    color: var(--aster-on-surface-variant);
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
  }
  .cmd-input {
    flex: 1;
    min-width: 0;
    border: none;
    outline: none;
    background: transparent;
    color: var(--aster-on-surface);
    font-family: var(--aster-font-sans);
    font-size: 1rem;
  }
  .cmd-input::placeholder { color: var(--aster-on-surface-variant); opacity: 0.75; }
  .kbd {
    font-family: var(--aster-font-mono);
    font-size: 0.72rem;
    padding: 0.14rem 0.45rem;
    border-radius: var(--aster-radius-xs);
    background: var(--aster-surface-low);
    border: 1px solid var(--aster-outline-variant);
    color: var(--aster-on-surface-variant);
    flex-shrink: 0;
  }
  .cmd-close {
    min-width: 30px;
    min-height: 30px;
    border-radius: var(--aster-radius-control);
    border: 1px solid var(--aster-outline-variant);
    background: var(--aster-surface);
    color: var(--aster-on-surface-variant);
    display: inline-grid;
    place-items: center;
    cursor: pointer;
    flex-shrink: 0;
  }
  .cmd-close:hover { background: var(--aster-surface-low); color: var(--aster-on-surface); }
  .cmd-list {
    flex: 1 1 auto;
    min-height: 0;
    max-height: min(360px, 54dvh);
    overflow-y: auto;
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
    padding: 0.45rem;
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }
  .cmd-list > * { flex-shrink: 0; }
  .cmd-group-label {
    font-size: 0.72rem;
    font-weight: 650;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--aster-on-surface-variant);
    padding: 0.45rem 0.7rem 0.2rem;
  }
  .cmd-item {
    width: 100%;
    min-height: var(--aster-control-md);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0.55rem 0.75rem;
    border: none;
    border-radius: var(--aster-radius-sm);
    background: transparent;
    color: var(--aster-on-surface);
    font-family: var(--aster-font-sans);
    font-size: 0.9rem;
    cursor: pointer;
    text-align: left;
    transition: background var(--aster-dur-fast) var(--aster-ease-standard);
  }
  .cmd-item:hover,
  .cmd-item.is-active {
    background: var(--aster-surface-muted);
    color: var(--aster-on-surface);
  }
  .cmd-item-main { display: grid; gap: 0.08rem; min-width: 0; }
  .cmd-item-label { font-weight: 550; }
  .cmd-item-hint { font-size: 0.78rem; opacity: 0.74; }
  .cmd-empty {
    padding: 2rem 1rem;
    text-align: center;
    font-size: 0.9rem;
    color: var(--aster-on-surface-variant);
  }
  .cmd-footer {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.55rem 1rem;
    border-top: 1px solid var(--aster-outline-variant);
    font-size: 0.76rem;
    color: var(--aster-on-surface-variant);
  }
`;

export interface CommandItem {
  id: string;
  label: string;
  hint?: string;
  group?: string;
  keywords?: readonly string[];
  shortcut?: string;
  onSelect?: () => void;
}

function filterCommands(items: readonly CommandItem[], query: string): CommandItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [...items];
  return items.filter((it) => {
    const hay =
      `${it.label} ${it.hint ?? ''} ${it.group ?? ''} ${(it.keywords ?? []).join(' ')}`.toLowerCase();
    return hay.includes(q);
  });
}

let cmdSeq = 0;

export function* CommandPalette(
  props: {
    items: readonly CommandItem[];
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    onSelect?: (item: CommandItem) => void;
    placeholder?: string;
    shortcut?: boolean;
    class?: string;
  },
  ctx: Ctx,
) {
  const uid = `aster-cmd-${++cmdSeq}`;
  let internalOpen = false;
  let query = '';
  let activeIdx = 0;
  let inputEl: HTMLInputElement | null = null;
  let wasOpen = false;

  if (typeof window !== 'undefined' && (props.shortcut ?? true)) {
    window.addEventListener(
      'keydown',
      (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
          e.preventDefault();
          const cur = props.open !== undefined ? props.open : internalOpen;
          const next = !cur;
          if (props.open === undefined) internalOpen = next;
          props.onOpenChange?.(next);
          if (next) {
            query = '';
            activeIdx = 0;
          }
          ctx.refresh();
        }
      },
      { signal: ctx.signal },
    );
  }

  for (props of ctx) {
    const isControlled = props.open !== undefined;
    const isOpen = isControlled ? Boolean(props.open) : internalOpen;
    if (isOpen && !wasOpen) {
      queueMicrotask(() => inputEl?.focus());
    }
    wasOpen = isOpen;

    const setOpen = (next: boolean) => {
      if (!isControlled) internalOpen = next;
      props.onOpenChange?.(next);
      if (!next) {
        query = '';
        activeIdx = 0;
      }
    };

    const matches = filterCommands(props.items, query);
    if (activeIdx >= matches.length) activeIdx = Math.max(0, matches.length - 1);
    const activeOptId = matches[activeIdx] ? `${uid}-opt-${activeIdx}` : undefined;

    const runItem = (item: CommandItem) => {
      item.onSelect?.();
      props.onSelect?.(item);
      setOpen(false);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (matches.length > 0) activeIdx = (activeIdx + 1) % matches.length;
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (matches.length > 0) activeIdx = (activeIdx - 1 + matches.length) % matches.length;
      } else if (e.key === 'Home') {
        e.preventDefault();
        activeIdx = 0;
      } else if (e.key === 'End') {
        e.preventDefault();
        activeIdx = Math.max(0, matches.length - 1);
      } else if (e.key === 'Enter' && matches[activeIdx]) {
        e.preventDefault();
        runItem(matches[activeIdx]);
      }
    };

    const onBackdropClick = (e: MouseEvent) => {
      if (e.target === e.currentTarget) {
        setOpen(false);
        (e.currentTarget as HTMLDialogElement).close?.();
      }
    };

    let lastGroup = '';

    yield (
      <dialog
        bind:open={[() => isOpen, setOpen]}
        closedby="any"
        onClick={onBackdropClick}
        aria-label="Command palette"
        class={['aster-surface-popover', cmdScope, props.class].filter(Boolean).join(' ')}
      >
        <div class="cmd-search-bar">
          <span class="cmd-icon" aria-hidden="true">
            <Icon icon={Search} size={17} />
          </span>
          <input
            ref={(el: HTMLInputElement) => (inputEl = el)}
            type="text"
            role="combobox"
            aria-expanded={isOpen}
            aria-autocomplete="list"
            class="cmd-input"
            bind:value={query}
            placeholder={props.placeholder ?? 'Type a command or search…'}
            aria-label="Search commands"
            aria-controls={`${uid}-list`}
            aria-activedescendant={activeOptId}
            onKeyDown={onKeyDown}
          />
          <button
            type="button"
            class="cmd-close"
            aria-label="Close command palette"
            onClick={(e: MouseEvent) => {
              setOpen(false);
              (e.currentTarget as HTMLElement).closest('dialog')?.close?.();
            }}
          >
            <Icon icon={X} size={14} />
          </button>
        </div>

        <div id={`${uid}-list`} class="cmd-list" role="listbox" aria-label="Commands">
          {matches.length === 0 ? (
            <div class="cmd-empty">No commands matching "{query}".</div>
          ) : (
            matches.map((item, idx) => {
              const showGroup = Boolean(item.group && item.group !== lastGroup);
              if (item.group) lastGroup = item.group;
              const isActive = idx === activeIdx;
              return (
                <div key={item.id}>
                  {showGroup ? <div class="cmd-group-label">{item.group}</div> : null}
                  <button
                    id={`${uid}-opt-${idx}`}
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    class="cmd-item"
                    class:is-active={isActive}
                    onMouseEnter={() => (activeIdx = idx)}
                    onClick={() => runItem(item)}
                  >
                    <span class="cmd-item-main">
                      <span class="cmd-item-label">{item.label}</span>
                      {item.hint ? <span class="cmd-item-hint">{item.hint}</span> : null}
                    </span>
                    {item.shortcut ? <span class="kbd">{item.shortcut}</span> : null}
                  </button>
                </div>
              );
            })
          )}
        </div>

        <footer class="cmd-footer">
          <span>↑↓ Navigate · ↵ Run</span>
          <span>
            {matches.length} command{matches.length === 1 ? '' : 's'}
          </span>
        </footer>
      </dialog>
    );
  }
}

/**
 * Aster-native `yield*` Command Picker Flow.
 * Open a frosted Command Palette inline from any `function*` and receive the selected item directly:
 *   const chosen = yield* pickCommand(commands, { placeholder: 'Jump to environment…' });
 */
export function* pickCommand(
  items: readonly CommandItem[],
  opts: { placeholder?: string } = {},
): Generator<View, CommandItem | null, any> {
  const decided = signal(false);
  let selected: CommandItem | null = null;

  while (!decided()) {
    yield (
      <CommandPalette
        items={items}
        open={!decided()}
        shortcut={false}
        placeholder={opts.placeholder}
        onSelect={(item) => {
          selected = item;
          decided.set(true);
        }}
        onOpenChange={(next) => {
          if (!next && !decided()) {
            selected = null;
            decided.set(true);
          }
        }}
      />
    );
  }

  return selected;
}
