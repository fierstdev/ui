import './theme.css';
import { Menu } from '@lucide/icons';
import { scope, type Ctx, type View } from '@fierst/aster';
import { Icon } from './icon';
import { Sheet } from './sheet';

const navScope = scope`
  :scope {
    position: sticky;
    top: 0;
    z-index: 30;
    border-bottom: 1px solid var(--aster-border);
    background: var(--aster-surface);
    font-family: var(--aster-font-sans);
  }
  .nb-inner {
    max-width: 1240px;
    margin: 0 auto;
    height: 58px;
    padding: 0 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }
  @media (min-width: 640px) { .nb-inner { padding: 0 1.5rem; } }
  .nb-left { display: flex; align-items: center; gap: 1.5rem; min-width: 0; }
  .nb-links { display: none; align-items: center; gap: 0.25rem; }
  @media (min-width: 820px) { .nb-links { display: flex; } }
  .nb-link {
    padding: 0.38rem 0.65rem;
    border-radius: var(--aster-radius-control);
    text-decoration: none;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--aster-on-surface-muted);
    transition: background-color var(--aster-dur-fast), color var(--aster-dur-fast);
  }
  .nb-link:hover, .nb-link.is-active { background: var(--aster-surface-muted); color: var(--aster-on-surface); }
  .nb-right { display: flex; align-items: center; gap: 0.5rem; }
  .nb-burger {
    width: 34px;
    height: 34px;
    border-radius: var(--aster-radius-control);
    border: 1px solid var(--aster-border);
    background: var(--aster-surface);
    color: var(--aster-on-surface);
    display: inline-grid;
    place-items: center;
    cursor: pointer;
  }
  @media (min-width: 820px) { .nb-burger { display: none; } }
  .mob-links { display: grid; gap: 0.25rem; }
`;

export interface NavbarLink {
  label: string;
  href: string;
  active?: boolean;
}

export function* Navbar(
  props: {
    brand: View;
    links: readonly NavbarLink[];
    actions?: View;
    class?: string;
  },
  ctx: Ctx,
) {
  let mobileOpen = false;

  for (props of ctx) {
    yield (
      <header class={[navScope, props.class].filter(Boolean).join(' ')}>
        <div class="nb-inner">
          <div class="nb-left">
            <div>{props.brand}</div>
            <nav class="nb-links" aria-label="Main navigation">
              {props.links.map((ln) => (
                <a
                  key={ln.href}
                  href={ln.href}
                  class="nb-link"
                  class:is-active={Boolean(ln.active)}
                >
                  {ln.label}
                </a>
              ))}
            </nav>
          </div>
          <div class="nb-right">
            {props.actions ?? null}
            <button
              type="button"
              class="nb-burger"
              aria-label="Open menu"
              onClick={() => (mobileOpen = true)}
            >
              <Icon icon={Menu} size={17} />
            </button>
          </div>
        </div>
        <Sheet
          open={[() => mobileOpen, (v: boolean) => (mobileOpen = v)]}
          side="right"
          title="Menu"
        >
          <nav class="mob-links" aria-label="Mobile navigation">
            {props.links.map((ln) => (
              <a
                key={ln.href}
                href={ln.href}
                class="nb-link"
                class:is-active={Boolean(ln.active)}
                onClick={() => (mobileOpen = false)}
              >
                {ln.label}
              </a>
            ))}
          </nav>
        </Sheet>
      </header>
    );
  }
}
