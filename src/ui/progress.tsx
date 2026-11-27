import { scope } from '@fierst/aster';

const progScope = scope`
  :scope {
    display: grid;
    gap: 0.35rem;
    font-family: var(--aster-font-sans);
  }
  .prog-meta {
    display: flex;
    justify-content: space-between;
    font-size: 0.82rem;
    color: var(--aster-on-surface-variant);
  }
  .prog-val { font-family: var(--aster-font-mono); font-weight: 600; color: var(--aster-on-surface); }
  .track {
    position: relative;
    height: 8px;
    border-radius: var(--aster-radius-full);
    background: var(--aster-primary-container);
    overflow: hidden;
  }
  .fill {
    height: 100%;
    border-radius: var(--aster-radius-full);
    background: var(--aster-primary);
    transition: width var(--aster-dur-med) var(--aster-ease-spring);
  }
  .fill.is-indeterminate {
    width: 38%;
    animation: aster-indet 1.25s var(--aster-ease-standard) infinite;
  }
  @keyframes aster-indet {
    0% { transform: translateX(-110%); }
    100% { transform: translateX(300%); }
  }
`;

export function Progress({
  value,
  max = 100,
  label,
  showValue = false,
  class: extraClass,
}: {
  value?: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  class?: string;
}) {
  max = Number.isFinite(max) && max > 0 ? max : 100;
  const indeterminate = value === undefined || !Number.isFinite(value);
  const current = indeterminate ? undefined : Math.max(0, Math.min(max, value));
  const pct = ((current ?? 0) / max) * 100;

  return (
    <div class={[progScope, extraClass].filter(Boolean).join(' ')}>
      {label || (showValue && !indeterminate) ? (
        <div class="prog-meta">
          <span>{label ?? ''}</span>
          {showValue && !indeterminate ? <span class="prog-val">{Math.round(pct)}%</span> : null}
        </div>
      ) : null}
      <div
        class="track"
        role="progressbar"
        aria-label={label ?? 'Progress'}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={current}
      >
        <div
          class="fill"
          class:is-indeterminate={indeterminate}
          style={indeterminate ? undefined : { width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

const ringScope = scope`
  :scope {
    position: relative;
    display: inline-grid;
    place-items: center;
  }
  svg { transform: rotate(-90deg); }
  .bg-ring { stroke: var(--aster-primary-container); fill: none; }
  .fg-ring {
    stroke: var(--aster-primary);
    fill: none;
    stroke-linecap: round;
    transition: stroke-dashoffset var(--aster-dur-med) var(--aster-ease-spring);
  }
  .ring-label {
    position: absolute;
    font-family: var(--aster-font-mono);
    font-size: 0.74rem;
    font-weight: 650;
    color: var(--aster-on-surface);
  }
`;

export function ProgressRing({
  value,
  size = 52,
  strokeWidth = 5,
  showLabel = true,
  label = 'Progress',
  class: extraClass,
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
  label?: string;
  class?: string;
}) {
  const clamped = Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0));
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - clamped / 100);

  return (
    <div
      aria-label={label}
      class={[ringScope, extraClass].filter(Boolean).join(' ')}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped)}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle class="bg-ring" cx={size / 2} cy={size / 2} r={r} stroke-width={strokeWidth} />
        <circle
          class="fg-ring"
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke-width={strokeWidth}
          stroke-dasharray={c}
          stroke-dashoffset={offset}
        />
      </svg>
      {showLabel ? <span class="ring-label">{Math.round(clamped)}%</span> : null}
    </div>
  );
}

const skelScope = scope`
  :scope {
    display: block;
    background: linear-gradient(
      90deg,
      var(--aster-surface-low) 25%,
      var(--aster-surface-high) 50%,
      var(--aster-surface-low) 75%
    );
    background-size: 200% 100%;
    animation: aster-shimmer 1.4s ease-in-out infinite;
    border-radius: var(--aster-radius-sm);
  }
  :scope.shape-circle { border-radius: var(--aster-radius-full); }
  :scope.shape-pill { border-radius: var(--aster-radius-full); }
  @keyframes aster-shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

export function Skeleton({
  width = '100%',
  height = '1rem',
  shape = 'rect',
  class: extraClass,
}: {
  width?: string;
  height?: string;
  shape?: 'rect' | 'pill' | 'circle';
  class?: string;
}) {
  return (
    <span
      aria-hidden="true"
      class={[skelScope, shape !== 'rect' ? `shape-${shape}` : '', extraClass]
        .filter(Boolean)
        .join(' ')}
      style={{ width, height }}
    />
  );
}
