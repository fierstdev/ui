import './theme.css';
import { scope, type Ctx } from '@fierst/aster';

const bcScope = scope`
  :scope {
    display: grid;
    gap: 0.5rem;
    font-family: var(--aster-font-sans);
    min-width: 0;
  }
  .bc-meta { display: flex; justify-content: space-between; align-items: baseline; font-size: 0.8rem; color: var(--aster-on-surface-muted); min-height: 1.25rem; }
  .bc-val { font-family: var(--aster-font-mono); font-weight: 600; color: var(--aster-on-surface); }
  svg { width: 100%; height: auto; display: block; overflow: visible; }
  .grid-line { stroke: var(--aster-border); stroke-dasharray: 3 3; }
  .bar-rect { fill: var(--aster-primary); transition: opacity var(--aster-dur-fast); cursor: pointer; }
  .bar-rect.is-dim { opacity: 0.45; }
  .axis-lbl { fill: var(--aster-on-surface-subtle); font-size: 11px; font-family: var(--aster-font-sans); }
`;

export interface ChartDatum {
  label: string;
  value: number;
}

export function* BarChart(
  props: {
    data: readonly ChartDatum[];
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
    const padB = 24;
    const padT = 12;
    const plotH = h - padB - padT;
    const maxVal = props.data.reduce((max, d) => Math.max(max, d.value), 0);
    const minVal = props.data.reduce((min, d) => Math.min(min, d.value), 0);
    const scale = plotH / (maxVal - minVal || 1);
    const baseline = padT + maxVal * scale;
    const n = Math.max(1, props.data.length);
    const slotW = w / n;
    const barW = Math.min(38, slotW * 0.62);
    const active = hoveredIdx >= 0 ? props.data[hoveredIdx] : null;

    yield (
      <div class={[bcScope, props.class].filter(Boolean).join(' ')}>
        <div class="bc-meta">
          <span>{active ? active.label : (props.label ?? 'Overview')}</span>
          <span class="bc-val">
            {active
              ? `${active.value.toLocaleString()}${props.unit ?? ''}`
              : `Max: ${maxVal.toLocaleString()}${props.unit ?? ''}`}
          </span>
        </div>
        <svg
          viewBox={`0 0 ${w} ${h}`}
          role="img"
          aria-label={props.label ?? 'Bar chart'}
          on:pointerleave={() => (hoveredIdx = -1)}
        >
          <desc>
            {props.data.map((d) => d.label + ': ' + d.value + (props.unit ?? '')).join(', ')}
          </desc>
          {[0.25, 0.5, 0.75, 1].map((t) => {
            const y = padT + plotH * (1 - t);
            return <line key={t} class="grid-line" x1="0" y1={y} x2={w} y2={y} />;
          })}
          {props.data.map((d, idx) => {
            const bh = Math.abs(d.value) * scale;
            const x = idx * slotW + (slotW - barW) / 2;
            const y = d.value > 0 ? baseline - bh : baseline;
            return (
              <g key={d.label} on:pointerenter={() => (hoveredIdx = idx)}>
                <rect
                  x={x}
                  y={y}
                  width={barW}
                  height={bh}
                  rx="4"
                  class="bar-rect"
                  class:is-dim={hoveredIdx >= 0 && hoveredIdx !== idx}
                />
                <text x={x + barW / 2} y={h - 6} text-anchor="middle" class="axis-lbl">
                  {d.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  }
}
