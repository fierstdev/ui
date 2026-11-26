import { scope, type View } from '@fierst/aster';

const dlScope = scope`
  :scope {
    margin: 0;
    border-radius: var(--aster-radius-lg);
    border: 1px solid var(--aster-border);
    background: var(--aster-surface);
    overflow: hidden;
    font-family: var(--aster-font-sans);
  }
  .dl-row {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.25rem;
    padding: 0.85rem 1.15rem;
    border-bottom: 1px solid var(--aster-border);
  }
  .dl-row:last-child { border-bottom: none; }
  :scope.is-striped .dl-row:nth-child(even) { background: var(--aster-surface-muted); }
  @media (min-width: 640px) {
    .dl-row {
      grid-template-columns: minmax(140px, 32%) minmax(0, 1fr);
      gap: 1rem;
      align-items: baseline;
    }
  }
  dt {
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--aster-on-surface-muted);
  }
  dd {
    margin: 0;
    font-size: 0.875rem;
    color: var(--aster-on-surface);
    min-width: 0;
  }
`;

export interface DescriptionItem {
  id?: string;
  term: string;
  detail: View;
}

export function DescriptionList({
  items,
  striped = false,
  class: extraClass,
}: {
  items: readonly DescriptionItem[];
  striped?: boolean;
  class?: string;
}) {
  return (
    <dl class={[dlScope, striped ? 'is-striped' : '', extraClass].filter(Boolean).join(' ')}>
      {items.map((item, idx) => (
        <div key={item.id ?? `${item.term}-${idx}`} class="dl-row">
          <dt>{item.term}</dt>
          <dd>{item.detail}</dd>
        </div>
      ))}
    </dl>
  );
}
