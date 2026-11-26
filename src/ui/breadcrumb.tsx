import { ChevronRight } from '@lucide/icons';
import { scope } from '@fierst/aster';
import { Icon } from './icon.tsx';

const bcScope = scope`
  :scope {
    font-family: var(--aster-font-sans);
    font-size: 0.86rem;
    max-width: 100%;
    overflow-x: auto;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
  }
  :scope::-webkit-scrollbar { display: none; }
  ol {
    list-style: none;
    margin: 0;
    padding: 0;
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    white-space: nowrap;
  }
  li {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
  }
  a {
    color: var(--aster-on-surface-variant);
    text-decoration: none;
    padding: 0.22rem 0.45rem;
    border-radius: var(--aster-radius-xs);
    transition: background var(--aster-dur-fast) var(--aster-ease-standard), color var(--aster-dur-fast);
  }
  a:hover {
    background: var(--aster-surface-low);
    color: var(--aster-on-surface);
  }
  a:focus-visible { outline: none; box-shadow: var(--aster-focus-ring); }
  .current {
    color: var(--aster-on-surface);
    font-weight: 600;
    padding: 0.22rem 0.45rem;
  }
  .sep {
    color: var(--aster-outline);
    display: inline-flex;
    align-items: center;
  }
`;

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: (e: MouseEvent) => void;
}

export function Breadcrumb({
  items,
  label = 'Breadcrumb',
  class: extraClass,
}: {
  items: readonly BreadcrumbItem[];
  label?: string;
  class?: string;
}) {
  return (
    <nav aria-label={label} class={[bcScope, extraClass].filter(Boolean).join(' ')}>
      <ol>
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={`${item.label}-${idx}`}>
              {idx > 0 ? (
                <span class="sep" aria-hidden="true">
                  <Icon icon={ChevronRight} size={14} />
                </span>
              ) : null}
              {isLast || !item.href ? (
                <span class="current" aria-current={isLast ? 'page' : undefined}>
                  {item.label}
                </span>
              ) : (
                <a href={item.href} onClick={item.onClick}>
                  {item.label}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
