import { scope, type Ctx } from '@fierst/aster';

const rsScope = scope`
  :scope { display: grid; gap: 0.45rem; font-family: var(--aster-font-sans); }
  .rs-head { display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; }
  .rs-label { font-size: 0.84rem; font-weight: 500; color: var(--aster-on-surface); }
  .rs-val {
    font-family: var(--aster-font-mono);
    font-size: 0.76rem;
    font-weight: 600;
    padding: 0.12rem 0.45rem;
    border-radius: var(--aster-radius-badge);
    background: var(--aster-primary-subtle);
    color: var(--aster-on-primary-subtle);
    border: 1px solid var(--aster-primary-border);
  }
  .rs-track-wrap {
    position: relative;
    height: 30px;
    display: flex;
    align-items: center;
  }
  .rs-rail {
    position: absolute;
    left: 0;
    right: 0;
    height: 6px;
    border-radius: 9999px;
    background: var(--aster-surface-accent);
  }
  .rs-fill {
    position: absolute;
    height: 6px;
    border-radius: 9999px;
    background: var(--aster-primary);
  }
  input[type='range'] {
    position: absolute;
    left: 0;
    width: 100%;
    margin: 0;
    background: transparent;
    pointer-events: none;
    -webkit-appearance: none;
    appearance: none;
  }
  input[type='range']::-webkit-slider-thumb {
    pointer-events: auto;
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 9999px;
    background: var(--aster-surface);
    border: 2px solid var(--aster-primary);
    box-shadow: var(--aster-shadow-sm);
    cursor: pointer;
  }
  input[type='range']::-moz-range-thumb {
    pointer-events: auto;
    width: 18px;
    height: 18px;
    border-radius: 9999px;
    background: var(--aster-surface);
    border: 2px solid var(--aster-primary);
    box-shadow: var(--aster-shadow-sm);
    cursor: pointer;
  }
`;

export function* RangeSlider(
  props: {
    label?: string;
    value?: readonly [number, number];
    defaultValue?: readonly [number, number];
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
    onChange?: (range: [number, number]) => void;
    class?: string;
  },
  ctx: Ctx,
) {
  let internal: [number, number] = props.defaultValue
    ? [props.defaultValue[0], props.defaultValue[1]]
    : [20, 80];

  for (props of ctx) {
    const min = props.min ?? 0;
    const max = props.max ?? 100;
    const step = props.step ?? 1;
    const isControlled = props.value !== undefined;
    const [lo, hi] = isControlled ? props.value! : internal;
    const span = Math.max(1, max - min);
    const leftPct = ((lo - min) / span) * 100;
    const rightPct = ((hi - min) / span) * 100;

    const commit = (nextLo: number, nextHi: number) => {
      const pair: [number, number] = [Math.min(nextLo, nextHi), Math.max(nextLo, nextHi)];
      if (!isControlled) internal = pair;
      props.onChange?.(pair);
    };

    yield (
      <div class={[rsScope, props.class].filter(Boolean).join(' ')}>
        <div class="rs-head">
          <span class="rs-label">{props.label ?? 'Range'}</span>
          <span class="rs-val">
            {lo}
            {props.unit ?? ''} – {hi}
            {props.unit ?? ''}
          </span>
        </div>
        <div class="rs-track-wrap">
          <div class="rs-rail" />
          <div
            class="rs-fill"
            style={{ left: `${leftPct}%`, width: `${Math.max(0, rightPct - leftPct)}%` }}
          />
          <input
            type="range"
            aria-label={`${props.label ?? 'Range'} minimum`}
            min={min}
            max={max}
            step={step}
            value={lo}
            onInput={(e: Event) => commit(Number((e.target as HTMLInputElement).value), hi)}
          />
          <input
            type="range"
            aria-label={`${props.label ?? 'Range'} maximum`}
            min={min}
            max={max}
            step={step}
            value={hi}
            onInput={(e: Event) => commit(lo, Number((e.target as HTMLInputElement).value))}
          />
        </div>
      </div>
    );
  }
}
