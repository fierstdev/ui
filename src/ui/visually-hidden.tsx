import { scope, type View } from '@fierst/aster';

const vhScope = scope`
  :scope {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
`;

const skipScope = scope`
  :scope {
    position: fixed;
    left: 0.75rem;
    top: 0.75rem;
    z-index: 100;
    padding: 0.5rem 0.9rem;
    border-radius: var(--aster-radius-control);
    background: var(--aster-primary);
    color: var(--aster-on-primary);
    font-family: var(--aster-font-sans);
    font-size: 0.85rem;
    font-weight: 600;
    text-decoration: none;
    box-shadow: var(--aster-shadow-md);
    transform: translateY(-140%);
    transition: transform var(--aster-dur-fast);
  }
  :scope:focus {
    transform: translateY(0);
    outline: none;
    box-shadow: var(--aster-focus-ring), var(--aster-shadow-md);
  }
`;

export function VisuallyHidden(props: { children?: View }) {
  return <span class={vhScope}>{props.children}</span>;
}

export function SkipLink({
  href = '#main-content',
  label = 'Skip to main content',
}: {
  href?: string;
  label?: string;
}) {
  return (
    <a href={href} class={skipScope}>
      {label}
    </a>
  );
}
