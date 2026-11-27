import './theme.css';
import { LoaderCircle } from '@lucide/icons';
import { scope, type View } from '@fierst/aster';
import { Icon } from './icon';

const spinScope = scope`
  :scope {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    color: var(--aster-on-surface-muted);
    font-family: var(--aster-font-sans);
    font-size: 0.84rem;
  }
`;

const overlayScope = scope`
  :scope { position: relative; min-width: 0; }
  .lo-scrim {
    position: absolute;
    inset: 0;
    z-index: 10;
    display: grid;
    place-items: center;
    background: color-mix(in srgb, var(--aster-surface) 78%, transparent);
    border-radius: inherit;
  }
`;

const SIZES = { xs: 13, sm: 16, md: 20, lg: 28 };

export function Spinner({
  size = 'md',
  label,
  class: extraClass,
}: {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  label?: string;
  class?: string;
}) {
  return (
    <span
      role="status"
      aria-live="polite"
      class={[spinScope, extraClass].filter(Boolean).join(' ')}
    >
      <Icon icon={LoaderCircle} size={SIZES[size]} spin />
      {label ? <span>{label}</span> : null}
    </span>
  );
}

export function LoadingOverlay({
  loading,
  label = 'Loading…',
  class: extraClass,
  children,
}: {
  loading: boolean;
  label?: string;
  class?: string;
  children?: View;
}) {
  return (
    <div class={[overlayScope, extraClass].filter(Boolean).join(' ')} aria-busy={loading}>
      {children}
      {loading ? (
        <div class="lo-scrim">
          <Spinner size="md" label={label} />
        </div>
      ) : null}
    </div>
  );
}
