import { ChevronRight } from '@lucide/icons';
import { scope, type Ctx } from '@fierst/aster';
import { Icon } from './icon.tsx';

const jvScope = scope`
  :scope {
    padding: 0.75rem 0.9rem;
    border-radius: var(--aster-radius-lg);
    border: 1px solid var(--aster-border);
    background: var(--aster-surface);
    font-family: var(--aster-font-mono);
    font-size: 0.78rem;
    line-height: 1.6;
    overflow-x: auto;
  }
  .jv-row { display: flex; align-items: baseline; gap: 0.25rem; }
  .jv-children { padding-left: 1.15rem; border-left: 1px solid var(--aster-border); margin-left: 0.45rem; }
  .jv-tog {
    border: none;
    background: transparent;
    color: var(--aster-on-surface-subtle);
    padding: 0;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.2rem;
    font: inherit;
  }
  .jv-chev { display: inline-flex; transition: transform var(--aster-dur-fast); }
  .jv-chev.is-open { transform: rotate(90deg); }
  .jv-key { color: var(--aster-on-surface); font-weight: 550; }
  .jv-str { color: var(--aster-success); }
  .jv-num { color: var(--aster-primary); }
  .jv-bool { color: var(--aster-warning); }
  .jv-null { color: var(--aster-on-surface-subtle); font-style: italic; }
  .jv-punct { color: var(--aster-on-surface-subtle); }
`;

export function* JsonViewer(
  props: {
    data: unknown;
    defaultExpandedDepth?: number;
    class?: string;
  },
  ctx: Ctx,
) {
  const collapsed = new Set<string>();

  for (props of ctx) {
    const maxAuto = props.defaultExpandedDepth ?? 2;

    const renderVal = (val: unknown, path: string, depth: number, keyLabel?: string): any => {
      const prefix =
        keyLabel !== undefined ? (
          <span class="jv-key">
            "{keyLabel}"<span class="jv-punct">: </span>
          </span>
        ) : null;

      if (val === null)
        return (
          <div key={path} class="jv-row">
            {prefix}
            <span class="jv-null">null</span>
          </div>
        );
      if (typeof val === 'string')
        return (
          <div key={path} class="jv-row">
            {prefix}
            <span class="jv-str">"{val}"</span>
          </div>
        );
      if (typeof val === 'number')
        return (
          <div key={path} class="jv-row">
            {prefix}
            <span class="jv-num">{val}</span>
          </div>
        );
      if (typeof val === 'boolean')
        return (
          <div key={path} class="jv-row">
            {prefix}
            <span class="jv-bool">{String(val)}</span>
          </div>
        );

      if (typeof val === 'object') {
        const isArr = Array.isArray(val);
        const entries = isArr
          ? (val as unknown[]).map((v, i) => [String(i), v] as const)
          : Object.entries(val as Record<string, unknown>);
        const defaultClosed = depth >= maxAuto;
        const isOpen = defaultClosed ? collapsed.has(`open:${path}`) : !collapsed.has(path);

        const toggle = () => {
          if (defaultClosed) {
            const k = `open:${path}`;
            if (collapsed.has(k)) collapsed.delete(k);
            else collapsed.add(k);
          } else {
            if (collapsed.has(path)) collapsed.delete(path);
            else collapsed.add(path);
          }
        };

        return (
          <div key={path}>
            <div class="jv-row">
              <button type="button" class="jv-tog" onClick={toggle}>
                <span class="jv-chev" class:is-open={isOpen}>
                  <Icon icon={ChevronRight} size={12} />
                </span>
                {prefix}
                <span class="jv-punct">
                  {isArr ? `[${entries.length}]` : `{${entries.length}}`}
                </span>
              </button>
            </div>
            {isOpen ? (
              <div class="jv-children">
                {entries.map(([k, v]) =>
                  renderVal(v, `${path}.${k}`, depth + 1, isArr ? undefined : k),
                )}
              </div>
            ) : null}
          </div>
        );
      }

      return (
        <div key={path} class="jv-row">
          {prefix}
          <span>{formatViewerValue(val)}</span>
        </div>
      );
    };

    yield (
      <div class={[jvScope, props.class].filter(Boolean).join(' ')}>
        {renderVal(props.data, '$', 0)}
      </div>
    );
  }
}

function formatViewerValue(val: unknown): string {
  if (val === null) return 'null';
  if (val === undefined) return 'undefined';
  if (typeof val === 'string') return val;
  if (typeof val === 'number' || typeof val === 'boolean' || typeof val === 'bigint') {
    return `${val}`;
  }
  try {
    return JSON.stringify(val) ?? '';
  } catch {
    return '[Circular]';
  }
}
