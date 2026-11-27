import './theme.css';
import { TrendingDown, TrendingUp } from '@lucide/icons';
import { scope, type View } from '@fierst/aster';
import { Icon, type LucideIconInput } from './icon';

const statScope = scope`
  :scope {
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
    padding: 1.15rem 1.25rem;
    border-radius: var(--aster-radius-lg);
    border: 1px solid var(--aster-border);
    background: var(--aster-surface);
    box-shadow: var(--aster-shadow-xs);
    font-family: var(--aster-font-sans);
    min-width: 0;
  }
  .st-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
  }
  .st-label {
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--aster-on-surface-muted);
  }
  .st-icon { color: var(--aster-on-surface-subtle); display: inline-flex; }
  .st-val-row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.75rem;
    flex-wrap: wrap;
  }
  .st-val {
    font-family: var(--aster-font-display);
    font-size: 1.6rem;
    font-weight: 700;
    letter-spacing: -0.025em;
    font-variant-numeric: tabular-nums;
    color: var(--aster-on-surface);
    line-height: 1.15;
  }
  .st-delta {
    display: inline-flex;
    align-items: center;
    gap: 0.2rem;
    padding: 0.12rem 0.45rem;
    border-radius: var(--aster-radius-badge);
    font-size: 0.74rem;
    font-weight: 600;
    border: 1px solid transparent;
  }
  .st-delta.tr-up {
    background: var(--aster-success-subtle);
    color: var(--aster-on-success-subtle);
    border-color: var(--aster-success-border);
  }
  .st-delta.tr-down {
    background: var(--aster-danger-subtle);
    color: var(--aster-on-danger-subtle);
    border-color: var(--aster-danger-border);
  }
  .st-delta.tr-neutral {
    background: var(--aster-surface-muted);
    color: var(--aster-on-surface-muted);
    border-color: var(--aster-border);
  }
  .st-sub { font-size: 0.76rem; color: var(--aster-on-surface-subtle); }
  .spark { width: 100%; height: 28px; display: block; margin-top: 0.15rem; }
  .spark polyline { fill: none; stroke: var(--aster-primary); stroke-width: 1.75; stroke-linecap: round; stroke-linejoin: round; }
`;

const gridScope = scope`
  :scope {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.9rem;
  }
  @media (min-width: 640px) {
    :scope { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }
  @media (min-width: 1024px) {
    :scope { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  }
`;

export function StatCard({
  label,
  value,
  delta,
  trend = 'neutral',
  description,
  icon,
  sparkline,
  class: extraClass,
}: {
  label: string;
  value: string | number;
  delta?: string;
  trend?: 'up' | 'down' | 'neutral';
  description?: string;
  icon?: LucideIconInput;
  sparkline?: readonly number[];
  class?: string;
}) {
  let points = '';
  if (sparkline && sparkline.length > 1) {
    const min = Math.min(...sparkline);
    const max = Math.max(...sparkline);
    const span = max - min || 1;
    points = sparkline
      .map((v, i) => {
        const x = (i / (sparkline.length - 1)) * 120;
        const y = 24 - ((v - min) / span) * 20;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  }

  return (
    <div class={[statScope, extraClass].filter(Boolean).join(' ')}>
      <div class="st-top">
        <span class="st-label">{label}</span>
        {icon ? (
          <span class="st-icon" aria-hidden="true">
            <Icon icon={icon} size={16} />
          </span>
        ) : null}
      </div>
      <div class="st-val-row">
        <span class="st-val">{value}</span>
        {delta ? (
          <span class={`st-delta tr-${trend}`}>
            {trend === 'up' ? (
              <Icon icon={TrendingUp} size={12} />
            ) : trend === 'down' ? (
              <Icon icon={TrendingDown} size={12} />
            ) : null}
            <span>{delta}</span>
          </span>
        ) : null}
      </div>
      {description ? <span class="st-sub">{description}</span> : null}
      {points ? (
        <svg class="spark" viewBox="0 0 120 28" preserveAspectRatio="none" aria-hidden="true">
          <polyline points={points} />
        </svg>
      ) : null}
    </div>
  );
}

export function StatGrid(props: { class?: string; children?: View }) {
  return <div class={[gridScope, props.class].filter(Boolean).join(' ')}>{props.children}</div>;
}
