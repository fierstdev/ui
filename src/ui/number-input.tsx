import './theme.css';
import { Minus, Plus } from '@lucide/icons';
import { scope, type Ctx } from '@fierst/aster';
import { Icon } from './icon';

const numScope = scope`
  :scope {
    display: grid;
    gap: 0.375rem;
    font-family: var(--aster-font-sans);
  }
  .num-label { font-size: 0.84rem; font-weight: 500; color: var(--aster-on-surface); }
  .num-wrap {
    display: inline-flex;
    align-items: stretch;
    border-radius: var(--aster-radius-control);
    border: 1px solid var(--aster-input-border);
    background: var(--aster-surface);
    box-shadow: var(--aster-shadow-xs);
    overflow: hidden;
    min-height: var(--aster-control-md);
    transition: border-color var(--aster-dur-fast), box-shadow var(--aster-dur-fast);
  }
  .num-wrap:focus-within { border-color: var(--aster-primary); box-shadow: var(--aster-focus-ring); }
  .step-btn {
    width: 34px;
    border: none;
    background: transparent;
    color: var(--aster-on-surface-muted);
    display: inline-grid;
    place-items: center;
    cursor: pointer;
    touch-action: manipulation;
    transition: background-color var(--aster-dur-fast), color var(--aster-dur-fast);
  }
  .step-btn:hover:not(:disabled) { background: var(--aster-surface-muted); color: var(--aster-on-surface); }
  .step-btn:disabled { opacity: 0.35; cursor: not-allowed; }
  .step-btn.dec { border-right: 1px solid var(--aster-border); }
  .step-btn.inc { border-left: 1px solid var(--aster-border); }
  .num-field {
    flex: 1;
    min-width: 56px;
    border: none;
    outline: none;
    background: transparent;
    color: var(--aster-on-surface);
    font-family: var(--aster-font-mono);
    font-variant-numeric: tabular-nums;
    font-size: 1rem;
    font-weight: 500;
    text-align: center;
    padding: 0 0.45rem;
  }
  @media (min-width: 640px) {
    .num-field { font-size: 0.875rem; }
  }
  .unit {
    display: inline-flex;
    align-items: center;
    padding-right: 0.55rem;
    font-size: 0.78rem;
    color: var(--aster-on-surface-subtle);
  }
  .num-hint { font-size: 0.78rem; color: var(--aster-on-surface-muted); }
`;

let numSeq = 0;

export function* NumberInput(
  props: {
    id?: string;
    label?: string;
    value?: number;
    defaultValue?: number;
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
    hint?: string;
    disabled?: boolean;
    onChange?: (value: number) => void;
    class?: string;
  },
  ctx: Ctx,
) {
  const uid = props.id ?? `aster-num-${++numSeq}`;
  let internal = props.defaultValue ?? props.min ?? 0;

  for (props of ctx) {
    const min = props.min ?? -Infinity;
    const max = props.max ?? Infinity;
    const step = props.step ?? 1;
    const isControlled = props.value !== undefined;
    const current = isControlled ? props.value! : internal;

    const setVal = (raw: number) => {
      if (Number.isNaN(raw)) return;
      const clamped = Math.max(min, Math.min(max, raw));
      if (!isControlled) internal = clamped;
      props.onChange?.(clamped);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setVal(current + step);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setVal(current - step);
      }
    };

    yield (
      <div class={[numScope, props.class].filter(Boolean).join(' ')}>
        {props.label ? (
          <label class="num-label" for={uid}>
            {props.label}
          </label>
        ) : null}
        <div class="num-wrap">
          <button
            type="button"
            class="step-btn dec"
            aria-label="Decrease value"
            disabled={props.disabled || current <= min}
            onClick={() => setVal(current - step)}
          >
            <Icon icon={Minus} size={14} />
          </button>
          <input
            id={uid}
            type="text"
            inputmode="decimal"
            role="spinbutton"
            aria-valuenow={current}
            aria-valuemin={Number.isFinite(min) ? min : undefined}
            aria-valuemax={Number.isFinite(max) ? max : undefined}
            disabled={props.disabled}
            value={String(current)}
            class="num-field"
            onChange={(e: Event) => setVal(Number((e.target as HTMLInputElement).value))}
            onKeyDown={onKeyDown}
          />
          {props.unit ? <span class="unit">{props.unit}</span> : null}
          <button
            type="button"
            class="step-btn inc"
            aria-label="Increase value"
            disabled={props.disabled || current >= max}
            onClick={() => setVal(current + step)}
          >
            <Icon icon={Plus} size={14} />
          </button>
        </div>
        {props.hint ? <span class="num-hint">{props.hint}</span> : null}
      </div>
    );
  }
}
