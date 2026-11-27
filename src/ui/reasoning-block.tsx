import './theme.css';
import { Brain, ChevronDown } from '@lucide/icons';
import { scope, type View } from '@fierst/aster';
import { Icon } from './icon';

const rbScope = scope`
  :scope {
    border-radius: var(--aster-radius-md);
    border: 1px solid var(--aster-border);
    background: var(--aster-surface-muted);
    font-family: var(--aster-font-sans);
    overflow: hidden;
  }
  summary {
    list-style: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    padding: 0.55rem 0.8rem;
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--aster-on-surface-muted);
    cursor: pointer;
    user-select: none;
  }
  summary::-webkit-details-marker { display: none; }
  summary:hover { color: var(--aster-on-surface); }
  .rb-left { display: inline-flex; align-items: center; gap: 0.45rem; }
  .rb-chev { display: inline-flex; transition: transform var(--aster-dur-fast); }
  :scope[open] .rb-chev { transform: rotate(180deg); }
  .rb-body {
    padding: 0.65rem 0.85rem 0.8rem;
    border-top: 1px solid var(--aster-border);
    background: var(--aster-surface);
    font-size: 0.8125rem;
    color: var(--aster-on-surface-muted);
    line-height: 1.55;
    white-space: pre-wrap;
  }
`;

export function ReasoningBlock({
  label = 'Thought process',
  durationLabel,
  defaultOpen = false,
  class: extraClass,
  children,
}: {
  label?: string;
  durationLabel?: string;
  defaultOpen?: boolean;
  class?: string;
  children?: View;
}) {
  return (
    <details class={[rbScope, extraClass].filter(Boolean).join(' ')} open={defaultOpen}>
      <summary>
        <span class="rb-left">
          <Icon icon={Brain} size={14} />
          <span>{durationLabel ? `${label} (${durationLabel})` : label}</span>
        </span>
        <span class="rb-chev" aria-hidden="true">
          <Icon icon={ChevronDown} size={14} />
        </span>
      </summary>
      <div class="rb-body">{children}</div>
    </details>
  );
}
