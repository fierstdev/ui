import './theme.css';
import { scope, type Ctx } from '@fierst/aster';

const phInScope = scope`
  :scope { display: grid; gap: 0.375rem; font-family: var(--aster-font-sans); }
  .ph-label { font-size: 0.84rem; font-weight: 500; color: var(--aster-on-surface); }
  .ph-wrap {
    display: flex;
    align-items: stretch;
    min-height: var(--aster-control-md);
    border-radius: var(--aster-radius-control);
    border: 1px solid var(--aster-input-border);
    background: var(--aster-surface);
    box-shadow: var(--aster-shadow-xs);
    overflow: hidden;
    transition: border-color var(--aster-dur-fast), box-shadow var(--aster-dur-fast);
  }
  .ph-wrap:focus-within { border-color: var(--aster-primary); box-shadow: var(--aster-focus-ring); }
  select {
    border: none;
    border-right: 1px solid var(--aster-border);
    background: var(--aster-surface-muted);
    color: var(--aster-on-surface);
    padding: 0 0.55rem;
    font: inherit;
    font-size: 0.8125rem;
    font-family: var(--aster-font-mono);
    outline: none;
    cursor: pointer;
  }
  input {
    flex: 1;
    min-width: 0;
    border: none;
    outline: none;
    background: transparent;
    color: var(--aster-on-surface);
    padding: 0 0.75rem;
    font: inherit;
    font-size: 1rem;
  }
  @media (min-width: 640px) { input { font-size: 0.875rem; } }
`;

const DIAL_CODES = [
  { code: '+1', label: 'US +1' },
  { code: '+44', label: 'UK +44' },
  { code: '+49', label: 'DE +49' },
  { code: '+33', label: 'FR +33' },
  { code: '+81', label: 'JP +81' },
  { code: '+61', label: 'AU +61' },
];

let phSeq = 0;

export function* PhoneInput(
  props: {
    label?: string;
    value?: string;
    defaultCountry?: string;
    placeholder?: string;
    onChange?: (e164: string) => void;
    class?: string;
  },
  ctx: Ctx,
) {
  const uid = `aster-phone-${++phSeq}`;
  let dial = props.defaultCountry ?? '+1';
  let localNum = '';

  for (props of ctx) {
    if (props.value !== undefined) {
      const country = DIAL_CODES.find((c) => props.value!.startsWith(c.code));
      if (country) dial = country.code;
      localNum = country ? props.value.slice(dial.length) : props.value;
    }
    const emit = () => {
      const digits = localNum.replace(/[^\d]/g, '');
      props.onChange?.(digits ? `${dial}${digits}` : '');
    };

    yield (
      <div class={[phInScope, props.class].filter(Boolean).join(' ')}>
        {props.label ? (
          <label class="ph-label" for={uid}>
            {props.label}
          </label>
        ) : null}
        <div class="ph-wrap">
          <select
            aria-label="Country dial code"
            value={dial}
            onChange={(e: Event) => {
              dial = (e.target as HTMLSelectElement).value;
              emit();
            }}
          >
            {DIAL_CODES.map((c) => (
              <option key={c.code} value={c.code} selected={c.code === dial}>
                {c.label}
              </option>
            ))}
          </select>
          <input
            id={uid}
            type="tel"
            autocomplete="tel-national"
            placeholder={props.placeholder ?? '(555) 234-5678'}
            value={localNum}
            onInput={(e: Event) => {
              localNum = (e.target as HTMLInputElement).value;
              emit();
            }}
          />
        </div>
      </div>
    );
  }
}
