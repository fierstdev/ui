import { scope, type Ctx } from '@fierst/aster';

const sliderScope = scope`
  :scope {
    display: grid;
    gap: 0.45rem;
    font-family: var(--aster-font-sans);
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
  }
  .label { font-size: 0.86rem; font-weight: 550; color: var(--aster-on-surface); }
  .val-pill {
    font-family: var(--aster-font-mono);
    font-size: 0.78rem;
    font-weight: 600;
    padding: 0.14rem 0.5rem;
    border-radius: var(--aster-radius-badge);
    background: var(--aster-primary-container);
    color: var(--aster-on-primary-container);
  }
  .track-wrap {
    position: relative;
    display: flex;
    align-items: center;
    height: 32px;
  }
  input[type='range'] {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 8px;
    border-radius: var(--aster-radius-full);
    background: linear-gradient(
      to right,
      var(--aster-primary) 0%,
      var(--aster-primary) var(--fill-pct, 50%),
      var(--aster-surface-high) var(--fill-pct, 50%),
      var(--aster-surface-high) 100%
    );
    outline: none;
    cursor: pointer;
    touch-action: pan-y;
  }
  input[type='range']:disabled { opacity: 0.45; cursor: not-allowed; }
  input[type='range']::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 9999px;
    background: var(--aster-surface);
    border: 2.5px solid var(--aster-primary);
    box-shadow: var(--aster-shadow-sm);
    cursor: pointer;
    transition:
      transform var(--aster-dur-fast) var(--aster-ease-motion),
      border-radius var(--aster-dur-fast) var(--aster-ease-motion);
  }
  input[type='range']::-moz-range-track { background: transparent; border: none; height: 8px; }
  input[type='range']::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 9999px;
    background: var(--aster-surface);
    border: 2.5px solid var(--aster-primary);
    box-shadow: var(--aster-shadow-sm);
    cursor: pointer;
    transition:
      transform var(--aster-dur-fast) var(--aster-ease-motion),
      border-radius var(--aster-dur-fast) var(--aster-ease-motion);
  }
  input[type='range']:hover:not(:disabled)::-webkit-slider-thumb { transform: scale(1.1); }
  input[type='range']:hover:not(:disabled)::-moz-range-thumb { transform: scale(1.1); }
  input[type='range']:focus-visible::-webkit-slider-thumb { box-shadow: var(--aster-focus-ring); }
  input[type='range']:focus-visible::-moz-range-thumb { box-shadow: var(--aster-focus-ring); }
  .marks {
    display: flex;
    justify-content: space-between;
    font-size: 0.74rem;
    color: var(--aster-on-surface-variant);
    font-family: var(--aster-font-mono);
  }
`;

let sliderSeq = 0;

export function* Slider(
  props: {
    id?: string;
    label?: string;
    value?: number;
    defaultValue?: number;
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
    showMarks?: boolean;
    disabled?: boolean;
    onChange?: (value: number) => void;
    class?: string;
  },
  ctx: Ctx,
) {
  const uid = props.id ?? `aster-sl-${++sliderSeq}`;
  let internal = props.defaultValue ?? props.min ?? 0;

  for (props of ctx) {
    const min = props.min ?? 0;
    const max = props.max ?? 100;
    const step = props.step ?? 1;
    const isControlled = props.value !== undefined;
    const current = isControlled ? props.value! : internal;
    const pct = max > min ? ((current - min) / (max - min)) * 100 : 0;

    const onInput = (e: Event) => {
      const next = Number((e.target as HTMLInputElement).value);
      if (!isControlled) internal = next;
      props.onChange?.(next);
    };

    yield (
      <div class={[sliderScope, props.class].filter(Boolean).join(' ')}>
        {props.label ? (
          <div class="header">
            <label class="label" for={uid}>
              {props.label}
            </label>
            <span class="val-pill">
              {current}
              {props.unit ?? ''}
            </span>
          </div>
        ) : null}

        <div class="track-wrap">
          <input
            id={uid}
            type="range"
            min={min}
            max={max}
            step={step}
            value={current}
            disabled={props.disabled}
            var:fill-pct={`${Math.max(0, Math.min(100, pct))}%`}
            onInput={onInput}
          />
        </div>

        {props.showMarks ? (
          <div class="marks" aria-hidden="true">
            <span>
              {min}
              {props.unit ?? ''}
            </span>
            <span>
              {Math.round((min + max) / 2)}
              {props.unit ?? ''}
            </span>
            <span>
              {max}
              {props.unit ?? ''}
            </span>
          </div>
        ) : null}
      </div>
    );
  }
}
