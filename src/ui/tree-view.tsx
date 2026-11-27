import './theme.css';
import { ChevronRight, File, Folder, FolderOpen } from '@lucide/icons';
import { scope, type Ctx } from '@fierst/aster';
import { Icon } from './icon';

const treeScope = scope`
  :scope {
    font-family: var(--aster-font-sans);
    font-size: 0.85rem;
    user-select: none;
  }
  ul { list-style: none; margin: 0; padding: 0; }
  .branch { padding-left: 1.15rem; border-left: 1px solid var(--aster-border); margin-left: 0.65rem; }
  .node-btn {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.35rem 0.55rem;
    border: none;
    border-radius: var(--aster-radius-xs);
    background: transparent;
    color: var(--aster-on-surface);
    font: inherit;
    text-align: left;
    cursor: pointer;
    transition: background-color var(--aster-dur-fast);
  }
  .node-btn:hover { background: var(--aster-surface-muted); }
  .node-btn.is-selected { background: var(--aster-primary-subtle); color: var(--aster-on-primary-subtle); font-weight: 550; }
  .chev { display: inline-flex; color: var(--aster-on-surface-subtle); transition: transform var(--aster-dur-fast); }
  .chev.is-open { transform: rotate(90deg); }
  .spacer { width: 14px; display: inline-block; flex-shrink: 0; }
`;

export interface TreeNode {
  id: string;
  label: string;
  children?: readonly TreeNode[];
}

export function* TreeView(
  props: {
    nodes: readonly TreeNode[];
    label?: string;
    defaultExpanded?: readonly string[];
    selectedId?: string;
    onSelect?: (node: TreeNode) => void;
    class?: string;
  },
  ctx: Ctx,
) {
  const expanded = new Set<string>(props.defaultExpanded ?? []);
  let focused = props.nodes[0]?.id;
  let internalSel = props.selectedId ?? '';

  for (props of ctx) {
    const selected = props.selectedId !== undefined ? props.selectedId : internalSel;

    const visible: string[] = [];
    const visit = (nodes: readonly TreeNode[]) => {
      for (const node of nodes) {
        visible.push(node.id);
        if (expanded.has(node.id) && node.children) visit(node.children);
      }
    };
    visit(props.nodes);
    if (!focused || !visible.includes(focused)) focused = visible[0];

    const renderList = (items: readonly TreeNode[], nested = false): any => (
      <ul
        role={nested ? 'group' : 'tree'}
        aria-label={nested ? undefined : (props.label ?? 'Tree')}
        class={nested ? 'branch' : undefined}
      >
        {items.map((node) => {
          const hasKids = Boolean(node.children && node.children.length > 0);
          const isOpen = expanded.has(node.id);
          return (
            <li
              key={node.id}
              role="treeitem"
              aria-label={node.label}
              aria-expanded={hasKids ? isOpen : undefined}
              aria-selected={selected === node.id}
            >
              <button
                type="button"
                tabIndex={focused === node.id ? 0 : -1}
                onFocus={() => (focused = node.id)}
                onKeyDown={(event: KeyboardEvent) => {
                  const button = event.currentTarget as HTMLButtonElement;
                  const buttons = Array.from(
                    button
                      .closest('[role="tree"]')!
                      .querySelectorAll<HTMLButtonElement>('.node-btn'),
                  );
                  const index = buttons.indexOf(button);
                  switch (event.key) {
                    case 'Home':
                      buttons[0]?.focus();
                      break;
                    case 'End':
                      buttons.at(-1)?.focus();
                      break;
                    case 'ArrowDown':
                      buttons[index + 1]?.focus();
                      break;
                    case 'ArrowUp':
                      buttons[index - 1]?.focus();
                      break;
                    case 'ArrowRight':
                      if (hasKids && !isOpen) expanded.add(node.id);
                      else if (hasKids) buttons[index + 1]?.focus();
                      break;
                    case 'ArrowLeft':
                      if (isOpen) expanded.delete(node.id);
                      else
                        button.parentElement?.parentElement
                          ?.closest('li')
                          ?.querySelector('button')
                          ?.focus();
                      break;
                    default:
                      return;
                  }
                  event.preventDefault();
                }}
                class="node-btn"
                class:is-selected={selected === node.id}
                onClick={() => {
                  if (hasKids) {
                    if (isOpen) expanded.delete(node.id);
                    else expanded.add(node.id);
                  }
                  internalSel = node.id;
                  props.onSelect?.(node);
                }}
              >
                {hasKids ? (
                  <span class="chev" class:is-open={isOpen} aria-hidden="true">
                    <Icon icon={ChevronRight} size={14} />
                  </span>
                ) : (
                  <span class="spacer" aria-hidden="true" />
                )}
                <Icon icon={hasKids ? (isOpen ? FolderOpen : Folder) : File} size={14} />
                <span>{node.label}</span>
              </button>
              {hasKids && isOpen ? renderList(node.children!, true) : null}
            </li>
          );
        })}
      </ul>
    );

    yield (
      <div class={[treeScope, props.class].filter(Boolean).join(' ')}>
        {renderList(props.nodes)}
      </div>
    );
  }
}
