import './theme.css';
import { scope } from '@fierst/aster';

const hmScope = scope`
  :scope { display: grid; gap: 0.5rem; font-family: var(--aster-font-sans); overflow-x: auto; }
  .hm-grid { display: grid; grid-template-rows: repeat(7, 12px); grid-auto-flow: column; grid-auto-columns: 12px; gap: 3px; }
  .hm-cell {
    width: 12px;
    height: 12px;
    border-radius: 2px;
    background: var(--aster-surface-muted);
    border: 1px solid var(--aster-border);
  }
  .hm-cell.l-1 { background: color-mix(in srgb, var(--aster-primary) 24%, var(--aster-surface)); border-color: transparent; }
  .hm-cell.l-2 { background: color-mix(in srgb, var(--aster-primary) 50%, var(--aster-surface)); border-color: transparent; }
  .hm-cell.l-3 { background: color-mix(in srgb, var(--aster-primary) 76%, var(--aster-surface)); border-color: transparent; }
  .hm-cell.l-4 { background: var(--aster-primary); border-color: transparent; }
  .hm-legend { display: flex; align-items: center; justify-content: flex-end; gap: 4px; font-size: 0.72rem; color: var(--aster-on-surface-subtle); }
`;

export function CalendarHeatmap({
  values,
  label = 'Activity heatmap',
  class: extraClass,
}: {
  /** Array of { date, count } entries (typically 7 * weeks). */
  values: readonly { date: string; count: number }[];
  label?: string;
  class?: string;
}) {
  const max = Math.max(...values.map((v) => v.count), 1);
  const level = (count: number) => {
    if (count <= 0) return 0;
    const ratio = count / max;
    if (ratio <= 0.25) return 1;
    if (ratio <= 0.5) return 2;
    if (ratio <= 0.75) return 3;
    return 4;
  };

  return (
    <div class={[hmScope, extraClass].filter(Boolean).join(' ')} role="img" aria-label={label}>
      <div class="hm-grid">
        {values.map((item) => (
          <span
            key={item.date}
            class={`hm-cell l-${level(item.count)}`}
            title={`${item.date}: ${item.count}`}
          />
        ))}
      </div>
      <div class="hm-legend" aria-hidden="true">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((l) => (
          <span key={l} class={`hm-cell l-${l}`} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
