import './theme.css';
import { Check, ChevronDown } from '@lucide/icons';
import { scope, type Ctx } from '@fierst/aster';
import { Icon } from './icon';
import { positionPopover } from './theme';

const selectScope = scope`
  :scope {
    display: grid;
    gap: 0.35rem;
    font-family: var(--aster-font-sans);
    position: relative;
  }
  .sel-label {
    font-size: 0.84rem;
    font-weight: 550;
    color: var(--aster-on-surface);
  }
  .sel-trigger {
    width: 100%;
    min-height: var(--aster-control-md);
    touch-action: manipulation;
    padding: 0 0.85rem;
    border-radius: var(--aster-radius-sm);
    border: 1px solid var(--aster-outline-variant);
    background: var(--aster-surface);
    color: var(--aster-on-surface);
    font: inherit;
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    cursor: pointer;
    text-align: left;
    transition:
      border-color var(--aster-dur-fast) var(--aster-ease-standard),
      border-radius var(--aster-dur-fast) var(--aster-ease-motion),
      box-shadow var(--aster-dur-fast) var(--aster-ease-standard);
  }
  @media (min-width: 640px) {
    .sel-trigger { font-size: 0.9rem; }
  }
  .sel-trigger:hover:not(:disabled) { border-color: var(--aster-outline); }
  .sel-trigger:focus-visible { outline: none; border-color: var(--aster-primary); box-shadow: var(--aster-focus-ring); }
  .sel-trigger.is-invalid { border-color: var(--aster-danger); }
  .sel-trigger:disabled { opacity: 0.45; cursor: not-allowed; }
  .sel-placeholder { color: var(--aster-on-surface-variant); opacity: 0.75; }
  .sel-caret {
    color: var(--aster-on-surface-variant);
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
  }

  .sel-pop {
    position: fixed;
    inset: auto;
    margin: 0;
    padding: 0.4rem;
    border-radius: var(--aster-radius-md);
    color: var(--aster-on-surface);
    width: min(320px, calc(100vw - 1.5rem));
    height: auto;
    max-height: 70dvh;
    overflow: hidden;
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
  .sel-pop:popover-open { display: flex; flex-direction: column; }
  .sel-pop:not(:popover-open) { display: none; }
  @starting-style {
    .sel-pop:popover-open {
      opacity: 0;
      transform: translateY(-4px) scale(0.97);
    }
  }
  .sel-search {
    flex: 0 0 auto;
    width: 100%;
    padding: 0.45rem 0.65rem;
    margin-bottom: 0.35rem;
    border: 1px solid var(--aster-outline-variant);
    border-radius: var(--aster-radius-xs);
    background: var(--aster-surface);
    color: var(--aster-on-surface);
    font: inherit;
    font-size: 1rem;
    outline: none;
  }
  @media (min-width: 640px) {
    .sel-search { font-size: 0.86rem; }
  }
  .sel-search:focus { border-color: var(--aster-primary); }
  .sel-list {
    flex: 1 1 auto;
    min-height: 0;
    max-height: 240px;
    overflow-y: auto;
    overscroll-behavior: contain;
    display: flex;
    flex-direction: column;
    gap: 0.12rem;
  }
  .sel-list > * { flex-shrink: 0; }
  .sel-opt {
    width: 100%;
    min-height: var(--aster-control-sm);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0.5rem 0.7rem;
    border: none;
    border-radius: var(--aster-radius-xs);
    background: transparent;
    color: var(--aster-on-surface);
    font: inherit;
    font-size: 0.88rem;
    cursor: pointer;
    text-align: left;
    transition: background var(--aster-dur-fast) var(--aster-ease-standard);
  }
  .sel-opt:hover:not(:disabled),
  .sel-opt.is-highlighted {
    background: var(--aster-surface-muted);
    color: var(--aster-on-surface);
  }
  .sel-opt:disabled { opacity: 0.42; cursor: not-allowed; }
  .sel-opt-text { display: grid; gap: 0.06rem; min-width: 0; }
  .sel-opt-label { font-weight: 500; }
  .sel-opt-desc { font-size: 0.76rem; opacity: 0.72; }
  .sel-check { color: var(--aster-primary); display: inline-flex; flex-shrink: 0; }
  .sel-empty { padding: 1rem; text-align: center; font-size: 0.84rem; color: var(--aster-on-surface-variant); }
  .sel-hint { font-size: 0.8rem; color: var(--aster-on-surface-variant); }
  .sel-error { font-size: 0.8rem; color: var(--aster-danger); font-weight: 500; }
`;

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

let selectSeq = 0;

export function* Select(
  props: {
    options: readonly SelectOption[];
    value?: string;
    defaultValue?: string;
    onChange?: (value: string) => void;
    label?: string;
    placeholder?: string;
    searchable?: boolean;
    searchPlaceholder?: string;
    hint?: string;
    error?: string | null;
    disabled?: boolean;
    class?: string;
  },
  ctx: Ctx,
) {
  const uid = `aster-sel-${++selectSeq}`;
  const popId = `${uid}-pop`;
  let internalVal = props.defaultValue ?? '';
  let query = '';
  let highlightIdx = 0;
  let isOpen = false;
  let searchInput: HTMLInputElement | null = null;

  for (props of ctx) {
    const isControlled = props.value !== undefined;
    const currentVal = isControlled ? props.value! : internalVal;
    const selectedOpt = props.options.find((o) => o.value === currentVal);

    const q = query.trim().toLowerCase();
    const visible = q
      ? props.options.filter((o) => `${o.label} ${o.description ?? ''}`.toLowerCase().includes(q))
      : [...props.options];

    if (highlightIdx >= visible.length) highlightIdx = Math.max(0, visible.length - 1);

    const choose = (opt: SelectOption) => {
      if (opt.disabled) return;
      if (!isControlled) internalVal = opt.value;
      props.onChange?.(opt.value);
      query = '';
      const el = document.getElementById(popId) as any;
      el?.hidePopover?.();
    };

    const onToggle = (e: any) => {
      isOpen = e.newState === 'open';
      if (isOpen) {
        positionPopover(document.getElementById(uid), document.getElementById(popId), {
          matchWidth: true,
        });
        queueMicrotask(() => {
          if (props.searchable) searchInput?.focus();
          else
            document
              .getElementById(popId)
              ?.querySelector<HTMLButtonElement>(
                'button[aria-selected="true"]:enabled, button:enabled',
              )
              ?.focus();
        });
      } else {
        query = '';
      }
      ctx.refresh();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const buttons = Array.from(
          (e.currentTarget as HTMLElement).querySelectorAll<HTMLButtonElement>('button:enabled'),
        );
        if (!buttons.length) return;
        const index = buttons.indexOf(e.target as HTMLButtonElement);
        const next =
          e.key === 'ArrowDown'
            ? (index + 1) % buttons.length
            : index <= 0
              ? buttons.length - 1
              : index - 1;
        buttons[next].focus();
      } else if (e.key === 'Enter' && e.target === searchInput && visible[highlightIdx]) {
        e.preventDefault();
        choose(visible[highlightIdx]);
      }
    };

    yield (
      <div class={[selectScope, props.class].filter(Boolean).join(' ')}>
        {props.label ? (
          <label class="sel-label" for={uid}>
            {props.label}
          </label>
        ) : null}

        <button
          id={uid}
          type="button"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={`${uid}-list`}
          aria-haspopup="listbox"
          aria-invalid={Boolean(props.error)}
          disabled={props.disabled}
          popovertarget={popId}
          class="sel-trigger"
          class:is-invalid={Boolean(props.error)}
        >
          <span class:sel-placeholder={!selectedOpt}>
            {selectedOpt ? selectedOpt.label : (props.placeholder ?? 'Select an option…')}
          </span>
          <span class="sel-caret" aria-hidden="true">
            <Icon icon={ChevronDown} size={15} />
          </span>
        </button>

        <div
          id={popId}
          popover="auto"
          class="aster-surface-popover sel-pop"
          on:toggle={onToggle}
          onKeyDown={onKeyDown}
        >
          {props.searchable ? (
            <input
              ref={(el: HTMLInputElement) => (searchInput = el)}
              type="text"
              class="sel-search"
              bind:value={query}
              placeholder={props.searchPlaceholder ?? 'Filter options…'}
              aria-label="Filter options"
            />
          ) : null}

          <div
            role="listbox"
            id={`${uid}-list`}
            aria-label={props.label ?? 'Options'}
            class="sel-list"
          >
            {visible.length === 0 ? (
              <div class="sel-empty">No options found.</div>
            ) : (
              visible.map((opt, idx) => {
                const isSelected = opt.value === currentVal;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    disabled={opt.disabled}
                    class="sel-opt"
                    class:is-highlighted={idx === highlightIdx}
                    onMouseEnter={() => (highlightIdx = idx)}
                    onClick={() => choose(opt)}
                  >
                    <span class="sel-opt-text">
                      <span class="sel-opt-label">{opt.label}</span>
                      {opt.description ? <span class="sel-opt-desc">{opt.description}</span> : null}
                    </span>
                    {isSelected ? (
                      <span class="sel-check" aria-hidden="true">
                        <Icon icon={Check} size={15} strokeWidth={2.2} />
                      </span>
                    ) : null}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {props.error ? (
          <span class="sel-error" role="alert">
            {props.error}
          </span>
        ) : props.hint ? (
          <span class="sel-hint">{props.hint}</span>
        ) : null}
      </div>
    );
  }
}
