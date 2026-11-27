import './theme.css';
import { scope, type View } from '@fierst/aster';
import { Icon, type LucideIconInput } from './icon';

const tlScope = scope`
  :scope {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    font-family: var(--aster-font-sans);
  }
  .tl-item {
    position: relative;
    display: flex;
    gap: 0.85rem;
    padding-bottom: 1.15rem;
  }
  .tl-item:last-child { padding-bottom: 0; }
  .tl-item:not(:last-child)::before {
    content: '';
    position: absolute;
    left: 13px;
    top: 28px;
    bottom: 0;
    width: 1px;
    background: var(--aster-border);
  }
  .tl-marker {
    width: 28px;
    height: 28px;
    border-radius: 9999px;
    border: 1px solid var(--aster-border);
    background: var(--aster-surface);
    color: var(--aster-on-surface-muted);
    display: inline-grid;
    place-items: center;
    flex-shrink: 0;
    position: relative;
    z-index: 1;
  }
  .tl-marker.t-primary { background: var(--aster-primary-subtle); border-color: var(--aster-primary-border); color: var(--aster-on-primary-subtle); }
  .tl-marker.t-success { background: var(--aster-success-subtle); border-color: var(--aster-success-border); color: var(--aster-on-success-subtle); }
  .tl-marker.t-warning { background: var(--aster-warning-subtle); border-color: var(--aster-warning-border); color: var(--aster-on-warning-subtle); }
  .tl-marker.t-danger { background: var(--aster-danger-subtle); border-color: var(--aster-danger-border); color: var(--aster-on-danger-subtle); }
  .tl-dot { width: 7px; height: 7px; border-radius: 50%; background: currentColor; }
  .tl-body { flex: 1; min-width: 0; display: grid; gap: 0.18rem; padding-top: 0.15rem; }
  .tl-head { display: flex; align-items: baseline; justify-content: space-between; gap: 0.75rem; flex-wrap: wrap; }
  .tl-title { font-size: 0.875rem; font-weight: 550; color: var(--aster-on-surface); }
  .tl-time { font-size: 0.75rem; font-family: var(--aster-font-mono); color: var(--aster-on-surface-subtle); }
  .tl-desc { font-size: 0.82rem; color: var(--aster-on-surface-muted); line-height: 1.45; }
`;

export interface TimelineItem {
  id: string;
  title: string;
  timestamp?: string;
  description?: View;
  icon?: LucideIconInput;
  tone?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger';
}

export function Timeline({
  items,
  class: extraClass,
}: {
  items: readonly TimelineItem[];
  class?: string;
}) {
  return (
    <ol class={[tlScope, extraClass].filter(Boolean).join(' ')}>
      {items.map((item) => (
        <li key={item.id} class="tl-item">
          <span class={`tl-marker t-${item.tone ?? 'neutral'}`} aria-hidden="true">
            {item.icon ? <Icon icon={item.icon} size={14} /> : <span class="tl-dot" />}
          </span>
          <div class="tl-body">
            <div class="tl-head">
              <span class="tl-title">{item.title}</span>
              {item.timestamp ? <time class="tl-time">{item.timestamp}</time> : null}
            </div>
            {item.description ? <div class="tl-desc">{item.description}</div> : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
