import './theme.css';
import { scope, type View } from '@fierst/aster';

const barScope = scope`
  :scope {
    position: fixed;
    left: 50%;
    bottom: calc(1rem + var(--aster-safe-bottom));
    transform: translateX(-50%) translateY(0);
    z-index: 45;
    width: min(560px, calc(100vw - 1.5rem));
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    flex-wrap: wrap;
    padding: 0.65rem 0.9rem;
    border-radius: var(--aster-radius-lg);
    font-family: var(--aster-font-sans);
    transition:
      opacity var(--aster-dur-med) var(--aster-ease-standard),
      transform var(--aster-dur-med) var(--aster-ease-motion);
  }
  .sb-msg { font-size: 0.85rem; font-weight: 500; color: var(--aster-on-surface); }
  .sb-actions { display: flex; align-items: center; gap: 0.45rem; flex-wrap: wrap; }
`;

export function StickyActionBar({
  open = true,
  message,
  actions,
  class: extraClass,
}: {
  open?: boolean;
  message: View;
  actions?: View;
  class?: string;
}) {
  if (!open) return null;
  return (
    <div
      role="region"
      aria-label="Action bar"
      class={['aster-surface-popover', barScope, extraClass].filter(Boolean).join(' ')}
    >
      <div class="sb-msg">{message}</div>
      {actions ? <div class="sb-actions">{actions}</div> : null}
    </div>
  );
}
