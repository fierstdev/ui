import './theme.css';
import { scope, type View } from '@fierst/aster';

const scrollScope = scope`
  :scope {
    position: relative;
    overflow: auto;
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
    scrollbar-color: var(--aster-border-strong) transparent;
  }
  :scope.dir-vertical { overflow-x: hidden; overflow-y: auto; }
  :scope.dir-horizontal { overflow-x: auto; overflow-y: hidden; }
  :scope.is-bordered {
    border: 1px solid var(--aster-border);
    border-radius: var(--aster-radius-md);
    background: var(--aster-surface);
  }
  :scope::-webkit-scrollbar { width: 8px; height: 8px; }
  :scope::-webkit-scrollbar-track { background: transparent; }
  :scope::-webkit-scrollbar-thumb {
    background: var(--aster-border-strong);
    border-radius: 9999px;
    border: 2px solid transparent;
    background-clip: content-box;
  }
  :scope::-webkit-scrollbar-thumb:hover { background: var(--aster-on-surface-subtle); background-clip: content-box; }
`;

export function ScrollArea({
  maxHeight = '260px',
  orientation = 'vertical',
  bordered = false,
  class: extraClass,
  children,
}: {
  maxHeight?: string;
  orientation?: 'vertical' | 'horizontal' | 'both';
  bordered?: boolean;
  class?: string;
  children?: View;
}) {
  const dirCls = orientation === 'both' ? '' : `dir-${orientation}`;
  return (
    <div
      class={[scrollScope, dirCls, bordered ? 'is-bordered' : '', extraClass]
        .filter(Boolean)
        .join(' ')}
      tabIndex={0}
      style={{ maxHeight }}
    >
      {children}
    </div>
  );
}
