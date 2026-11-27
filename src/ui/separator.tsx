import './theme.css';
import { scope } from '@fierst/aster';

const sepScope = scope`
  :scope {
    flex-shrink: 0;
    background: var(--aster-border);
  }
  :scope.dir-horizontal {
    height: 1px;
    width: 100%;
  }
  :scope.dir-vertical {
    width: 1px;
    align-self: stretch;
    min-height: 1rem;
  }
  :scope.has-label {
    background: transparent;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-family: var(--aster-font-sans);
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--aster-on-surface-subtle);
  }
  :scope.has-label::before,
  :scope.has-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--aster-border);
  }
`;

export function Separator({
  orientation = 'horizontal',
  label,
  decorative = true,
  class: extraClass,
}: {
  orientation?: 'horizontal' | 'vertical';
  label?: string;
  decorative?: boolean;
  class?: string;
}) {
  if (label && orientation === 'horizontal') {
    return (
      <div
        role={decorative ? 'none' : 'separator'}
        aria-orientation={decorative ? undefined : 'horizontal'}
        class={[sepScope, 'dir-horizontal', 'has-label', extraClass].filter(Boolean).join(' ')}
      >
        <span>{label}</span>
      </div>
    );
  }
  return (
    <div
      role={decorative ? 'none' : 'separator'}
      aria-orientation={decorative ? undefined : orientation}
      class={[sepScope, `dir-${orientation}`, extraClass].filter(Boolean).join(' ')}
    />
  );
}
