import './theme.css';
import { scope } from '@fierst/aster';

const dotScope = scope`
  :scope {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    font-family: var(--aster-font-sans);
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--aster-on-surface);
  }
  .pip-wrap { position: relative; width: 9px; height: 9px; display: inline-flex; }
  .pip { width: 9px; height: 9px; border-radius: 50%; background: var(--aster-on-surface-subtle); position: relative; z-index: 1; }
  .pulse {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    opacity: 0.55;
    animation: aster-ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
  }
  :scope.st-operational .pip, :scope.st-operational .pulse { background: var(--aster-success); }
  :scope.st-degraded .pip, :scope.st-degraded .pulse { background: var(--aster-warning); }
  :scope.st-outage .pip, :scope.st-outage .pulse { background: var(--aster-danger); }
  @keyframes aster-ping {
    75%, 100% { transform: scale(2.1); opacity: 0; }
  }
`;

const upScope = scope`
  :scope { display: grid; gap: 0.4rem; font-family: var(--aster-font-sans); }
  .up-head { display: flex; justify-content: space-between; font-size: 0.8125rem; }
  .up-name { font-weight: 550; color: var(--aster-on-surface); }
  .up-pct { font-family: var(--aster-font-mono); color: var(--aster-success); font-weight: 600; }
  .up-bars { display: flex; gap: 2px; height: 26px; align-items: stretch; }
  .up-seg { flex: 1; border-radius: 2px; background: var(--aster-success); opacity: 0.88; transition: opacity var(--aster-dur-fast); }
  .up-seg:hover { opacity: 1; }
  .up-seg.s-degraded { background: var(--aster-warning); }
  .up-seg.s-outage { background: var(--aster-danger); }
  .up-seg.s-empty { background: var(--aster-surface-accent); }
`;

export function StatusDot({
  status = 'operational',
  label,
  pulse = true,
  class: extraClass,
}: {
  status?: 'operational' | 'degraded' | 'outage' | 'idle';
  label?: string;
  pulse?: boolean;
  class?: string;
}) {
  return (
    <span class={[dotScope, `st-${status}`, extraClass].filter(Boolean).join(' ')}>
      <span class="pip-wrap" aria-hidden="true">
        {pulse && status !== 'idle' ? <span class="pulse" /> : null}
        <span class="pip" />
      </span>
      {label ? <span>{label}</span> : null}
    </span>
  );
}

export function UptimeBar({
  name,
  uptimePct = '99.98%',
  days,
  class: extraClass,
}: {
  name: string;
  uptimePct?: string;
  days: readonly { label: string; status: 'operational' | 'degraded' | 'outage' | 'empty' }[];
  class?: string;
}) {
  return (
    <div class={[upScope, extraClass].filter(Boolean).join(' ')}>
      <div class="up-head">
        <span class="up-name">{name}</span>
        <span class="up-pct">{uptimePct}</span>
      </div>
      <div class="up-bars" role="img" aria-label={`${name} uptime ${uptimePct}`}>
        {days.map((d, i) => (
          <span
            key={`${d.label}-${i}`}
            class={`up-seg s-${d.status}`}
            title={`${d.label}: ${d.status}`}
          />
        ))}
      </div>
    </div>
  );
}
