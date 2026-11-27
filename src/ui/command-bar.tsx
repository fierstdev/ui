import './theme.css';
import { X } from '@lucide/icons';
import { scope, type View } from '@fierst/aster';
import { SearchInput } from './search-input';
import { Icon } from './icon';

const fbScope = scope`
  :scope {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 0.6rem;
    font-family: var(--aster-font-sans);
  }
  .fb-left { display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem; flex: 1; min-width: 200px; }
  .fb-chips { display: flex; flex-wrap: wrap; align-items: center; gap: 0.35rem; }
  .fb-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    height: 30px;
    padding: 0 0.6rem;
    border-radius: var(--aster-radius-control);
    border: 1px solid var(--aster-border);
    background: var(--aster-surface);
    color: var(--aster-on-surface-muted);
    font: inherit;
    font-size: 0.8rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color var(--aster-dur-fast), border-color var(--aster-dur-fast), color var(--aster-dur-fast);
  }
  .fb-chip:hover { background: var(--aster-surface-muted); color: var(--aster-on-surface); }
  .fb-chip.is-active {
    background: var(--aster-primary-subtle);
    border-color: var(--aster-primary-border);
    color: var(--aster-on-primary-subtle);
  }
  .fb-clear {
    border: none;
    background: transparent;
    color: var(--aster-on-surface-muted);
    font-size: 0.8rem;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    cursor: pointer;
    padding: 0.25rem 0.45rem;
    border-radius: var(--aster-radius-xs);
  }
  .fb-clear:hover { background: var(--aster-surface-muted); color: var(--aster-on-surface); }
`;

export function FilterBar({
  query,
  onQueryChange,
  searchPlaceholder = 'Filter items…',
  filters = [],
  activeFilters = [],
  onToggleFilter,
  onClearAll,
  right,
  class: extraClass,
}: {
  query?: string;
  onQueryChange?: (q: string) => void;
  searchPlaceholder?: string;
  filters?: readonly { id: string; label: string }[];
  activeFilters?: readonly string[];
  onToggleFilter?: (id: string) => void;
  onClearAll?: () => void;
  right?: View;
  class?: string;
}) {
  const hasActive = Boolean(query?.trim() || activeFilters.length > 0);
  return (
    <div class={[fbScope, extraClass].filter(Boolean).join(' ')}>
      <div class="fb-left">
        {onQueryChange ? (
          <SearchInput
            value={query ?? ''}
            placeholder={searchPlaceholder}
            onChange={onQueryChange}
          />
        ) : null}
        {filters.length > 0 ? (
          <div class="fb-chips" role="group" aria-label="Filters">
            {filters.map((f) => {
              const active = activeFilters.includes(f.id);
              return (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={active}
                  class="fb-chip"
                  class:is-active={active}
                  onClick={() => onToggleFilter?.(f.id)}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        ) : null}
        {hasActive && onClearAll ? (
          <button type="button" class="fb-clear" onClick={onClearAll}>
            <Icon icon={X} size={13} />
            <span>Reset</span>
          </button>
        ) : null}
      </div>
      {right ?? null}
    </div>
  );
}
