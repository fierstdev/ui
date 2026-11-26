import { Eye, EyeOff } from '@lucide/icons';
import { scope, type Ctx } from '@fierst/aster';
import { Icon } from './icon.tsx';

const pwScope = scope`
  :scope { display: grid; gap: 0.375rem; font-family: var(--aster-font-sans); }
  .pw-label { font-size: 0.84rem; font-weight: 500; color: var(--aster-on-surface); }
  .pw-wrap {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0 0.45rem 0 0.75rem;
    min-height: var(--aster-control-md);
    border-radius: var(--aster-radius-control);
    border: 1px solid var(--aster-input-border);
    background: var(--aster-surface);
    box-shadow: var(--aster-shadow-xs);
    transition: border-color var(--aster-dur-fast), box-shadow var(--aster-dur-fast);
  }
  .pw-wrap:focus-within { border-color: var(--aster-primary); box-shadow: var(--aster-focus-ring); }
  .pw-wrap.is-invalid { border-color: var(--aster-danger); }
  input {
    flex: 1;
    min-width: 0;
    border: none;
    outline: none;
    background: transparent;
    color: var(--aster-on-surface);
    font: inherit;
    font-size: 1rem;
  }
  @media (min-width: 640px) { input { font-size: 0.875rem; } }
  .eye-btn {
    width: 28px;
    height: 28px;
    border: none;
    border-radius: var(--aster-radius-xs);
    background: transparent;
    color: var(--aster-on-surface-muted);
    display: inline-grid;
    place-items: center;
    cursor: pointer;
  }
  .eye-btn:hover { background: var(--aster-surface-muted); color: var(--aster-on-surface); }
  .bars { display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px; margin-top: 2px; }
  .bar { height: 4px; border-radius: 9999px; background: var(--aster-surface-accent); transition: background-color var(--aster-dur-fast); }
  .bar.s-1 { background: var(--aster-danger); }
  .bar.s-2 { background: var(--aster-warning); }
  .bar.s-3 { background: var(--aster-primary); }
  .bar.s-4 { background: var(--aster-success); }
  .pw-meta { display: flex; justify-content: space-between; font-size: 0.76rem; color: var(--aster-on-surface-muted); }
  .pw-err { font-size: 0.78rem; color: var(--aster-danger); font-weight: 500; }
`;

function scorePassword(val: string): number {
  if (!val) return 0;
  let score = 0;
  if (val.length >= 8) score++;
  if (/[A-Z]/.test(val) && /[a-z]/.test(val)) score++;
  if (/\d/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;
  return Math.max(1, score);
}

const LABELS = ['', 'Weak', 'Fair', 'Good', 'Strong'];
let pwSeq = 0;

export function* PasswordInput(
  props: {
    id?: string;
    label?: string;
    value?: string;
    defaultValue?: string;
    placeholder?: string;
    showStrength?: boolean;
    error?: string | null;
    onChange?: (val: string) => void;
    class?: string;
  },
  ctx: Ctx,
) {
  const uid = props.id ?? `aster-pw-${++pwSeq}`;
  let internal = props.defaultValue ?? '';
  let revealed = false;

  for (props of ctx) {
    const isControlled = props.value !== undefined;
    const current = isControlled ? props.value! : internal;
    const score = props.showStrength ? scorePassword(current) : 0;

    yield (
      <div class={[pwScope, props.class].filter(Boolean).join(' ')}>
        {props.label ? (
          <label class="pw-label" for={uid}>
            {props.label}
          </label>
        ) : null}
        <div class="pw-wrap" class:is-invalid={Boolean(props.error)}>
          <input
            id={uid}
            type={revealed ? 'text' : 'password'}
            value={current}
            placeholder={props.placeholder ?? 'Enter password…'}
            aria-invalid={Boolean(props.error)}
            onInput={(e: Event) => {
              const next = (e.target as HTMLInputElement).value;
              if (!isControlled) internal = next;
              props.onChange?.(next);
            }}
          />
          <button
            type="button"
            class="eye-btn"
            aria-label={revealed ? 'Hide password' : 'Show password'}
            onClick={() => (revealed = !revealed)}
          >
            <Icon icon={revealed ? EyeOff : Eye} size={15} />
          </button>
        </div>
        {props.showStrength ? (
          <>
            <div class="bars" aria-hidden="true">
              {[1, 2, 3, 4].map((lvl) => (
                <span
                  key={lvl}
                  class={['bar', lvl <= score ? `s-${score}` : ''].filter(Boolean).join(' ')}
                />
              ))}
            </div>
            {current ? (
              <div class="pw-meta">
                <span>Password strength</span>
                <span>{LABELS[score]}</span>
              </div>
            ) : null}
          </>
        ) : null}
        {props.error ? (
          <span class="pw-err" role="alert">
            {props.error}
          </span>
        ) : null}
      </div>
    );
  }
}
