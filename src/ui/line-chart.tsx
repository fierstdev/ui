import './theme.css';
import { scope, type Ctx } from '@fierst/aster';

const lcScope = scope`
  :scope { display: grid; gap: 0.5rem; font-family: var(--aster-font-sans); min-width: 0; }
  .lc-meta { display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--aster-on-surface-muted); }
  .lc-val { font-family: var(--aster-font-mono); font-weight: 600; color: var(--aster-on-surface); }
  svg { width: 100%; height: auto; display: block; overflow: visible; }
  .grid-line { stroke: var(--aster-border); stroke-dasharray: 3 3; }
  .line-path { fill: none; stroke: var(--aster-primary); stroke-width: 2.25; stroke-linecap: round; stroke-linejoin: round; }
  .area-path { fill: var(--aster-primary); opacity: 0.12; }
  .pt { fill: var(--aster-surface); stroke: var(--aster-primary); stroke-width: 2; cursor: pointer; }
  .pt.is-active { fill: var(--aster-primary); }
  .axis-lbl { fill: var(--aster-on-surface-subtle); font-size: 11px; }
`;

export function* LineChart(
  props: {
    data: readonly { label: string; value: number }[];
    area?: boolean;
    height?: number;
    unit?: string;
    label?: string;
    class?: string;
  },
  ctx: Ctx,
) {
  let hoveredIdx = -1;

  for (props of ctx) {
    const h = props.height ?? 190;
    const w = 420;
    const padX = 16;
    const padT = 12;
    const padB = 24;
    const plotW = w - padX * 2;
    const plotH = h - padT - padB;
    const maxVal = Math.max(...props.data.map((d) => d.value), 1);
    const minVal = Math.min(...props.data.map((d) => d.value), 0);
    const span = Math.max(1, maxVal - minVal);
    const n = Math.max(2, props.data.length);

    const pts = props.data.map((d, i) => ({
      ...d,
      x: padX + (i / (n - 1)) * plotW,
      y: padT + plotH - ((d.value - minVal) / span) * plotH,
    }));

    const lineD = pts
      .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
      .join(' ');
    const areaD =
      pts.length > 0
        ? `${lineD} L${pts[pts.length - 1].x.toFixed(1)},${(padT + plotH).toFixed(1)} L${pts[0].x.toFixed(1)},${(padT + plotH).toFixed(1)} Z`
        : '';
    const active = hoveredIdx >= 0 ? pts[hoveredIdx] : pts[pts.length - 1];

    yield (
      <div class={[lcScope, props.class].filter(Boolean).join(' ')}>
        <div class="lc-meta">
          <span>{active ? active.label : (props.label ?? 'Trend')}</span>
          <span class="lc-val">
            {active ? `${active.value.toLocaleString()}${props.unit ?? ''}` : ''}
          </span>
        </div>
        <svg
          viewBox={`0 0 ${w} ${h}`}
          role="img"
          aria-label={props.label ?? 'Line chart'}
          on:pointerleave={() => (hoveredIdx = -1)}
        >
          {[0.25, 0.5, 0.75, 1].map((t) => {
            const y = padT + plotH * (1 - t);
            return <line key={t} class="grid-line" x1={padX} y1={y} x2={w - padX} y2={y} />;
          })}
          {props.area && areaD ? <path d={areaD} class="area-path" /> : null}
          {lineD ? <path d={lineD} class="line-path" /> : null}
          {pts.map((p, idx) => (
            <g key={p.label} on:pointerenter={() => (hoveredIdx = idx)}>
              <circle
                cx={p.x}
                cy={p.y}
                r={hoveredIdx === idx ? 5 : 3.5}
                class="pt"
                class:is-active={hoveredIdx === idx}
              />
              <text x={p.x} y={h - 6} text-anchor="middle" class="axis-lbl">
                {p.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    );
  }
}

export function AreaChart(props: {
  data: readonly { label: string; value: number }[];
  height?: number;
  unit?: string;
  label?: string;
  class?: string;
}) {
  return <LineChart {...props} area />;
}
