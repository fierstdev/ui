import './theme.css';
import { scope, type View } from '@fierst/aster';

const shScope = scope`
  :scope {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: space-between;
    gap: 0.75rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid var(--aster-border);
    font-family: var(--aster-font-sans);
  }
  .sh-copy { display: grid; gap: 0.2rem; min-width: 0; }
  .sh-title {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: -0.015em;
    color: var(--aster-on-surface);
  }
  .sh-desc { margin: 0; font-size: 0.84rem; color: var(--aster-on-surface-muted); }
  .sh-actions { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
`;

export function SectionHeader({
  title,
  description,
  actions,
  class: extraClass,
}: {
  title: string;
  description?: string;
  actions?: View;
  class?: string;
}) {
  return (
    <div class={[shScope, extraClass].filter(Boolean).join(' ')}>
      <div class="sh-copy">
        <h2 class="sh-title">{title}</h2>
        {description ? <p class="sh-desc">{description}</p> : null}
      </div>
      {actions ? <div class="sh-actions">{actions}</div> : null}
    </div>
  );
}
