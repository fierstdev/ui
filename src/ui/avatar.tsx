import './theme.css';
import { scope, type Ctx, type View } from '@fierst/aster';

const avatarScope = scope`
  :scope {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border-radius: var(--aster-radius-badge);
    background: var(--aster-primary-container);
    color: var(--aster-on-primary-container);
    font-family: var(--aster-font-display);
    font-weight: 650;
    letter-spacing: -0.02em;
    border: 1px solid var(--aster-outline-variant);
    user-select: none;
    transition: border-radius var(--aster-dur-fast) var(--aster-ease-motion);
  }
  :scope.sz-sm { width: 30px; height: 30px; font-size: 0.72rem; }
  :scope.sz-md { width: 40px; height: 40px; font-size: 0.88rem; }
  :scope.sz-lg { width: 52px; height: 52px; font-size: 1.08rem; }
  :scope.sz-xl { width: 68px; height: 68px; font-size: 1.35rem; }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: inherit;
    display: block;
  }

  .status {
    position: absolute;
    right: -1px;
    bottom: -1px;
    width: 28%;
    height: 28%;
    min-width: 9px;
    min-height: 9px;
    border-radius: var(--aster-radius-full);
    border: 2px solid var(--aster-surface);
    background: var(--aster-outline);
  }
  .status.st-online { background: var(--aster-success); }
  .status.st-away { background: var(--aster-warning); }
  .status.st-busy { background: var(--aster-danger); }
  .status.st-offline { background: var(--aster-outline); }
`;

const avatarGroupScope = scope`
  :scope {
    display: inline-flex;
    align-items: center;
  }
  :scope > *:not(:first-child) {
    margin-left: -6px;
  }
  :scope > * {
    position: relative;
    box-shadow: 0 0 0 2px var(--aster-surface);
    transition: transform var(--aster-dur-fast) var(--aster-ease-motion);
  }
  :scope > *:hover { z-index: 2; transform: translateY(-2px); }
  .overflow-badge {
    display: inline-grid;
    place-items: center;
    padding: 0 0.45rem;
    border-radius: var(--aster-radius-badge);
    background: var(--aster-surface-high);
    color: var(--aster-on-surface);
    border: 1px solid var(--aster-outline-variant);
    font-family: var(--aster-font-mono);
    font-weight: 650;
  }
  .overflow-badge.sz-sm { height: 30px; min-width: 30px; font-size: 0.7rem; }
  .overflow-badge.sz-md { height: 40px; min-width: 40px; font-size: 0.76rem; }
  .overflow-badge.sz-lg { height: 52px; min-width: 52px; font-size: 0.88rem; }
  .overflow-badge.sz-xl { height: 68px; min-width: 68px; font-size: 1rem; }
`;

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';
export type AvatarStatus = 'online' | 'away' | 'busy' | 'offline';

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function* Avatar(
  props: {
    name: string;
    src?: string;
    alt?: string;
    size?: AvatarSize;
    status?: AvatarStatus;
    class?: string;
  },
  ctx: Ctx,
) {
  let imgFailed = false;
  let lastSrc = props.src;

  for (props of ctx) {
    if (props.src !== lastSrc) {
      lastSrc = props.src;
      imgFailed = false;
    }

    const sz = props.size ?? 'md';
    const showImg = Boolean(props.src && !imgFailed);

    yield (
      <span
        class={[avatarScope, `sz-${sz}`, props.class].filter(Boolean).join(' ')}
        role="img"
        aria-label={[props.alt ?? props.name, props.status].filter(Boolean).join(', ')}
        title={props.name}
      >
        {showImg ? (
          <img src={props.src} alt="" loading="lazy" on:error={() => (imgFailed = true)} />
        ) : (
          <span>{getInitials(props.name)}</span>
        )}
        {props.status ? <span class={`status st-${props.status}`} aria-hidden="true" /> : null}
      </span>
    );
  }
}

export function AvatarGroup({
  items,
  max = 4,
  size = 'md',
  class: extraClass,
}: {
  items: readonly { name: string; src?: string; status?: AvatarStatus }[];
  max?: number;
  size?: AvatarSize;
  class?: string;
}): View {
  const visible = items.slice(0, max);
  const remaining = items.length - visible.length;

  return (
    <div
      class={[avatarGroupScope, extraClass].filter(Boolean).join(' ')}
      role="group"
      aria-label="Team members"
    >
      {visible.map((person) => (
        <Avatar
          key={person.name}
          name={person.name}
          src={person.src}
          status={person.status}
          size={size}
        />
      ))}
      {remaining > 0 ? <span class={`overflow-badge sz-${size}`}>+{remaining}</span> : null}
    </div>
  );
}
