import './theme.css';
import { scope, type View } from '@fierst/aster';

const formScope = scope`
  :scope {
    display: grid;
    gap: 1.5rem;
    font-family: var(--aster-font-sans);
  }
`;

const secScope = scope`
  :scope {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem 1.75rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid var(--aster-border);
  }
  @media (min-width: 768px) {
    :scope.is-split { grid-template-columns: minmax(200px, 34%) minmax(0, 1fr); }
  }
  .fs-title { margin: 0; font-size: 0.94rem; font-weight: 600; color: var(--aster-on-surface); }
  .fs-desc { margin: 0.25rem 0 0; font-size: 0.82rem; color: var(--aster-on-surface-muted); line-height: 1.5; }
  .fs-fields { display: grid; gap: 0.95rem; min-width: 0; }
`;

const actScope = scope`
  :scope {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
`;

export function Form({
  onSubmit,
  class: extraClass,
  children,
}: {
  onSubmit?: (e: SubmitEvent) => void;
  class?: string;
  children?: View;
}) {
  return (
    <form
      class={[formScope, extraClass].filter(Boolean).join(' ')}
      onSubmit={(e: SubmitEvent) => {
        e.preventDefault();
        onSubmit?.(e);
      }}
    >
      {children}
    </form>
  );
}

export function FormSection({
  title,
  description,
  layout = 'split',
  class: extraClass,
  children,
}: {
  title: string;
  description?: string;
  layout?: 'split' | 'stacked';
  class?: string;
  children?: View;
}) {
  return (
    <section
      class={[secScope, layout === 'split' ? 'is-split' : '', extraClass].filter(Boolean).join(' ')}
    >
      <div>
        <h3 class="fs-title">{title}</h3>
        {description ? <p class="fs-desc">{description}</p> : null}
      </div>
      <div class="fs-fields">{children}</div>
    </section>
  );
}

export function FormActions(props: { class?: string; children?: View }) {
  return <div class={[actScope, props.class].filter(Boolean).join(' ')}>{props.children}</div>;
}
