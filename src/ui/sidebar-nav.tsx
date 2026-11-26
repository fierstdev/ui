import { ChevronDown } from '@lucide/icons';
import { scope, type Ctx, type View } from '@fierst/aster';
import { Icon, type LucideIconInput } from './icon.tsx';

const snavScope = scope`
  :scope { display: grid; gap: 0.75rem; font-family: var(--aster-font-sans); }
  .sg-head {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.25rem 0.55rem;
    border: none;
    background: transparent;
    color: var(--aster-on-surface-subtle);
    font-size: 0.72rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    cursor: pointer;
  }
  .sg-head:hover { color: var(--aster-on-surface-muted); }
  .sg-chev { display: inline-flex; transition: transform var(--aster-dur-fast); }
  .sg-chev.is-closed { transform: rotate(-90deg); }
  .sg-list { display: grid; gap: 2px; }
  .sg-link {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.6rem;
    padding: 0.45rem 0.6rem;
    border-radius: var(--aster-radius-control);
    text-decoration: none;
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--aster-on-surface-muted);
    transition: background-color var(--aster-dur-fast), color var(--aster-dur-fast);
  }
  .sg-link:hover, .sg-link.is-active { background: var(--aster-surface-muted); color: var(--aster-on-surface); }
  .sg-link.is-active { font-weight: 600; }
  .sg-left { display: inline-flex; align-items: center; gap: 0.55rem; min-width: 0; }
`;

export interface SidebarNavGroup {
  id: string;
  label: string;
  defaultOpen?: boolean;
  items: readonly {
    label: string;
    href: string;
    icon?: LucideIconInput;
    badge?: View;
    active?: boolean;
  }[];
}

export function* SidebarNav(
  props: {
    groups: readonly SidebarNavGroup[];
    class?: string;
  },
  ctx: Ctx,
) {
  const closed = new Set<string>(
    props.groups.filter((g) => g.defaultOpen === false).map((g) => g.id),
  );

  for (props of ctx) {
    yield (
      <nav aria-label="Sidebar sections" class={[snavScope, props.class].filter(Boolean).join(' ')}>
        {props.groups.map((grp) => {
          const isOpen = !closed.has(grp.id);
          return (
            <div key={grp.id}>
              <button
                type="button"
                class="sg-head"
                aria-expanded={isOpen}
                onClick={() => {
                  if (closed.has(grp.id)) closed.delete(grp.id);
                  else closed.add(grp.id);
                }}
              >
                <span>{grp.label}</span>
                <span class="sg-chev" class:is-closed={!isOpen} aria-hidden="true">
                  <Icon icon={ChevronDown} size={13} />
                </span>
              </button>
              {isOpen ? (
                <div class="sg-list">
                  {grp.items.map((it) => (
                    <a
                      key={it.href}
                      href={it.href}
                      aria-current={it.active ? 'page' : undefined}
                      class="sg-link"
                      class:is-active={Boolean(it.active)}
                    >
                      <span class="sg-left">
                        {it.icon ? <Icon icon={it.icon} size={15} /> : null}
                        <span>{it.label}</span>
                      </span>
                      {it.badge ?? null}
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </nav>
    );
  }
}
