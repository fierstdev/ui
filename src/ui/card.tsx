import { scope, type View } from '@fierst/aster';

const cardScope = scope`
  :scope {
    min-width: 0;
    display: flex;
    flex-direction: column;
    border-radius: var(--aster-radius-lg);
    color: var(--aster-on-surface);
    overflow: hidden;
  }
  :scope.v-default {
    background: var(--aster-surface);
    border: 1px solid var(--aster-border);
    box-shadow: var(--aster-shadow-xs);
  }
  :scope.v-elevated {
    background: var(--aster-surface);
    border: 1px solid var(--aster-border);
    box-shadow: var(--aster-shadow-md);
  }
  :scope.v-muted {
    background: var(--aster-surface-muted);
    border: 1px solid var(--aster-border);
  }
  .card-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    padding: 1.25rem 1.25rem 0;
  }
  .card-title {
    margin: 0;
    font-family: var(--aster-font-display);
    font-size: 0.98rem;
    font-weight: 600;
    letter-spacing: -0.015em;
    line-height: 1.35;
  }
  .card-desc {
    margin: 0.25rem 0 0;
    font-size: 0.84rem;
    color: var(--aster-on-surface-muted);
    line-height: 1.45;
  }
  .card-content {
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
  }
  .card-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.5rem;
    padding: 0.85rem 1.25rem;
    background: var(--aster-surface-muted);
    border-top: 1px solid var(--aster-border);
  }
`;

export type CardVariant = 'default' | 'elevated' | 'muted';

export function Card({
  variant = 'default',
  title,
  description,
  action,
  footer,
  class: extraClass,
  children,
  ...rest
}: {
  variant?: CardVariant;
  title?: string;
  description?: string;
  action?: View;
  footer?: View;
  class?: string;
  children?: View;
  [key: string]: any;
}) {
  return (
    <section {...rest} class={[cardScope, `v-${variant}`, extraClass].filter(Boolean).join(' ')}>
      {title || description || action ? (
        <header class="card-header">
          <div>
            {title ? <h3 class="card-title">{title}</h3> : null}
            {description ? <p class="card-desc">{description}</p> : null}
          </div>
          {action ?? null}
        </header>
      ) : null}
      <div class="card-content">{children}</div>
      {footer ? <footer class="card-footer">{footer}</footer> : null}
    </section>
  );
}
