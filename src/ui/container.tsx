import { scope, type View } from '@fierst/aster';

const containerScope = scope`
  :scope {
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    padding-left: 1rem;
    padding-right: 1rem;
  }
  @media (min-width: 640px) {
    :scope { padding-left: 1.5rem; padding-right: 1.5rem; }
  }
  :scope.mw-sm { max-width: 640px; }
  :scope.mw-md { max-width: 768px; }
  :scope.mw-lg { max-width: 1024px; }
  :scope.mw-xl { max-width: 1280px; }
  :scope.mw-full { max-width: none; }
`;

const stackScope = scope`
  :scope { display: flex; flex-direction: column; min-width: 0; }
`;

const clusterScope = scope`
  :scope { display: flex; flex-wrap: wrap; align-items: center; min-width: 0; }
`;

export function Container({
  size = 'xl',
  class: extraClass,
  children,
}: {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  class?: string;
  children?: View;
}) {
  return (
    <div class={[containerScope, `mw-${size}`, extraClass].filter(Boolean).join(' ')}>
      {children}
    </div>
  );
}

export function Stack({
  gap = '0.85rem',
  align,
  class: extraClass,
  children,
}: {
  gap?: string;
  align?: 'stretch' | 'flex-start' | 'center' | 'flex-end';
  class?: string;
  children?: View;
}) {
  return (
    <div
      class={[stackScope, extraClass].filter(Boolean).join(' ')}
      style={{ gap, alignItems: align }}
    >
      {children}
    </div>
  );
}

export function Cluster({
  gap = '0.5rem',
  justify,
  align = 'center',
  class: extraClass,
  children,
}: {
  gap?: string;
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between';
  align?: 'flex-start' | 'center' | 'flex-end' | 'baseline';
  class?: string;
  children?: View;
}) {
  return (
    <div
      class={[clusterScope, extraClass].filter(Boolean).join(' ')}
      style={{ gap, justifyContent: justify, alignItems: align }}
    >
      {children}
    </div>
  );
}
