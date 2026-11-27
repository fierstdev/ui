import './theme.css';
import { scope } from '@fierst/aster';

const meterScope = scope`
  :scope { display: grid; gap: 0.35rem; font-family: var(--aster-font-sans); }
  .mt-head { display: flex; justify-content: space-between; gap: 0.5rem; font-size: 0.8125rem; }
  .mt-label { font-weight: 500; color: var(--aster-on-surface); }
  .mt-val { font-family: var(--aster-font-mono); color: var(--aster-on-surface-muted); }
  .mt-track {
    height: 8px;
    border-radius: 9999px;
    background: var(--aster-surface-muted);
    border: 1px solid var(--aster-border);
    overflow: hidden;
  }
  .mt-fill {
    height: 100%;
    border-radius: 9999px;
    transition: width var(--aster-dur-med) var(--aster-ease-motion);
  }
  .mt-fill.lvl-ok { background: var(--aster-success); }
  .mt-fill.lvl-warn { background: var(--aster-warning); }
  .mt-fill.lvl-high { background: var(--aster-danger); }
`;

export function Meter({
  label,
  value,
  max = 100,
  warnAt = 75,
  dangerAt = 90,
  valueLabel,
  class: extraClass,
}: {
  label: string;
  value: number;
  max?: number;
  warnAt?: number;
  dangerAt?: number;
  valueLabel?: string;
  class?: string;
}) {
  max = Number.isFinite(max) && max > 0 ? max : 100;
  value = Number.isFinite(value) ? Math.max(0, Math.min(max, value)) : 0;
  const pct = (value / max) * 100;
  const lvl = pct >= dangerAt ? 'lvl-high' : pct >= warnAt ? 'lvl-warn' : 'lvl-ok';
  return (
    <div class={[meterScope, extraClass].filter(Boolean).join(' ')}>
      <div class="mt-head">
        <span class="mt-label">{label}</span>
        <span class="mt-val">{valueLabel ?? `${Math.round(pct)}%`}</span>
      </div>
      <div
        class="mt-track"
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={valueLabel}
      >
        <div class={`mt-fill ${lvl}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
