import './theme.css';
import { scope } from '@fierst/aster';

const spScope = scope`
  :scope { display: inline-block; vertical-align: middle; }
  polyline { fill: none; stroke-width: 1.75; stroke-linecap: round; stroke-linejoin: round; }
`;

export function Sparkline({
  values,
  width = 88,
  height = 24,
  tone = 'primary',
  class: extraClass,
}: {
  values: readonly number[];
  width?: number;
  height?: number;
  tone?: 'primary' | 'success' | 'warning' | 'danger';
  class?: string;
}) {
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pts = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * width;
      const y = height - 3 - ((v - min) / span) * (height - 6);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
  const stroke =
    tone === 'success'
      ? 'var(--aster-success)'
      : tone === 'warning'
        ? 'var(--aster-warning)'
        : tone === 'danger'
          ? 'var(--aster-danger)'
          : 'var(--aster-primary)';

  return (
    <svg
      class={[spScope, extraClass].filter(Boolean).join(' ')}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
    >
      <polyline points={pts} stroke={stroke} />
    </svg>
  );
}
