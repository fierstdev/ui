import './theme.css';
import { Calendar as CalendarIcon, ChevronDown, ChevronLeft, ChevronRight } from '@lucide/icons';
import { scope, signal, type Ctx, type View } from '@fierst/aster';
import { Icon } from './icon';
import { Dialog } from './dialog';
import { Button } from './button';
import { positionPopover } from './theme';

const calScope = scope`
  :scope {
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
    padding: 0.85rem;
    border-radius: var(--aster-radius-lg);
    border: 1px solid var(--aster-border);
    background: var(--aster-surface);
    color: var(--aster-on-surface);
    font-family: var(--aster-font-sans);
    width: 100%;
    max-width: 320px;
  }
  :scope.is-embedded {
    border: none;
    background: transparent;
    padding: 0.25rem;
    max-width: none;
  }
  .cal-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.35rem;
  }
  .cal-selects {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    flex: 1;
    justify-content: center;
    min-width: 0;
  }
  .cal-select-wrap {
    position: relative;
    display: inline-flex;
    align-items: center;
  }
  .cal-select {
    appearance: none;
    -webkit-appearance: none;
    height: 30px;
    padding: 0 1.45rem 0 0.5rem;
    border-radius: var(--aster-radius-sm);
    border: 1px solid var(--aster-border);
    background: var(--aster-surface);
    color: var(--aster-on-surface);
    font-family: var(--aster-font-sans);
    font-size: 0.8125rem;
    font-weight: 500;
    cursor: pointer;
    transition: border-color var(--aster-dur-fast), background-color var(--aster-dur-fast);
  }
  .cal-select:hover { background: var(--aster-surface-muted); border-color: var(--aster-border-strong); }
  .cal-select:focus-visible { outline: none; border-color: var(--aster-primary); box-shadow: var(--aster-focus-ring); }
  .cal-select-chev {
    position: absolute;
    right: 0.35rem;
    pointer-events: none;
    color: var(--aster-on-surface-muted);
    display: inline-flex;
  }

  .nav-btn {
    width: 30px;
    height: 30px;
    border-radius: var(--aster-radius-sm);
    border: 1px solid var(--aster-border);
    background: var(--aster-surface);
    color: var(--aster-on-surface);
    display: inline-grid;
    place-items: center;
    cursor: pointer;
    flex-shrink: 0;
    touch-action: manipulation;
    transition: background-color var(--aster-dur-fast), border-color var(--aster-dur-fast);
  }
  .nav-btn:hover { background: var(--aster-surface-muted); border-color: var(--aster-border-strong); }
  .nav-btn:focus-visible { outline: none; box-shadow: var(--aster-focus-ring); }

  .cal-grid {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    gap: 2px;
    text-align: center;
  }
  .dow {
    font-size: 0.72rem;
    font-weight: 500;
    color: var(--aster-on-surface-subtle);
    padding: 0.25rem 0;
  }
  .day {
    width: 100%;
    height: 34px;
    border: 1px solid transparent;
    border-radius: var(--aster-radius-sm);
    background: transparent;
    color: var(--aster-on-surface);
    font-family: var(--aster-font-sans);
    font-size: 0.84rem;
    font-weight: 450;
    cursor: pointer;
    display: inline-grid;
    place-items: center;
    touch-action: manipulation;
    transition: background-color var(--aster-dur-fast), color var(--aster-dur-fast);
  }
  .day:hover:not(:disabled) { background: var(--aster-surface-muted); }
  .day:focus-visible { outline: none; box-shadow: var(--aster-focus-ring); }
  .day.is-outside { color: var(--aster-on-surface-muted); }
  .day.is-today { background: var(--aster-surface-muted); font-weight: 600; }
  .day.is-selected {
    background: var(--aster-primary);
    color: var(--aster-on-primary);
    font-weight: 600;
  }
  .day.is-selected:hover:not(:disabled) { background: var(--aster-primary-hover); }
  .day:disabled { opacity: 0.3; cursor: not-allowed; }

  .cal-foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    padding-top: 0.5rem;
    border-top: 1px solid var(--aster-border);
  }
  .cal-jump-input {
    width: 118px;
    height: 28px;
    padding: 0 0.5rem;
    border-radius: var(--aster-radius-xs);
    border: 1px solid var(--aster-input-border);
    background: var(--aster-surface);
    color: var(--aster-on-surface);
    font-family: var(--aster-font-mono);
    font-size: 0.78rem;
    outline: none;
    transition: border-color var(--aster-dur-fast), box-shadow var(--aster-dur-fast);
  }
  .cal-jump-input:focus { border-color: var(--aster-primary); box-shadow: var(--aster-focus-ring); }
  .cal-jump-input.is-err { border-color: var(--aster-danger); }
  .today-btn {
    border: none;
    background: transparent;
    color: var(--aster-primary);
    font-family: var(--aster-font-sans);
    font-size: 0.78rem;
    font-weight: 600;
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    border-radius: var(--aster-radius-xs);
    transition: background-color var(--aster-dur-fast);
  }
  .today-btn:hover { background: var(--aster-primary-subtle); }
`;

const pickerScope = scope`
  :scope { display: grid; gap: 0.375rem; font-family: var(--aster-font-sans); }
  .dp-label { font-size: 0.84rem; font-weight: 500; color: var(--aster-on-surface); }
  .dp-trigger {
    width: 100%;
    min-height: var(--aster-control-md);
    padding: 0 0.8rem;
    border-radius: var(--aster-radius-control);
    border: 1px solid var(--aster-input-border);
    background: var(--aster-surface);
    color: var(--aster-on-surface);
    box-shadow: var(--aster-shadow-xs);
    font: inherit;
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    cursor: pointer;
    touch-action: manipulation;
    transition: border-color var(--aster-dur-fast), box-shadow var(--aster-dur-fast);
  }
  @media (min-width: 640px) {
    .dp-trigger { font-size: 0.875rem; }
  }
  .dp-trigger:hover { border-color: var(--aster-border-strong); }
  .dp-trigger:focus-visible { outline: none; border-color: var(--aster-primary); box-shadow: var(--aster-focus-ring); }
  .dp-placeholder { color: var(--aster-on-surface-subtle); }
  .dp-pop {
    position: fixed;
    inset: auto;
    margin: 0;
    padding: 0.5rem;
    border-radius: var(--aster-radius-lg);
    width: min(322px, calc(100vw - 1.5rem));
    height: auto;
    overflow: auto;
    overscroll-behavior: contain;
    opacity: 1;
    transform: translateY(0) scale(1);
    transition:
      opacity var(--aster-dur-fast) var(--aster-ease-standard),
      transform var(--aster-dur-fast) var(--aster-ease-motion),
      display var(--aster-dur-fast),
      overlay var(--aster-dur-fast);
    transition-behavior: allow-discrete;
  }
  .dp-pop:not(:popover-open) { display: none; }
  @starting-style {
    .dp-pop:popover-open {
      opacity: 0;
      transform: translateY(-4px) scale(0.97);
    }
  }
`;

/** Convert a Date into local ISO `YYYY-MM-DD` without UTC timezone drift. */
export function toIsoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Parses `YYYY-MM-DD` or `MM/DD/YYYY` safely into a valid local Date. */
function parseFlexibleDate(raw?: string): Date | null {
  if (!raw) return null;
  const s = raw.trim();
  let y: number, m: number, d: number;
  if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(s)) {
    [y, m, d] = s.split('-').map(Number);
  } else if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(s)) {
    const parts = s.split('/').map(Number);
    m = parts[0];
    d = parts[1];
    y = parts[2];
  } else {
    return null;
  }
  if (m < 1 || m > 12 || d < 1 || d > 31) return null;
  const dt = new Date(y, m - 1, d);
  if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d) return null;
  return dt;
}

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export function* Calendar(
  props: {
    value?: string;
    defaultValue?: string;
    min?: string;
    max?: string;
    /** Earliest selectable year in the year dropdown (default: 1900 or min's year). */
    fromYear?: number;
    /** Latest selectable year in the year dropdown (default: currentYear + 20 or max's year). */
    toYear?: number;
    locale?: string;
    embedded?: boolean;
    onChange?: (isoDate: string) => void;
    class?: string;
  },
  ctx: Ctx,
) {
  const initialDate = parseFlexibleDate(props.value ?? props.defaultValue) ?? new Date();
  let viewYear = initialDate.getFullYear();
  let viewMonth = initialDate.getMonth();
  let internalVal = props.defaultValue ?? '';
  let draftText = props.value ?? props.defaultValue ?? '';
  let draftInvalid = false;
  let lastSyncedProp = props.value;

  for (props of ctx) {
    if (props.value !== lastSyncedProp) {
      lastSyncedProp = props.value;
      draftText = props.value ?? '';
      draftInvalid = false;
      const parsedNext = parseFlexibleDate(props.value);
      if (parsedNext) {
        viewYear = parsedNext.getFullYear();
        viewMonth = parsedNext.getMonth();
      }
    }

    const isControlled = props.value !== undefined;
    const selectedIso = isControlled ? (props.value ?? '') : internalVal;
    const todayIso = toIsoDate(new Date());
    const locale = props.locale ?? 'en-US';

    const minDate = parseFlexibleDate(props.min);
    const maxDate = parseFlexibleDate(props.max);
    const currentYear = new Date().getFullYear();
    const minYear = props.fromYear ?? (minDate ? minDate.getFullYear() : 1900);
    const maxYear = props.toYear ?? (maxDate ? maxDate.getFullYear() : currentYear + 20);

    const monthFormatter = new Intl.DateTimeFormat(locale, { month: 'short' });
    const months = Array.from({ length: 12 }, (_, idx) => ({
      idx,
      label: monthFormatter.format(new Date(2026, idx, 1)),
    }));
    const years: number[] = [];
    const loY = Math.min(minYear, viewYear);
    const hiY = Math.max(maxYear, viewYear);
    for (let y = hiY; y >= loY; y--) years.push(y);

    const gridLabel = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(
      new Date(viewYear, viewMonth, 1),
    );

    const firstDow = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();

    const cells: { iso: string; day: number; outside: boolean; disabled: boolean }[] = [];
    for (let i = firstDow - 1; i >= 0; i--) {
      const d = new Date(viewYear, viewMonth - 1, prevMonthDays - i);
      const iso = toIsoDate(d);
      cells.push({
        iso,
        day: d.getDate(),
        outside: true,
        disabled: Boolean((props.min && iso < props.min) || (props.max && iso > props.max)),
      });
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const iso = toIsoDate(new Date(viewYear, viewMonth, day));
      cells.push({
        iso,
        day,
        outside: false,
        disabled: Boolean((props.min && iso < props.min) || (props.max && iso > props.max)),
      });
    }
    while (cells.length < 42) {
      const nextDay = cells.length - firstDow - daysInMonth + 1;
      const d = new Date(viewYear, viewMonth + 1, nextDay);
      const iso = toIsoDate(d);
      cells.push({
        iso,
        day: d.getDate(),
        outside: true,
        disabled: Boolean((props.min && iso < props.min) || (props.max && iso > props.max)),
      });
    }

    const shiftMonth = (delta: number) => {
      const next = new Date(viewYear, viewMonth + delta, 1);
      viewYear = next.getFullYear();
      viewMonth = next.getMonth();
    };

    const selectDay = (iso: string) => {
      if (!isControlled) internalVal = iso;
      draftText = iso;
      draftInvalid = false;
      const parsed = parseFlexibleDate(iso);
      if (parsed) {
        viewYear = parsed.getFullYear();
        viewMonth = parsed.getMonth();
      }
      props.onChange?.(iso);
    };

    const commitDraft = () => {
      const parsed = parseFlexibleDate(draftText);
      if (!parsed) {
        draftInvalid = draftText.trim().length > 0;
        return;
      }
      const iso = toIsoDate(parsed);
      const outOfBounds = Boolean((props.min && iso < props.min) || (props.max && iso > props.max));
      if (outOfBounds) {
        draftInvalid = true;
        return;
      }
      selectDay(iso);
    };

    const jumpToday = () => {
      const now = new Date();
      viewYear = now.getFullYear();
      viewMonth = now.getMonth();
      const iso = toIsoDate(now);
      const outOfBounds = Boolean((props.min && iso < props.min) || (props.max && iso > props.max));
      if (!outOfBounds) selectDay(iso);
    };

    yield (
      <div
        class={[calScope, props.embedded ? 'is-embedded' : '', props.class]
          .filter(Boolean)
          .join(' ')}
      >
        <div class="cal-head">
          <button
            type="button"
            class="nav-btn"
            aria-label="Previous month"
            onClick={() => shiftMonth(-1)}
          >
            <Icon icon={ChevronLeft} size={15} />
          </button>

          <div class="cal-selects">
            <span class="cal-select-wrap">
              <select
                class="cal-select"
                aria-label="Select month"
                value={String(viewMonth)}
                onChange={(e: Event) => {
                  viewMonth = Number((e.target as HTMLSelectElement).value);
                }}
              >
                {months.map((m) => (
                  <option key={m.idx} value={String(m.idx)} selected={m.idx === viewMonth}>
                    {m.label}
                  </option>
                ))}
              </select>
              <span class="cal-select-chev" aria-hidden="true">
                <Icon icon={ChevronDown} size={13} />
              </span>
            </span>

            <span class="cal-select-wrap">
              <select
                class="cal-select"
                aria-label="Select year"
                value={String(viewYear)}
                onChange={(e: Event) => {
                  viewYear = Number((e.target as HTMLSelectElement).value);
                }}
              >
                {years.map((y) => (
                  <option key={y} value={String(y)} selected={y === viewYear}>
                    {y}
                  </option>
                ))}
              </select>
              <span class="cal-select-chev" aria-hidden="true">
                <Icon icon={ChevronDown} size={13} />
              </span>
            </span>
          </div>

          <button
            type="button"
            class="nav-btn"
            aria-label="Next month"
            onClick={() => shiftMonth(1)}
          >
            <Icon icon={ChevronRight} size={15} />
          </button>
        </div>

        <div class="cal-grid" role="group" aria-label={gridLabel}>
          {WEEKDAYS.map((w) => (
            <span key={w} class="dow" aria-hidden="true">
              {w}
            </span>
          ))}
          {cells.map((cell) => (
            <button
              key={cell.iso}
              type="button"

              disabled={cell.disabled}
              aria-pressed={cell.iso === selectedIso}
              aria-label={cell.iso}
              class="day"
              class:is-outside={cell.outside}
              class:is-today={cell.iso === todayIso}
              class:is-selected={cell.iso === selectedIso}
              onClick={() => selectDay(cell.iso)}
            >
              {cell.day}
            </button>
          ))}
        </div>

        <div class="cal-foot">
          <input
            type="text"
            class="cal-jump-input"
            aria-invalid={draftInvalid}
            class:is-err={draftInvalid}
            placeholder="YYYY-MM-DD"
            aria-label="Enter date (YYYY-MM-DD or MM/DD/YYYY)"
            bind:value={draftText}
            onBlur={commitDraft}
            onKeyDown={(e: KeyboardEvent) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                commitDraft();
              }
            }}
          />
          <button type="button" class="today-btn" onClick={jumpToday}>
            Today
          </button>
        </div>
      </div>
    );
  }
}

let dpSeq = 0;

export function* DatePicker(
  props: {
    label?: string;
    value?: string;
    defaultValue?: string;
    min?: string;
    max?: string;
    fromYear?: number;
    toYear?: number;
    placeholder?: string;
    locale?: string;
    onChange?: (isoDate: string) => void;
    class?: string;
  },
  ctx: Ctx,
) {
  const uid = `aster-dp-${++dpSeq}`;
  const popId = `${uid}-pop`;
  let internalVal = props.defaultValue ?? '';
  let isOpen = false;

  for (props of ctx) {
    const isControlled = props.value !== undefined;
    const current = isControlled ? (props.value ?? '') : internalVal;
    const parsed = parseFlexibleDate(current);
    const display = parsed
      ? new Intl.DateTimeFormat(props.locale ?? 'en-US', { dateStyle: 'medium' }).format(parsed)
      : '';

    const handleSelect = (iso: string) => {
      if (!isControlled) internalVal = iso;
      props.onChange?.(iso);
      const el = document.getElementById(popId) as any;
      el?.hidePopover?.();
    };

    const onToggle = (e: any) => {
      isOpen = e.newState === 'open';
      if (isOpen) {
        positionPopover(document.getElementById(uid), document.getElementById(popId), {
          align: 'end',
        });
      }
      ctx.refresh();
    };

    yield (
      <div class={[pickerScope, props.class].filter(Boolean).join(' ')}>
        {props.label ? (
          <label class="dp-label" for={uid}>
            {props.label}
          </label>
        ) : null}
        <button
          id={uid}
          type="button"
          class="dp-trigger"
          aria-expanded={isOpen}
          aria-controls={popId}
          aria-haspopup="dialog"
          popovertarget={popId}
        >
          <span class:dp-placeholder={!display}>
            {display || (props.placeholder ?? 'Pick a date…')}
          </span>
          <Icon icon={CalendarIcon} size={15} />
        </button>
        <div id={popId} popover="auto" class="aster-surface-popover dp-pop" on:toggle={onToggle}>
          <Calendar
            value={current}
            min={props.min}
            max={props.max}
            fromYear={props.fromYear}
            toYear={props.toYear}
            locale={props.locale}
            embedded
            onChange={handleSelect}
          />
        </div>
      </div>
    );
  }
}

/**
 * Aster-native `yield*` Date Picker Modal Flow.
 * Includes direct Month/Year dropdowns and quick date typing (ideal for birthdates or scheduling):
 *   const releaseDate = yield* pickDate({ title: 'Schedule Rollout', initial: '2026-12-01' });
 */
export function* pickDate(
  opts: {
    title?: string;
    description?: string;
    initial?: string;
    min?: string;
    max?: string;
    fromYear?: number;
    toYear?: number;
  } = {},
): Generator<View, string | null, any> {
  const decided = signal(false);
  const chosen = signal(opts.initial ?? toIsoDate(new Date()));
  let result: string | null = null;

  while (!decided()) {
    yield (
      <Dialog
        open={[
          () => !decided(),
          (v: boolean) => {
            if (!v && !decided()) {
              result = null;
              decided.set(true);
            }
          },
        ]}
        title={opts.title ?? 'Select Date'}
        description={opts.description}
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => {
                result = null;
                decided.set(true);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                result = chosen();
                decided.set(true);
              }}
            >
              Confirm Date
            </Button>
          </>
        }
      >
        <div style="display:flex; justify-content:center">
          <Calendar
            value={chosen()}
            min={opts.min}
            max={opts.max}
            fromYear={opts.fromYear}
            toYear={opts.toYear}
            embedded
            onChange={(iso) => chosen.set(iso)}
          />
        </div>
      </Dialog>
    );
  }

  return result;
}
