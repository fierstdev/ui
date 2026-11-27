import './theme.css';
import { scope, type Ctx } from '@fierst/aster';

const curScope = scope`
  :scope { display: grid; gap: 0.375rem; font-family: var(--aster-font-sans); }
  .cur-label { font-size: 0.84rem; font-weight: 500; color: var(--aster-on-surface); }
  .cur-wrap {
    display: flex;
    align-items: center;
    min-height: var(--aster-control-md);
    padding: 0 0.75rem;
    gap: 0.45rem;
    border-radius: var(--aster-radius-control);
    border: 1px solid var(--aster-input-border);
    background: var(--aster-surface);
    box-shadow: var(--aster-shadow-xs);
    transition: border-color var(--aster-dur-fast), box-shadow var(--aster-dur-fast);
  }
  .cur-wrap:focus-within { border-color: var(--aster-primary); box-shadow: var(--aster-focus-ring); }
  .cur-sym { color: var(--aster-on-surface-muted); font-weight: 500; }
  .cur-code {
    font-family: var(--aster-font-mono);
    font-size: 0.72rem;
    color: var(--aster-on-surface-muted);
    padding: 0.1rem 0.35rem;
    border-radius: var(--aster-radius-xs);
    background: var(--aster-surface-muted);
  }
  input {
    flex: 1;
    min-width: 0;
    border: none;
    outline: none;
    background: transparent;
    color: var(--aster-on-surface);
    font-family: var(--aster-font-mono);
    font-variant-numeric: tabular-nums;
    font-size: 1rem;
  }
  @media (min-width: 640px) { input { font-size: 0.875rem; } }
`;

const SYMBOLS: Record<string, string> = { USD: '$', EUR: '€', GBP: '£', JPY: '¥', CAD: 'CA$' };
let curSeq = 0;

export function* CurrencyInput(
  props: {
    label?: string;
    currency?: 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD';
    value?: number;
    defaultValue?: number;
    placeholder?: string;
    onChange?: (amount: number) => void;
    class?: string;
  },
  ctx: Ctx,
) {
  const uid = `aster-cur-${++curSeq}`;
  let lastValue = props.value;
  let lastCode = props.currency;
  const initial = props.value ?? props.defaultValue;
  let draft = initial?.toFixed(props.currency === 'JPY' ? 0 : 2) ?? '';

  for (props of ctx) {
    if (props.value !== lastValue || props.currency !== lastCode) {
      const amount = props.value ?? Number.parseFloat(draft);
      draft = Number.isFinite(amount) ? amount.toFixed(props.currency === 'JPY' ? 0 : 2) : '';
      lastValue = props.value;
      lastCode = props.currency;
    }
    const code = props.currency ?? 'USD';
    const sym = SYMBOLS[code] ?? '$';

    yield (
      <div class={[curScope, props.class].filter(Boolean).join(' ')}>
        {props.label ? (
          <label class="cur-label" for={uid}>
            {props.label}
          </label>
        ) : null}
        <div class="cur-wrap">
          <span class="cur-sym" aria-hidden="true">
            {sym}
          </span>
          <input
            id={uid}
            type="text"
            inputmode="decimal"
            placeholder={props.placeholder ?? '0.00'}
            value={draft}
            onInput={(e: Event) => {
              const raw = (e.target as HTMLInputElement).value.replace(/[^0-9.]/g, '');
              draft = raw;
              const num = Number.parseFloat(raw);
              if (Number.isFinite(num)) {
                if (props.value !== undefined) lastValue = num;
                props.onChange?.(num);
              }
            }}
            onBlur={() => {
              const num = Number.parseFloat(draft);
              if (!Number.isNaN(num)) draft = num.toFixed(code === 'JPY' ? 0 : 2);
            }}
          />
          <span class="cur-code">{code}</span>
        </div>
      </div>
    );
  }
}
