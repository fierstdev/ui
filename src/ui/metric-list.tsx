import { scope } from '@fierst/aster';

const mlScope = scope`
  :scope { display: grid; gap: 0.5rem; font-family: var(--aster-font-sans); }
  .ml-row { position: relative; display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; padding: 0.45rem 0.65rem; border-radius: var(--aster-radius-sm); overflow: hidden; }
  .ml-fill {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    background: var(--aster-primary-subtle);
    border-radius: var(--aster-radius-sm);
    z-index: 0;
  }
  .ml-name { position: relative; z-index: 1; font-size: 0.84rem; font-weight: 500; color: var(--aster-on-surface); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .ml-val { position: relative; z-index: 1; font-family: var(--aster-font-mono); font-size: 0.8rem; font-weight: 600; color: var(--aster-on-surface); flex-shrink: 0; }
`;

export function MetricList({
  items,
  unit = '',
  class: extraClass,
}: {
  items: readonly { label: string; value: number }[];
  unit?: string;
  class?: string;
}) {
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <div class={[mlScope, extraClass].filter(Boolean).join(' ')}>
      {items.map((it) => (
        <div key={it.label} class="ml-row">
          <div class="ml-fill" style={{ width: `${Math.max(4, (it.value / max) * 100)}%` }} />
          <span class="ml-name">{it.label}</span>
          <span class="ml-val">
            {it.value.toLocaleString()}
            {unit}
          </span>
        </div>
      ))}
    </div>
  );
}
