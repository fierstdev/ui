import { scope, type Ctx, type View } from '@fierst/aster';

const tabsScope = scope`
  :scope { display: grid; gap: 1rem; min-width: 0; }

  /* Variant 1: Segmented (shadcn default) */
  .tablist.v-segmented {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    padding: 3px;
    border-radius: var(--aster-radius-control);
    background: var(--aster-surface-muted);
    width: fit-content;
    max-width: 100%;
    overflow-x: auto;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
  }
  .tablist.v-segmented .tab {
    flex-shrink: 0;
    height: calc(var(--aster-control-sm) - 2px);
    padding: 0 0.75rem;
    border-radius: calc(var(--aster-radius-control) - 2px);
    border: none;
    background: transparent;
    color: var(--aster-on-surface-muted);
    font-family: var(--aster-font-sans);
    font-size: 0.84rem;
    font-weight: 500;
    cursor: pointer;
    touch-action: manipulation;
    transition:
      background-color var(--aster-dur-fast) var(--aster-ease-standard),
      color var(--aster-dur-fast) var(--aster-ease-standard),
      box-shadow var(--aster-dur-fast) var(--aster-ease-standard);
  }
  .tablist.v-segmented .tab:hover { color: var(--aster-on-surface); }
  .tablist.v-segmented .tab.is-active {
    background: var(--aster-surface);
    color: var(--aster-on-surface);
    box-shadow: var(--aster-shadow-xs);
  }

  /* Variant 2: Underline (TailwindUI classic) */
  .tablist.v-underline {
    display: flex;
    align-items: center;
    gap: 1.25rem;
    border-bottom: 1px solid var(--aster-border);
    max-width: 100%;
    overflow-x: auto;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
  }
  .tablist.v-underline .tab {
    flex-shrink: 0;
    padding: 0.55rem 0.1rem;
    margin-bottom: -1px;
    border: none;
    border-bottom: 2px solid transparent;
    background: transparent;
    color: var(--aster-on-surface-muted);
    font-family: var(--aster-font-sans);
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    touch-action: manipulation;
    transition: color var(--aster-dur-fast), border-color var(--aster-dur-fast);
  }
  .tablist.v-underline .tab:hover { color: var(--aster-on-surface); border-bottom-color: var(--aster-border-strong); }
  .tablist.v-underline .tab.is-active { color: var(--aster-primary); border-bottom-color: var(--aster-primary); }

  .tablist::-webkit-scrollbar { display: none; }
  .tab:focus-visible { outline: none; box-shadow: var(--aster-focus-ring); }
  .tabpanel { outline: none; min-width: 0; }
`;

export interface TabItem {
  id: string;
  label: string;
  content: View | (() => View);
}

let tabSeq = 0;

export function* Tabs(
  props: {
    items: readonly TabItem[];
    variant?: 'segmented' | 'underline';
    value?: string;
    defaultValue?: string;
    label?: string;
    onChange?: (id: string) => void;
    class?: string;
  },
  ctx: Ctx,
) {
  const uid = `aster-tabs-${++tabSeq}`;
  let internalId = props.defaultValue ?? props.items[0]?.id ?? '';

  for (props of ctx) {
    const isControlled = props.value !== undefined;
    const activeId = isControlled ? props.value! : internalId;
    const current = props.items.find((t) => t.id === activeId) ?? props.items[0];
    const currentIdx = props.items.findIndex((t) => t.id === current?.id);

    const select = (id: string, moveFocus = false) => {
      if (!isControlled) internalId = id;
      props.onChange?.(id);
      if (moveFocus) {
        queueMicrotask(() => document.getElementById(`${uid}-tab-${id}`)?.focus());
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const len = props.items.length;
      if (len === 0) return;
      let nextIdx = -1;
      if (e.key === 'ArrowRight') nextIdx = (currentIdx + 1) % len;
      else if (e.key === 'ArrowLeft') nextIdx = (currentIdx - 1 + len) % len;
      else if (e.key === 'Home') nextIdx = 0;
      else if (e.key === 'End') nextIdx = len - 1;
      if (nextIdx !== -1) {
        e.preventDefault();
        select(props.items[nextIdx].id, true);
      }
    };

    const panelContent =
      current && typeof current.content === 'function'
        ? current.content()
        : (current?.content ?? null);
    const variant = props.variant ?? 'segmented';

    yield (
      <div class={[tabsScope, props.class].filter(Boolean).join(' ')}>
        <div
          role="tablist"
          aria-label={props.label ?? 'Tabs'}
          class={`tablist v-${variant}`}
          onKeyDown={onKeyDown}
        >
          {props.items.map((item) => {
            const selected = item.id === current?.id;
            return (
              <button
                key={item.id}
                id={`${uid}-tab-${item.id}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={`${uid}-panel`}
                tabIndex={selected ? 0 : -1}
                class="tab"
                class:is-active={selected}
                onClick={() => select(item.id)}
              >
                {item.label}
              </button>
            );
          })}
        </div>
        <div
          id={`${uid}-panel`}
          role="tabpanel"
          aria-labelledby={current ? `${uid}-tab-${current.id}` : undefined}
          class="tabpanel"
        >
          {typeof panelContent === 'function' ? panelContent() : panelContent}
        </div>
      </div>
    );
  }
}
