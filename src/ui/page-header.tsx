import { scope, type View } from '@fierst/aster';

const phScope = scope`
  :scope {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding-bottom: 1.15rem;
    border-bottom: 1px solid var(--aster-border);
    font-family: var(--aster-font-sans);
  }
  .ph-row {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
  }
  @media (min-width: 720px) {
    .ph-row {
      flex-direction: row;
      align-items: flex-start;
      justify-content: space-between;
    }
  }
  .ph-main { display: grid; gap: 0.3rem; min-width: 0; }
  .ph-eyebrow {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--aster-primary);
  }
  .ph-title {
    margin: 0;
    font-family: var(--aster-font-display);
    font-size: clamp(1.35rem, 3vw, 1.75rem);
    font-weight: 700;
    letter-spacing: -0.025em;
    color: var(--aster-on-surface);
    line-height: 1.2;
  }
  .ph-desc {
    margin: 0;
    font-size: 0.875rem;
    color: var(--aster-on-surface-muted);
    max-width: 65ch;
  }
  .ph-meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem 1rem;
    margin-top: 0.25rem;
    font-size: 0.8125rem;
    color: var(--aster-on-surface-muted);
  }
  .ph-actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;
  }
`;

export function PageHeader({
  title,
  description,
  eyebrow,
  breadcrumb,
  meta,
  actions,
  class: extraClass,
}: {
  title: string;
  description?: string;
  eyebrow?: string;
  breadcrumb?: View;
  meta?: View;
  actions?: View;
  class?: string;
}) {
  return (
    <header class={[phScope, extraClass].filter(Boolean).join(' ')}>
      {breadcrumb ?? null}
      <div class="ph-row">
        <div class="ph-main">
          {eyebrow ? <span class="ph-eyebrow">{eyebrow}</span> : null}
          <h1 class="ph-title">{title}</h1>
          {description ? <p class="ph-desc">{description}</p> : null}
          {meta ? <div class="ph-meta">{meta}</div> : null}
        </div>
        {actions ? <div class="ph-actions">{actions}</div> : null}
      </div>
    </header>
  );
}
