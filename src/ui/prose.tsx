import { scope, type View } from '@fierst/aster';

const proseScope = scope`
  :scope {
    font-family: var(--aster-font-sans);
    font-size: 0.9375rem;
    line-height: 1.68;
    color: var(--aster-on-surface);
    max-width: 68ch;
  }
  h1, h2, h3, h4 {
    font-family: var(--aster-font-display);
    font-weight: 650;
    letter-spacing: -0.02em;
    color: var(--aster-on-surface);
    margin: 1.4em 0 0.5em;
    line-height: 1.25;
  }
  h1 { font-size: 1.75rem; margin-top: 0; }
  h2 { font-size: 1.3rem; padding-bottom: 0.35rem; border-bottom: 1px solid var(--aster-border); }
  h3 { font-size: 1.05rem; }
  p { margin: 0 0 0.95em; color: var(--aster-on-surface-muted); }
  a { color: var(--aster-primary); text-underline-offset: 3px; }
  ul, ol { margin: 0 0 1em; padding-left: 1.35rem; color: var(--aster-on-surface-muted); }
  li { margin: 0.25rem 0; }
  blockquote {
    margin: 1rem 0;
    padding: 0.6rem 1rem;
    border-left: 3px solid var(--aster-primary);
    background: var(--aster-surface-muted);
    border-radius: 0 var(--aster-radius-sm) var(--aster-radius-sm) 0;
    color: var(--aster-on-surface);
  }
  code {
    font-family: var(--aster-font-mono);
    font-size: 0.85em;
    padding: 0.12rem 0.35rem;
    border-radius: var(--aster-radius-xs);
    background: var(--aster-surface-muted);
    border: 1px solid var(--aster-border);
  }
  pre {
    padding: 0.9rem 1rem;
    border-radius: var(--aster-radius-md);
    background: var(--aster-surface-muted);
    border: 1px solid var(--aster-border);
    overflow-x: auto;
  }
  pre code { padding: 0; border: none; background: transparent; }
`;

const textScope = scope`
  :scope { margin: 0; font-family: var(--aster-font-sans); }
  :scope.t-default { color: var(--aster-on-surface); }
  :scope.t-muted { color: var(--aster-on-surface-muted); }
  :scope.t-subtle { color: var(--aster-on-surface-subtle); }
  :scope.t-primary { color: var(--aster-primary); }
  :scope.t-danger { color: var(--aster-danger); }
  :scope.sz-xs { font-size: 0.75rem; }
  :scope.sz-sm { font-size: 0.84rem; }
  :scope.sz-md { font-size: 0.9375rem; }
  :scope.sz-lg { font-size: 1.125rem; }
`;

export function Prose(props: { class?: string; children?: View }) {
  return <div class={[proseScope, props.class].filter(Boolean).join(' ')}>{props.children}</div>;
}

export function Text({
  size = 'sm',
  tone = 'default',
  weight,
  class: extraClass,
  children,
}: {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  tone?: 'default' | 'muted' | 'subtle' | 'primary' | 'danger';
  weight?: 400 | 500 | 600 | 700;
  class?: string;
  children?: View;
}) {
  return (
    <p
      class={[textScope, `sz-${size}`, `t-${tone}`, extraClass].filter(Boolean).join(' ')}
      style={weight ? { fontWeight: weight } : undefined}
    >
      {children}
    </p>
  );
}
