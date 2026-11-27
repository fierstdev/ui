import { scope } from '@fierst/aster';

const dcScope = scope`
  :scope {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1.25rem;
    font-family: var(--aster-font-sans);
  }
  .dc-ring { position: relative; display: inline-grid; place-items: center; flex-shrink: 0; }
  svg { transform: rotate(-90deg); display: block; }
  .dc-center { position: absolute; text-align: center; line-height: 1.2; }
  .dc-total { font-size: 1.15rem; font-weight: 700; font-variant-numeric: tabular-nums; color: var(--aster-on-surface); display: block; }
  .dc-sub { font-size: 0.72rem; color: var(--aster-on-surface-muted); }
  .dc-legend { display: grid; gap: 0.45rem; flex: 1; min-width: 150px; }
  .dc-row { display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; font-size: 0.82rem; }
  .dc-left { display: inline-flex; align-items: center; gap: 0.45rem; color: var(--aster-on-surface); }
  .dc-swatch { width: 9px; height: 9px; border-radius: 2px; flex-shrink: 0; }
  .dc-num { font-family: var(--aster-font-mono); color: var(--aster-on-surface-muted); }
`;

const PALETTE = [
  'var(--aster-primary)',
  'var(--aster-success)',
  'var(--aster-warning)',
  'var(--aster-danger)',
  'var(--aster-border-strong)',
];

export interface DonutSlice {
  label: string;
  value: number;
  color?: string;
}

export function DonutChart({
  data,
  size = 136,
  strokeWidth = 18,
  centerLabel = 'Total',
  class: extraClass,
}: {
  data: readonly DonutSlice[];
  size?: number;
  strokeWidth?: number;
  centerLabel?: string;
  class?: string;
}) {
  const amount = (value: number) => (Number.isFinite(value) ? Math.max(0, value) : 0);
  const total = data.reduce((sum, slice) => sum + amount(slice.value), 0);
  const fraction = (value: number) => (total ? amount(value) / total : 0);
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div class={[dcScope, extraClass].filter(Boolean).join(' ')}>
      <div class="dc-ring" style={{ width: `${size}px`, height: `${size}px` }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          role="img"
          aria-label={centerLabel}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="var(--aster-surface-muted)"
            stroke-width={strokeWidth}
          />
          {data.map((slice, idx) => {
            const frac = fraction(slice.value);
            const seg = frac * circ;
            const dashOffset = -offset;
            offset += seg;
            const color = slice.color ?? PALETTE[idx % PALETTE.length];
            return (
              <circle
                key={slice.label}
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke={color}
                stroke-width={strokeWidth}
                stroke-dasharray={`${seg} ${circ - seg}`}
                stroke-dashoffset={dashOffset}
              />
            );
          })}
        </svg>
        <div class="dc-center">
          <span class="dc-total">{total.toLocaleString()}</span>
          <span class="dc-sub">{centerLabel}</span>
        </div>
      </div>

      <div class="dc-legend">
        {data.map((slice, idx) => (
          <div key={slice.label} class="dc-row">
            <span class="dc-left">
              <span
                class="dc-swatch"
                style={{ background: slice.color ?? PALETTE[idx % PALETTE.length] }}
              />
              <span>{slice.label}</span>
            </span>
            <span class="dc-num">{Math.round(fraction(slice.value) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
