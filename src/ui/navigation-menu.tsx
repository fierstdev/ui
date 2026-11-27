import './theme.css';
import { ChevronDown } from '@lucide/icons';
import { scope, type Ctx } from '@fierst/aster';
import { Icon, type LucideIconInput } from './icon';

const nmScope = scope`
  :scope { display: inline-flex; align-items: center; gap: 0.25rem; font-family: var(--aster-font-sans); }
  .nm-item { position: relative; }
  .nm-btn {
    height: 34px;
    padding: 0 0.7rem;
    border: none;
    border-radius: var(--aster-radius-control);
    background: transparent;
    color: var(--aster-on-surface-muted);
    font: inherit;
    font-size: 0.875rem;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    cursor: pointer;
    transition: background-color var(--aster-dur-fast), color var(--aster-dur-fast);
  }
  .nm-btn:hover, .nm-btn.is-open { background: var(--aster-surface-muted); color: var(--aster-on-surface); }
  .nm-panel {
    position: fixed;
    z-index: 50;
    width: min(360px, calc(100vw - 1.5rem));
    max-width: calc(100vw - 1.5rem);
  }
  .nm-link {
    display: flex;
    align-items: flex-start;
    gap: 0.65rem;
    padding: 0.6rem 0.7rem;
    border-radius: var(--aster-radius-md);
    text-decoration: none;
    color: var(--aster-on-surface);
    transition: background-color var(--aster-dur-fast);
  }
  .nm-link:hover { background: var(--aster-surface-muted); }
  .nm-ic {
    width: 32px;
    height: 32px;
    border-radius: var(--aster-radius-sm);
    border: 1px solid var(--aster-border);
    background: var(--aster-surface);
    color: var(--aster-primary);
    display: inline-grid;
    place-items: center;
    flex-shrink: 0;
  }
  .nm-t { font-size: 0.85rem; font-weight: 600; display: block; }
  .nm-d { font-size: 0.76rem; color: var(--aster-on-surface-muted); display: block; margin-top: 0.1rem; line-height: 1.4; }
`;

export interface NavMenuSection {
  id: string;
  label: string;
  links: readonly { title: string; description: string; href: string; icon?: LucideIconInput }[];
}

export function* NavigationMenu(
  props: {
    sections: readonly NavMenuSection[];
    class?: string;
  },
  ctx: Ctx,
) {
  let openId: string | null = null;

  if (typeof window !== 'undefined') {
    const close = () => {
      if (openId !== null) {
        openId = null;
        ctx.refresh();
      }
    };
    window.addEventListener('pointerdown', close, { signal: ctx.signal });
    window.addEventListener(
      'keydown',
      (e: KeyboardEvent) => {
        if (e.key === 'Escape') close();
      },
      { signal: ctx.signal },
    );
  }

  for (props of ctx) {
    yield (
      <nav
        aria-label="Primary menu"
        class={[nmScope, props.class].filter(Boolean).join(' ')}
        on:pointerdown={(e: Event) => e.stopPropagation()}
      >
        {props.sections.map((sec) => {
          const isOpen = openId === sec.id;
          return (
            <div key={sec.id} class="nm-item">
              <button
                type="button"
                aria-expanded={isOpen}
                class="nm-btn"
                class:is-open={isOpen}
                onClick={() => (openId = isOpen ? null : sec.id)}
              >
                <span>{sec.label}</span>
                <Icon icon={ChevronDown} size={14} />
              </button>
              {isOpen ? (
                <div class="aster-surface-popover nm-panel">
                  {sec.links.map((ln) => (
                    <a key={ln.href} href={ln.href} class="nm-link" onClick={() => (openId = null)}>
                      {ln.icon ? (
                        <span class="nm-ic" aria-hidden="true">
                          <Icon icon={ln.icon} size={15} />
                        </span>
                      ) : null}
                      <span>
                        <span class="nm-t">{ln.title}</span>
                        <span class="nm-d">{ln.description}</span>
                      </span>
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
