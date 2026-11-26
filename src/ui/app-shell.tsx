import { Menu, PanelLeftClose, PanelLeftOpen } from '@lucide/icons';
import { scope, type Ctx, type View } from '@fierst/aster';
import { Icon, type LucideIconInput } from './icon.tsx';
import { Sheet } from './sheet.tsx';

const shellScope = scope`
  :scope {
    min-height: 100dvh;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
    background: var(--aster-bg);
    color: var(--aster-on-surface);
    font-family: var(--aster-font-sans);
  }
  @media (min-width: 960px) {
    :scope {
      grid-template-columns: 248px minmax(0, 1fr);
      grid-template-rows: auto 1fr;
    }
    :scope.is-collapsed {
      grid-template-columns: 64px minmax(0, 1fr);
    }
  }

  .desktop-sidebar {
    display: none;
  }
  @media (min-width: 960px) {
    .desktop-sidebar {
      display: flex;
      flex-direction: column;
      grid-row: 1 / -1;
      grid-column: 1;
      position: sticky;
      top: 0;
      height: 100dvh;
      border-right: 1px solid var(--aster-border);
      background: var(--aster-surface);
      overflow-x: hidden;
      overflow-y: auto;
    }
  }

  .topbar {
    position: sticky;
    top: 0;
    z-index: 25;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 0.65rem 0.75rem;
    padding: 0.6rem 1rem;
    background: var(--aster-surface);
    border-bottom: 1px solid var(--aster-border);
  }
  @media (min-width: 960px) {
    .topbar {
      grid-column: 2;
      padding: 0.6rem 1.5rem;
    }
  }
  .topbar-left {
    display: flex;
    align-items: center;
    gap: 0.55rem;
    min-width: 0;
  }
  .mobile-menu-btn {
    width: 34px;
    height: 34px;
    border-radius: var(--aster-radius-control);
    border: 1px solid var(--aster-border);
    background: var(--aster-surface);
    color: var(--aster-on-surface);
    display: inline-grid;
    place-items: center;
    cursor: pointer;
    touch-action: manipulation;
    transition: background-color var(--aster-dur-fast);
  }
  .mobile-menu-btn:hover { background: var(--aster-surface-muted); }
  @media (min-width: 960px) {
    .mobile-menu-btn { display: none; }
  }
  .collapse-btn {
    display: none;
  }
  @media (min-width: 960px) {
    .collapse-btn {
      width: 32px;
      height: 32px;
      border-radius: var(--aster-radius-control);
      border: 1px solid var(--aster-border);
      background: var(--aster-surface);
      color: var(--aster-on-surface-muted);
      display: inline-grid;
      place-items: center;
      cursor: pointer;
      transition: background-color var(--aster-dur-fast), color var(--aster-dur-fast);
    }
    .collapse-btn:hover { background: var(--aster-surface-muted); color: var(--aster-on-surface); }
  }

  .main-content {
    min-width: 0;
    padding: 1.15rem 1rem calc(2.5rem + var(--aster-safe-bottom));
  }
  @media (min-width: 640px) {
    .main-content { padding: 1.5rem; }
  }
  @media (min-width: 960px) {
    .main-content { grid-column: 2; padding: 1.75rem 2rem; }
  }
`;

const sidebarScope = scope`
  :scope {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-width: 0;
  }
  .sb-header {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    padding: 0.85rem 0.85rem;
    border-bottom: 1px solid var(--aster-border);
    min-height: 56px;
  }
  .sb-nav {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    padding: 0.75rem 0.6rem;
    flex: 1;
    overflow-y: auto;
  }
  .sb-footer {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    padding: 0.75rem 0.85rem;
    border-top: 1px solid var(--aster-border);
  }
  /* Collapsed rail: center avatar/icon cleanly and hide all text metadata */
  :scope.is-collapsed .sb-header,
  :scope.is-collapsed .sb-footer {
    justify-content: center;
    padding-left: 0;
    padding-right: 0;
  }
  :scope.is-collapsed .sb-nav {
    padding: 0.75rem 0.45rem;
    align-items: center;
  }
  :scope.is-collapsed .sb-text,
  :scope.is-collapsed .sb-section-label {
    display: none;
  }
`;

const navItemScope = scope`
  :scope {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    width: 100%;
    min-height: 36px;
    padding: 0.45rem 0.65rem;
    border-radius: var(--aster-radius-control);
    text-decoration: none;
    color: var(--aster-on-surface-muted);
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    border: none;
    background: transparent;
    text-align: left;
    touch-action: manipulation;
    transition:
      background-color var(--aster-dur-fast) var(--aster-ease-standard),
      color var(--aster-dur-fast) var(--aster-ease-standard);
  }
  :scope:hover {
    background: var(--aster-surface-muted);
    color: var(--aster-on-surface);
  }
  :scope:focus-visible { outline: none; box-shadow: var(--aster-focus-ring); }
  :scope.is-active {
    background: var(--aster-surface-muted);
    color: var(--aster-on-surface);
    font-weight: 600;
  }
  .nav-label {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  :scope.is-compact {
    width: 40px;
    height: 40px;
    justify-content: center;
    padding: 0;
  }
  :scope.is-compact .nav-label,
  :scope.is-compact .nav-badge { display: none; }
`;

export function NavItem({
  href,
  label,
  icon,
  active = false,
  compact = false,
  badge,
  onClick,
  class: extraClass,
}: {
  href?: string;
  label: string;
  icon?: LucideIconInput;
  active?: boolean;
  compact?: boolean;
  badge?: View;
  onClick?: (e: MouseEvent) => void;
  class?: string;
}) {
  const cls = [navItemScope, active ? 'is-active' : '', compact ? 'is-compact' : '', extraClass]
    .filter(Boolean)
    .join(' ');

  if (href) {
    return (
      <a
        href={href}
        class={cls}
        aria-current={active ? 'page' : undefined}
        aria-label={compact ? label : undefined}
        title={compact ? label : undefined}
        onClick={onClick}
      >
        {icon ? <Icon icon={icon} size={17} /> : null}
        <span class="nav-label">{label}</span>
        {badge ? <span class="nav-badge">{badge}</span> : null}
      </a>
    );
  }

  return (
    <button
      type="button"
      class={cls}
      aria-label={compact ? label : undefined}
      title={compact ? label : undefined}
      onClick={onClick}
    >
      {icon ? <Icon icon={icon} size={17} /> : null}
      <span class="nav-label">{label}</span>
      {badge ? <span class="nav-badge">{badge}</span> : null}
    </button>
  );
}

export function Sidebar({
  header,
  footer,
  collapsed = false,
  class: extraClass,
  children,
}: {
  header?: View;
  footer?: View;
  collapsed?: boolean;
  class?: string;
  children?: View;
}) {
  return (
    <div
      class={[sidebarScope, collapsed ? 'is-collapsed' : '', extraClass].filter(Boolean).join(' ')}
    >
      {header ? <div class="sb-header">{header}</div> : null}
      <nav aria-label="Primary navigation" class="sb-nav">
        {children}
      </nav>
      {footer ? <div class="sb-footer">{footer}</div> : null}
    </div>
  );
}

export function* AppShell(
  props: {
    brand?: View;
    sidebar: View | ((opts: { collapsed: boolean; closeMobile: () => void }) => View);
    topbar?: View;
    collapsible?: boolean;
    class?: string;
    children?: View;
  },
  ctx: Ctx,
) {
  let mobileOpen = false;
  let collapsed = false;

  for (props of ctx) {
    const closeMobile = () => (mobileOpen = false);
    const renderSidebar = (isCollapsed: boolean) =>
      typeof props.sidebar === 'function'
        ? props.sidebar({ collapsed: isCollapsed, closeMobile })
        : props.sidebar;

    yield (
      <div
        class={[shellScope, collapsed ? 'is-collapsed' : '', props.class].filter(Boolean).join(' ')}
      >
        <aside class="desktop-sidebar">{renderSidebar(collapsed)}</aside>

        <header class="topbar">
          <div class="topbar-left">
            <button
              type="button"
              class="mobile-menu-btn"
              aria-label="Open navigation menu"
              onClick={() => (mobileOpen = true)}
            >
              <Icon icon={Menu} size={17} />
            </button>
            {(props.collapsible ?? true) ? (
              <button
                type="button"
                class="collapse-btn"
                aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                onClick={() => (collapsed = !collapsed)}
              >
                <Icon icon={collapsed ? PanelLeftOpen : PanelLeftClose} size={16} />
              </button>
            ) : null}
            {props.brand ?? null}
          </div>
          {props.topbar ?? null}
        </header>

        <main class="main-content">{props.children}</main>

        <Sheet
          open={[() => mobileOpen, (v: boolean) => (mobileOpen = v)]}
          side="left"
          title="Navigation"
        >
          {renderSidebar(false)}
        </Sheet>
      </div>
    );
  }
}
