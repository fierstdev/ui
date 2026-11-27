import { Calendar as CalendarIcon } from '@lucide/icons';
import { scope, type Ctx } from '@fierst/aster';
import { Icon } from './icon.tsx';
import { toIsoDate } from './calendar.tsx';
import { positionPopover } from './theme.ts';

const drScope = scope`
  :scope { display: grid; gap: 0.375rem; font-family: var(--aster-font-sans); }
  .dr-label { font-size: 0.84rem; font-weight: 500; color: var(--aster-on-surface); }
  .dr-trigger {
    width: 100%;
    min-height: var(--aster-control-md);
    padding: 0 0.8rem;
    border-radius: var(--aster-radius-control);
    border: 1px solid var(--aster-input-border);
    background: var(--aster-surface);
    color: var(--aster-on-surface);
    box-shadow: var(--aster-shadow-xs);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    font: inherit;
    font-size: 0.875rem;
    cursor: pointer;
  }
  .dr-pop {
    position: fixed;
    inset: auto;
    margin: 0;
    padding: 0.85rem;
    border-radius: var(--aster-radius-lg);
    width: min(340px, calc(100vw - 1.5rem));
    display: grid;
    gap: 0.75rem;
  }
  .dr-pop:not(:popover-open) { display: none; }
  .dr-presets { display: flex; flex-wrap: wrap; gap: 0.35rem; }
  .dr-chip {
    padding: 0.25rem 0.55rem;
    border-radius: var(--aster-radius-sm);
    border: 1px solid var(--aster-border);
    background: var(--aster-surface-muted);
    color: var(--aster-on-surface);
    font-size: 0.76rem;
    font-weight: 500;
    cursor: pointer;
  }
  .dr-chip:hover { border-color: var(--aster-primary); color: var(--aster-primary); }
  .dr-inputs { display: grid; grid-template-columns: 1fr 1fr; gap: 0.55rem; }
  .dr-field { display: grid; gap: 0.25rem; font-size: 0.76rem; color: var(--aster-on-surface-muted); }
  .dr-field input {
    height: 34px;
    padding: 0 0.5rem;
    border-radius: var(--aster-radius-sm);
    border: 1px solid var(--aster-input-border);
    background: var(--aster-surface);
    color: var(--aster-on-surface);
    font-family: var(--aster-font-mono);
    font-size: 0.8rem;
  }
`;

export interface DateRange {
  start: string;
  end: string;
}

let drSeq = 0;

export function* DateRangePicker(
  props: {
    label?: string;
    value?: DateRange;
    defaultValue?: DateRange;
    onChange?: (range: DateRange) => void;
    class?: string;
  },
  ctx: Ctx,
) {
  const uid = `aster-dr-${++drSeq}`;
  const popId = `${uid}-pop`;
  const today = new Date();
  const weekAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6);
  let internal: DateRange = props.defaultValue ?? {
    start: toIsoDate(weekAgo),
    end: toIsoDate(today),
  };

  for (props of ctx) {
    const isControlled = props.value !== undefined;
    const current = isControlled ? props.value! : internal;

    const commit = (next: DateRange) => {
      const normalized =
        next.start && next.end && next.start > next.end
          ? { start: next.end, end: next.start }
          : next;
      if (!isControlled) internal = normalized;
      props.onChange?.(normalized);
    };

    const applyDays = (days: number) => {
      const end = new Date();
      const start = new Date(end.getFullYear(), end.getMonth(), end.getDate() - days + 1);
      commit({ start: toIsoDate(start), end: toIsoDate(end) });
    };

    yield (
      <div class={[drScope, props.class].filter(Boolean).join(' ')}>
        {props.label ? (
          <label class="dr-label" for={uid}>
            {props.label}
          </label>
        ) : null}
        <button id={uid} type="button" class="dr-trigger" popovertarget={popId}>
          <span>
            {current.start} &rarr; {current.end}
          </span>
          <Icon icon={CalendarIcon} size={15} />
        </button>
        <div
          id={popId}
          popover="auto"
          class="aster-surface-popover dr-pop"
          on:toggle={(e: any) => {
            if (e.newState === 'open')
              positionPopover(document.getElementById(uid), document.getElementById(popId));
          }}
        >
          <div class="dr-presets">
            <button type="button" class="dr-chip" onClick={() => applyDays(7)}>
              Last 7 days
            </button>
            <button type="button" class="dr-chip" onClick={() => applyDays(30)}>
              Last 30 days
            </button>
            <button type="button" class="dr-chip" onClick={() => applyDays(90)}>
              Last 90 days
            </button>
          </div>
          <div class="dr-inputs">
            <label class="dr-field">
              <span>Start date</span>
              <input
                type="date"
                value={current.start}
                onChange={(e: Event) =>
                  commit({ ...current, start: (e.target as HTMLInputElement).value })
                }
              />
            </label>
            <label class="dr-field">
              <span>End date</span>
              <input
                type="date"
                value={current.end}
                onChange={(e: Event) =>
                  commit({ ...current, end: (e.target as HTMLInputElement).value })
                }
              />
            </label>
          </div>
        </div>
      </div>
    );
  }
}
