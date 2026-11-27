import './theme.css';
import { scope, type View } from '@fierst/aster';

const kbdScope = scope`
  :scope {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 1.35rem;
    height: 1.35rem;
    padding: 0 0.35rem;
    border-radius: var(--aster-radius-xs);
    border: 1px solid var(--aster-border);
    border-bottom-width: 2px;
    background: var(--aster-surface-muted);
    color: var(--aster-on-surface-muted);
    font-family: var(--aster-font-mono);
    font-size: 0.72rem;
    font-weight: 500;
    line-height: 1;
    user-select: none;
  }
`;

const kbdGroupScope = scope`
  :scope {
    display: inline-flex;
    align-items: center;
    gap: 0.2rem;
  }
`;

export function Kbd(props: { class?: string; children?: View }) {
  return <kbd class={[kbdScope, props.class].filter(Boolean).join(' ')}>{props.children}</kbd>;
}

export function KbdGroup(props: { keys: readonly string[]; class?: string }) {
  return (
    <span class={[kbdGroupScope, props.class].filter(Boolean).join(' ')}>
      {props.keys.map((k, i) => (
        <Kbd key={`${k}-${i}`}>{k}</Kbd>
      ))}
    </span>
  );
}
