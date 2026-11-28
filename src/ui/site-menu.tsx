import './theme.css';
import { scope } from '@fierst/aster';
import { Menu, X } from '@lucide/icons';
import { Icon, type LucideIconInput } from './icon';
import { Popover } from './popover';

const menuScope = scope`
  :scope { display: inline-flex; color: var(--aster-on-surface); }
  .trigger { width: 44px; height: 44px; display: grid; place-items: center; color: inherit; background: var(--aster-surface); border: 1px solid var(--aster-border); border-radius: var(--aster-radius-control); cursor:pointer; }
  .trigger > span { grid-area: 1/1; display:flex; }
  .close { opacity:0; }
  :scope:has(:popover-open) .open { opacity:0; }
  :scope:has(:popover-open) .close { opacity:1; transform:rotate(180deg); }
  @media(prefers-reduced-motion:no-preference){ .trigger > span { transition:opacity .14s, transform .18s ease-out; } }
  nav { display:grid; }
  a { display:flex; align-items:center; gap:.7rem; min-height:44px; padding:.35rem .7rem; color:inherit; text-decoration:none; border-radius:var(--aster-radius-sm); }
  a:hover, a[aria-current] { background:var(--aster-surface-muted); }
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
        <span class="open" aria-hidden="true">
          <Icon icon={Menu} size={20} />
        </span>
        <span class="close" aria-hidden="true">
          <Icon icon={X} size={20} />
        </span>
      </button>
      <Popover id={id} align="end">
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
              {link.icon && <Icon icon={link.icon} size={18} />}
              <span>{link.label}</span>
            </a>
          ))}
        </nav>
      </Popover>
    </div>
  );
}
