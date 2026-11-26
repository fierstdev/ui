import { ChevronDown } from '@lucide/icons';
import { scope, type View } from '@fierst/aster';
import { Icon } from './icon.tsx';

const accScope = scope`
  :scope {
    display: grid;
    border: 1px solid var(--aster-border);
    border-radius: var(--aster-radius-lg);
    background: var(--aster-surface);
    overflow: hidden;
  }
  details {
    border-bottom: 1px solid var(--aster-border);
  }
  details:last-child { border-bottom: none; }

  summary {
    list-style: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.85rem 1.05rem;
    font-family: var(--aster-font-sans);
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--aster-on-surface);
    cursor: pointer;
    user-select: none;
    transition: background-color var(--aster-dur-fast) var(--aster-ease-standard);
  }
  summary::-webkit-details-marker { display: none; }
  summary:hover { background: var(--aster-surface-muted); }
  summary:focus-visible { outline: none; box-shadow: inset var(--aster-focus-ring); }

  .chev {
    color: var(--aster-on-surface-muted);
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
    transition: transform var(--aster-dur-med) var(--aster-ease-motion);
  }
  details[open] .chev { transform: rotate(180deg); }

  .acc-panel {
    padding: 0 1.05rem 0.95rem;
    font-size: 0.84rem;
    color: var(--aster-on-surface-muted);
    line-height: 1.55;
  }
`;

export interface AccordionItem {
  id: string;
  title: string;
  content: View;
  defaultOpen?: boolean;
}

let accSeq = 0;

/**
 * Native `<details>` Accordion.
 * - `type="single"` (default, or `exclusive={true}`): shares an HTML `name` attribute so
 *   the browser natively auto-closes inactive panels with zero JavaScript state.
 * - `type="multiple"` (or `exclusive={false}`): omits `name` so any or all items can stay
 *   expanded simultaneously.
 */
export function Accordion({
  items,
  type = 'single',
  exclusive,
  class: extraClass,
}: {
  items: readonly AccordionItem[];
  type?: 'single' | 'multiple';
  /** Legacy alias for `type === 'single'`. Takes precedence if explicitly passed. */
  exclusive?: boolean;
  class?: string;
}) {
  const isSingle = exclusive !== undefined ? exclusive : type === 'single';
  const groupName = isSingle ? `aster-acc-${++accSeq}` : undefined;

  return (
    <div class={[accScope, extraClass].filter(Boolean).join(' ')}>
      {items.map((item) => (
        <details key={item.id} name={groupName} open={item.defaultOpen}>
          <summary>
            <span>{item.title}</span>
            <span class="chev" aria-hidden="true">
              <Icon icon={ChevronDown} size={15} />
            </span>
          </summary>
          <div class="acc-panel">{item.content}</div>
        </details>
      ))}
    </div>
  );
}
