import './theme.css';
import { scope, type View } from '@fierst/aster';

const gridScope = scope`
  :scope { display: grid; grid-template-columns: 1fr; gap: 1rem; min-width: 0; }
  @media (min-width: 640px) {
    :scope.cols-2, :scope.cols-3, :scope.cols-4 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }
  @media (min-width: 960px) {
    :scope.cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    :scope.cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  }
`;

const bentoCardScope = scope`
  :scope {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 0.85rem;
    padding: 1.25rem;
    border-radius: var(--aster-radius-lg);
    border: 1px solid var(--aster-border);
    background: var(--aster-surface);
    box-shadow: var(--aster-shadow-xs);
    min-width: 0;
    transition: border-color var(--aster-dur-fast), box-shadow var(--aster-dur-fast);
  }
  :scope:hover { border-color: var(--aster-border-strong); box-shadow: var(--aster-shadow-sm); }
  @media (min-width: 960px) {
    :scope.span-2 { grid-column: span 2; }
    :scope.row-2 { grid-row: span 2; }
  }
  .bc-title { margin: 0; font-size: 0.96rem; font-weight: 600; color: var(--aster-on-surface); }
  .bc-desc { margin: 0.25rem 0 0; font-size: 0.84rem; color: var(--aster-on-surface-muted); }
`;

export function Grid({
  cols = 3,
  gap,
  class: extraClass,
  children,
}: {
  cols?: 1 | 2 | 3 | 4;
  gap?: string;
  class?: string;
  children?: View;
}) {
  return (
    <div
      class={[gridScope, `cols-${cols}`, extraClass].filter(Boolean).join(' ')}
      style={gap ? { gap } : undefined}
    >
      {children}
    </div>
  );
}

export function BentoGrid(props: { gap?: string; class?: string; children?: View }) {
  return (
    <Grid cols={3} gap={props.gap ?? '1rem'} class={props.class}>
      {props.children}
    </Grid>
  );
}

export function BentoCard({
  title,
  description,
  colSpan = 1,
  rowSpan = 1,
  class: extraClass,
  children,
}: {
  title: string;
  description?: string;
  colSpan?: 1 | 2;
  rowSpan?: 1 | 2;
  class?: string;
  children?: View;
}) {
  return (
    <article
      class={[
        bentoCardScope,
        colSpan === 2 ? 'span-2' : '',
        rowSpan === 2 ? 'row-2' : '',
        extraClass,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div>
        <h3 class="bc-title">{title}</h3>
        {description ? <p class="bc-desc">{description}</p> : null}
      </div>
      {children}
    </article>
  );
}
