import { scope, type Ctx } from '@fierst/aster';

const otpScope = scope`
  :scope {
    display: grid;
    gap: 0.45rem;
    font-family: var(--aster-font-sans);
  }
  .otp-label { font-size: 0.84rem; font-weight: 500; color: var(--aster-on-surface); }
  .otp-slots {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    flex-wrap: wrap;
  }
  .otp-sep {
    width: 8px;
    height: 2px;
    border-radius: 9999px;
    background: var(--aster-border-strong);
    margin: 0 0.1rem;
  }
  .otp-cell {
    width: 40px;
    height: 44px;
    border-radius: var(--aster-radius-control);
    border: 1px solid var(--aster-input-border);
    background: var(--aster-surface);
    color: var(--aster-on-surface);
    font-family: var(--aster-font-mono);
    font-size: 1.05rem;
    font-weight: 600;
    text-align: center;
    box-shadow: var(--aster-shadow-xs);
    outline: none;
    transition: border-color var(--aster-dur-fast), box-shadow var(--aster-dur-fast);
  }
  .otp-cell:hover:not(:disabled) { border-color: var(--aster-border-strong); }
  .otp-cell:focus { border-color: var(--aster-primary); box-shadow: var(--aster-focus-ring); }
  .otp-cell:disabled { opacity: 0.45; cursor: not-allowed; }
  .otp-hint { font-size: 0.78rem; color: var(--aster-on-surface-muted); }
`;

let otpSeq = 0;

export function* InputOTP(
  props: {
    length?: number;
    value?: string;
    defaultValue?: string;
    label?: string;
    hint?: string;
    separatorAt?: number;
    disabled?: boolean;
    onChange?: (code: string) => void;
    onComplete?: (code: string) => void;
    class?: string;
  },
  ctx: Ctx,
) {
  const uid = `aster-otp-${++otpSeq}`;
  let internal = props.defaultValue ?? '';

  for (props of ctx) {
    const len = props.length ?? 6;
    const isControlled = props.value !== undefined;
    const raw = (isControlled ? props.value! : internal).replace(/\D/g, '').slice(0, len);
    const digits = Array.from({ length: len }, (_, i) => raw[i] ?? '');
    const sepAt = props.separatorAt ?? (len === 6 ? 3 : undefined);

    const focusSlot = (idx: number) => {
      const clamped = Math.max(0, Math.min(len - 1, idx));
      document.getElementById(`${uid}-${clamped}`)?.focus();
    };

    const commit = (nextDigits: string[]) => {
      const next = nextDigits.join('').slice(0, len);
      if (!isControlled) internal = next;
      props.onChange?.(next);
      if (next.length === len) props.onComplete?.(next);
    };

    const onInput = (idx: number, e: Event) => {
      const el = e.target as HTMLInputElement;
      const cleaned = el.value.replace(/\D/g, '');
      if (!cleaned) {
        const next = [...digits];
        next[idx] = '';
        commit(next);
        return;
      }
      const next = [...digits];
      for (let k = 0; k < cleaned.length && idx + k < len; k++) {
        next[idx + k] = cleaned[k];
      }
      commit(next);
      focusSlot(Math.min(len - 1, idx + cleaned.length));
    };

    const onKeyDown = (idx: number, e: KeyboardEvent) => {
      if (e.key === 'Backspace') {
        if (!digits[idx] && idx > 0) {
          e.preventDefault();
          const next = [...digits];
          next[idx - 1] = '';
          commit(next);
          focusSlot(idx - 1);
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        focusSlot(idx - 1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        focusSlot(idx + 1);
      }
    };

    const onPaste = (e: Event) => {
      const text = (e as ClipboardEvent).clipboardData?.getData('text') ?? '';
      const cleaned = text.replace(/\D/g, '').slice(0, len);
      if (!cleaned) return;
      e.preventDefault();
      const next = Array.from({ length: len }, (_, i) => cleaned[i] ?? '');
      commit(next);
      focusSlot(Math.min(len - 1, cleaned.length));
    };

    yield (
      <div class={[otpScope, props.class].filter(Boolean).join(' ')}>
        {props.label ? (
          <label class="otp-label" for={`${uid}-0`}>
            {props.label}
          </label>
        ) : null}
        <div class="otp-slots" role="group" aria-label={props.label ?? 'One-time code'}>
          {digits.map((ch, idx) => (
            <span key={idx} style="display:inline-flex; align-items:center; gap:0.4rem">
              {sepAt !== undefined && idx === sepAt ? (
                <span class="otp-sep" aria-hidden="true" />
              ) : null}
              <input
                id={`${uid}-${idx}`}
                type="text"
                inputmode="numeric"
                autocomplete={idx === 0 ? 'one-time-code' : 'off'}
                maxlength={1}
                disabled={props.disabled}
                value={ch}
                aria-label={`Digit ${idx + 1} of ${len}`}
                class="otp-cell"
                onInput={(e: Event) => onInput(idx, e)}
                onKeyDown={(e: KeyboardEvent) => onKeyDown(idx, e)}
                on:paste={onPaste}
              />
            </span>
          ))}
        </div>
        {props.hint ? <span class="otp-hint">{props.hint}</span> : null}
      </div>
    );
  }
}
