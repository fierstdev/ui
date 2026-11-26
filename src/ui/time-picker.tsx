import { Clock } from '@lucide/icons';
import { scope, type Ctx } from '@fierst/aster';
import { Icon } from './icon.tsx';

const tpScope = scope`
  :scope { display: grid; gap: 0.375rem; font-family: var(--aster-font-sans); }
  .tp-label { font-size: 0.84rem; font-weight: 500; color: var(--aster-on-surface); }
  .tp-wrap {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    min-height: var(--aster-control-md);
    padding: 0 0.7rem;
    border-radius: var(--aster-radius-control);
    border: 1px solid var(--aster-input-border);
    background: var(--aster-surface);
    box-shadow: var(--aster-shadow-xs);
    transition: border-color var(--aster-dur-fast), box-shadow var(--aster-dur-fast);
  }
  .tp-wrap:focus-within { border-color: var(--aster-primary); box-shadow: var(--aster-focus-ring); }
  .tp-icon { color: var(--aster-on-surface-subtle); display: inline-flex; flex-shrink: 0; }
  select {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    color: var(--aster-on-surface);
    font: inherit;
    font-size: 0.875rem;
    font-family: var(--aster-font-mono);
    cursor: pointer;
  }
`;

function formatTime(totalMins: number, use24h: boolean): string {
  const h = Math.floor(totalMins / 60);
  const m = totalMins % 60;
  const mm = String(m).padStart(2, '0');
  if (use24h) return `${String(h).padStart(2, '0')}:${mm}`;
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${mm} ${period}`;
}

let tpSeq = 0;

export function* TimePicker(
  props: {
    label?: string;
    value?: string;
    defaultValue?: string;
    stepMinutes?: number;
    use24h?: boolean;
    disabled?: boolean;
    onChange?: (hhmm: string) => void;
    class?: string;
  },
  ctx: Ctx,
) {
  const uid = `aster-tp-${++tpSeq}`;
  let internal = props.defaultValue ?? '09:00';

  for (props of ctx) {
    const step = Math.max(5, props.stepMinutes ?? 15);
    const isControlled = props.value !== undefined;
    const current = isControlled ? props.value! : internal;
    const slots: { val: string; label: string }[] = [];
    for (let mins = 0; mins < 24 * 60; mins += step) {
      const h = String(Math.floor(mins / 60)).padStart(2, '0');
      const m = String(mins % 60).padStart(2, '0');
      slots.push({ val: `${h}:${m}`, label: formatTime(mins, Boolean(props.use24h)) });
    }

    yield (
      <div class={[tpScope, props.class].filter(Boolean).join(' ')}>
        {props.label ? (
          <label class="tp-label" for={uid}>
            {props.label}
          </label>
        ) : null}
        <div class="tp-wrap">
          <span class="tp-icon" aria-hidden="true">
            <Icon icon={Clock} size={15} />
          </span>
          <select
            id={uid}
            value={current}
            disabled={props.disabled}
            onChange={(e: Event) => {
              const next = (e.target as HTMLSelectElement).value;
              if (!isControlled) internal = next;
              props.onChange?.(next);
            }}
          >
            {slots.map((s) => (
              <option key={s.val} value={s.val} selected={s.val === current}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  }
}
