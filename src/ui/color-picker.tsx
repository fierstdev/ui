import { scope, type Ctx } from '@fierst/aster';
import { positionPopover } from './theme.ts';

const cpScope = scope`
  :scope { display: grid; gap: 0.375rem; font-family: var(--aster-font-sans); }
  .cp-label { font-size: 0.84rem; font-weight: 500; color: var(--aster-on-surface); }
  .cp-trigger {
    width: 100%;
    min-height: var(--aster-control-md);
    padding: 0 0.7rem;
    border-radius: var(--aster-radius-control);
    border: 1px solid var(--aster-input-border);
    background: var(--aster-surface);
    color: var(--aster-on-surface);
    box-shadow: var(--aster-shadow-xs);
    display: flex;
    align-items: center;
    gap: 0.55rem;
    font: inherit;
    font-size: 0.85rem;
    cursor: pointer;
    text-align: left;
  }
  .cp-trigger:hover { border-color: var(--aster-border-strong); }
  .cp-dot {
    width: 18px;
    height: 18px;
    border-radius: var(--aster-radius-xs);
    border: 1px solid rgba(0, 0, 0, 0.14);
    flex-shrink: 0;
  }
  .cp-hex { font-family: var(--aster-font-mono); font-size: 0.8125rem; }
  .cp-pop {
    position: fixed;
    inset: auto;
    margin: 0;
    padding: 0.75rem;
    border-radius: var(--aster-radius-lg);
    width: 244px;
    display: grid;
    gap: 0.65rem;
  }
  .cp-pop:not(:popover-open) { display: none; }
  .cp-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 6px; }
  .cp-sw {
    width: 100%;
    aspect-ratio: 1;
    border-radius: var(--aster-radius-xs);
    border: 2px solid transparent;
    cursor: pointer;
    transition: transform var(--aster-dur-fast);
  }
  .cp-sw:hover { transform: scale(1.1); }
  .cp-sw.is-active { border-color: var(--aster-on-surface); }
  .cp-row { display: flex; align-items: center; gap: 0.45rem; }
  .cp-native { width: 34px; height: 32px; padding: 0; border: 1px solid var(--aster-border); border-radius: var(--aster-radius-xs); background: transparent; cursor: pointer; }
  .cp-text {
    flex: 1;
    min-width: 0;
    height: 32px;
    padding: 0 0.5rem;
    border-radius: var(--aster-radius-xs);
    border: 1px solid var(--aster-input-border);
    background: var(--aster-surface);
    color: var(--aster-on-surface);
    font-family: var(--aster-font-mono);
    font-size: 0.8rem;
  }
`;

const DEFAULT_SWATCHES = [
  '#18181b',
  '#2563eb',
  '#059669',
  '#7c3aed',
  '#e11d48',
  '#d97706',
  '#475569',
  '#0284c7',
  '#16a34a',
  '#9333ea',
  '#dc2626',
  '#ea580c',
];

let cpSeq = 0;

export function* ColorPicker(
  props: {
    label?: string;
    value?: string;
    defaultValue?: string;
    swatches?: readonly string[];
    onChange?: (hex: string) => void;
    class?: string;
  },
  ctx: Ctx,
) {
  const uid = `aster-cp-${++cpSeq}`;
  const popId = `${uid}-pop`;
  let internal = props.defaultValue ?? '#2563eb';

  for (props of ctx) {
    const isControlled = props.value !== undefined;
    const current = isControlled ? props.value! : internal;
    const swatches = props.swatches ?? DEFAULT_SWATCHES;

    const setColor = (hex: string) => {
      if (!isControlled) internal = hex;
      props.onChange?.(hex);
    };

    const onToggle = (e: any) => {
      if (e.newState === 'open') {
        positionPopover(document.getElementById(uid), document.getElementById(popId));
      }
    };

    yield (
      <div class={[cpScope, props.class].filter(Boolean).join(' ')}>
        {props.label ? (
          <label class="cp-label" for={uid}>
            {props.label}
          </label>
        ) : null}
        <button id={uid} type="button" class="cp-trigger" popovertarget={popId}>
          <span class="cp-dot" style={{ background: current }} />
          <span class="cp-hex">{current.toUpperCase()}</span>
        </button>
        <div id={popId} popover="auto" class="aster-surface-popover cp-pop" on:toggle={onToggle}>
          <div class="cp-grid">
            {swatches.map((hex) => (
              <button
                key={hex}
                type="button"
                aria-label={`Select color ${hex}`}
                class="cp-sw"
                class:is-active={hex.toLowerCase() === current.toLowerCase()}
                style={{ background: hex }}
                onClick={() => setColor(hex)}
              />
            ))}
          </div>
          <div class="cp-row">
            <input
              type="color"
              class="cp-native"
              aria-label="Pick custom color"
              value={/^#[0-9a-f]{6}$/i.test(current) ? current : '#2563eb'}
              onInput={(e: Event) => setColor((e.target as HTMLInputElement).value)}
            />
            <input
              type="text"
              class="cp-text"
              aria-label="Hex color value"
              value={current}
              onChange={(e: Event) => setColor((e.target as HTMLInputElement).value.trim())}
            />
          </div>
        </div>
      </div>
    );
  }
}
