import './theme.css';
import { scope, type View } from '@fierst/aster';

const arScope = scope`
  :scope {
    position: relative;
    width: 100%;
    overflow: hidden;
    border-radius: var(--aster-radius-md);
    background: var(--aster-surface-muted);
  }
  :scope > img,
  :scope > video,
  :scope > iframe {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    border: none;
  }
`;

export function AspectRatio({
  ratio = 16 / 9,
  class: extraClass,
  children,
}: {
  ratio?: number | string;
  class?: string;
  children?: View;
}) {
  return (
    <div
      class={[arScope, extraClass].filter(Boolean).join(' ')}
      style={{ aspectRatio: String(ratio) }}
    >
      {children}
    </div>
  );
}
