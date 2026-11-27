import { Check, ChevronDown, X } from '@lucide/icons';
import { scope, type Ctx } from '@fierst/aster';
import { Icon } from './icon.tsx';
import { positionPopover } from './theme.ts';

const msScope = scope`
  :scope { display: grid; gap: 0.375rem; font-family: var(--aster-font-sans); }
  .ms-label { font-size: 0.84rem; font-weight: 500; color: var(--aster-on-surface); }
  .ms-trigger {
    position: relative;
    width: 100%;
    min-height: var(--aster-control-md);
    padding: 0.3rem 0.65rem;
    border-radius: var(--aster-radius-control);
    border: 1px solid var(--aster-input-border);
    background: var(--aster-surface);
    color: var(--aster-on-surface);
    box-shadow: var(--aster-shadow-xs);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    cursor: pointer;
    text-align: left;
    touch-action: manipulation;
    transition: border-color var(--aster-dur-fast), box-shadow var(--aster-dur-fast);
  }
  .ms-open { position: absolute; inset: 0; width: 100%; border: 0; background: transparent; cursor: pointer; }
  .ms-chip-rm { position: relative; z-index: 1; }
  .ms-trigger:hover { border-color: var(--aster-border-strong); }
  .ms-trigger:focus-within { outline: none; border-color: var(--aster-primary); box-shadow: var(--aster-focus-ring); }
  .ms-chips {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.3rem;
    flex: 1;
    min-width: 0;
  }
  .ms-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.2rem;
    padding: 0.1rem 0.4rem;
    border-radius: var(--aster-radius-xs);
    background: var(--aster-primary-subtle);
    border: 1px solid var(--aster-primary-border);
    color: var(--aster-on-primary-subtle);
    font-size: 0.76rem;
    font-weight: 500;
  }
  .ms-chip-rm {
    border: none;
    background: transparent;
    color: currentColor;
    padding: 0;
    display: inline-grid;
    place-items: center;
    cursor: pointer;
  }
  .ms-placeholder { color: var(--aster-on-surface-subtle); font-size: 0.875rem; }
  .ms-pop {
    position: fixed;
    inset: auto;
    margin: 0;
    padding: 0.4rem;
    border-radius: var(--aster-radius-md);
    width: min(320px, calc(100vw - 1.5rem));
    height: auto;
    max-height: 65dvh;
    overflow: hidden;
    overscroll-behavior: contain;
  }
  .ms-pop:popover-open { display: flex; flex-direction: column; }
  .ms-pop:not(:popover-open) { display: none; }
  .ms-search {
    flex: 0 0 auto;
    width: 100%;
    padding: 0.42rem 0.6rem;
    margin-bottom: 0.35rem;
    border: 1px solid var(--aster-input-border);
    border-radius: var(--aster-radius-xs);
    background: var(--aster-surface);
    color: var(--aster-on-surface);
    font: inherit;
    font-size: 0.875rem;
    outline: none;
  }
  .ms-search:focus { border-color: var(--aster-primary); }
  .ms-list {
    flex: 1 1 auto;
    min-height: 0;
    max-height: 220px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 0.12rem;
  }
  .ms-list > * { flex-shrink: 0; }
  .ms-opt {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.6rem;
    padding: 0.45rem 0.65rem;
    border: none;
    border-radius: var(--aster-radius-xs);
    background: transparent;
    color: var(--aster-on-surface);
    font: inherit;
    font-size: 0.85rem;
    cursor: pointer;
    text-align: left;
  }
  .ms-opt:hover { background: var(--aster-surface-muted); }
  .ms-opt-check { color: var(--aster-primary); display: inline-flex; }
`;

export interface MultiSelectOption {
  value: string;
  label: string;
}

let msSeq = 0;

export function* MultiSelect(
  props: {
    label?: string;
    options: readonly MultiSelectOption[];
    value?: readonly string[];
    defaultValue?: readonly string[];
    placeholder?: string;
    onChange?: (values: string[]) => void;
    class?: string;
  },
  ctx: Ctx,
) {
  const uid = `aster-ms-${++msSeq}`;
  const popId = `${uid}-pop`;
  let internal = [...(props.defaultValue ?? [])];
  let query = '';
  let isOpen = false;

  for (props of ctx) {
    const isControlled = props.value !== undefined;
    const selected = isControlled ? [...props.value!] : internal;
    const q = query.trim().toLowerCase();
    const visible = q
      ? props.options.filter((o) => o.label.toLowerCase().includes(q))
      : [...props.options];

    const toggle = (val: string) => {
      const next = selected.includes(val) ? selected.filter((v) => v !== val) : [...selected, val];
      if (!isControlled) internal = next;
      props.onChange?.(next);
    };

    const onTogglePop = (e: any) => {
      isOpen = e.newState === 'open';
      if (isOpen) {
        positionPopover(document.getElementById(uid), document.getElementById(popId), {
          matchWidth: true,
        });
        document.getElementById(popId)?.querySelector('input')?.focus();
      } else {
        query = '';
      }
      ctx.refresh();
    };

    yield (
      <div class={[msScope, props.class].filter(Boolean).join(' ')}>
        {props.label ? (
          <label class="ms-label" for={uid}>
            {props.label}
          </label>
        ) : null}
        <div class="ms-trigger">
          <button
            id={uid}
            type="button"
            class="ms-open"
            aria-label={props.label ?? props.placeholder ?? 'Select options'}
            role="combobox"
            aria-expanded={isOpen}
            aria-controls={`${uid}-list`}
            popovertarget={popId}
          />
          <span class="ms-chips">
            {selected.length === 0 ? (
              <span class="ms-placeholder">{props.placeholder ?? 'Select options…'}</span>
            ) : (
              selected.map((val) => {
                const opt = props.options.find((o) => o.value === val);
                return (
                  <span key={val} class="ms-chip">
                    <span>{opt?.label ?? val}</span>
                    <button
                      type="button"
                      class="ms-chip-rm"
                      aria-label={`Remove ${opt?.label ?? val}`}
                      onClick={(e: MouseEvent) => {
                        e.stopPropagation();
                        toggle(val);
                      }}
                    >
                      <Icon icon={X} size={11} />
                    </button>
                  </span>
                );
              })
            )}
          </span>
          <Icon icon={ChevronDown} size={15} />
        </div>

        <div id={popId} popover="auto" class="aster-surface-popover ms-pop" on:toggle={onTogglePop}>
          <input
            type="text"
            class="ms-search"
            bind:value={query}
            placeholder="Filter…"
            aria-label="Filter options"
          />
          <div
            id={`${uid}-list`}
            class="ms-list"
            role="listbox"
            aria-label={props.label ?? 'Options'}
            aria-multiselectable="true"
          >
            {visible.map((opt) => {
              const active = selected.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={active}
                  class="ms-opt"
                  onClick={() => toggle(opt.value)}
                >
                  <span>{opt.label}</span>
                  {active ? (
                    <span class="ms-opt-check">
                      <Icon icon={Check} size={14} strokeWidth={2.3} />
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}
