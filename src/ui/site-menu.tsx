import './theme.css';
import { scope } from '@fierst/aster';
import { ChevronRight, ExternalLink } from '@lucide/icons';
import { Icon, type LucideIconInput } from './icon';
import { Popover } from './popover';

const menuScope = scope`
  :scope { display: inline-flex; color: var(--aster-on-surface); }
  .trigger { width: 44px; height: 44px; display: grid; place-items: center; color: inherit; background: var(--aster-surface); border: 1px solid var(--aster-border); border-radius: var(--aster-radius-control); cursor:pointer; }
  .bars { position: relative; width: 18px; height: 2px; background: currentColor; }
  .bars::before, .bars::after { content: ''; position: absolute; inset: 0; background: currentColor; transform: translateY(-6px); }
  .bars::after { transform: translateY(6px); }
  :scope:has(:popover-open) .bars { background: transparent; transform: rotate(180deg); }
  :scope:has(:popover-open) .bars::before { transform: rotate(45deg); }
  :scope:has(:popover-open) .bars::after { transform: rotate(-45deg); }
  @media(prefers-reduced-motion:no-preference){ .bars, .bars::before, .bars::after { transition: transform 190ms ease-in-out; } }
  .destinations { box-sizing: border-box; min-width: 0; width: min(18.5rem, calc(100% - 24px)); padding: .4rem 0; border-radius: 1.25rem .55rem 1.75rem .75rem; }
  nav { display: grid; }
  nav:has(.symbol) { background: linear-gradient(to right, var(--aster-surface-muted) 0 3rem, transparent 3rem); }
  .symbol { display: grid; place-items: center; flex: 0 0 3rem; }
  a:has(.symbol) { padding-inline-start: 0; }
  a { display: flex; align-items: center; gap: .75rem; min-height: 48px; padding: .35rem 1rem; color: inherit; text-decoration: none; overflow-wrap: anywhere; }
  .direction { margin-inline-start: auto; flex: none; }
  a:hover, a[aria-current] { background: var(--aster-surface-muted); }
  a:focus-visible, button:focus-visible { outline:2px solid currentColor; outline-offset:-2px; }
`;

export function SiteMenu({
  id,
  label = 'Site menu',
  links,
}: {
  id: string;
  label?: string;
  links: readonly { href: string; label: string; icon?: LucideIconInput; current?: boolean }[];
}) {
  return (
    <div class={menuScope}>
      <button type="button" class="trigger" aria-label={label} popovertarget={id}>
        <span class="bars" aria-hidden="true" />
      </button>
      <Popover id={id} align="end" class="destinations">
        <nav aria-label={label}>
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={link.current ? 'page' : undefined}
              onClick={(event: MouseEvent) =>
                (event.currentTarget as HTMLElement)
                  .closest<HTMLElement>('[popover]')
                  ?.hidePopover()
              }
            >
              {link.icon && <span class="symbol"><Icon icon={link.icon} size={18} /></span>}
              <span>{link.label}</span>
              <Icon class="direction" icon={link.href.startsWith("https://") ? ExternalLink : ChevronRight} size={14} />
            </a>
          ))}
        </nav>
      </Popover>
    </div>
  );
}
