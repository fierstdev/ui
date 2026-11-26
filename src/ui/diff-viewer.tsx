import { scope } from '@fierst/aster';

const diffScope = scope`
  :scope {
    border-radius: var(--aster-radius-lg);
    border: 1px solid var(--aster-border);
    background: var(--aster-surface);
    overflow: hidden;
    font-family: var(--aster-font-mono);
    font-size: 0.8rem;
  }
  .df-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0.85rem;
    background: var(--aster-surface-muted);
    border-bottom: 1px solid var(--aster-border);
    font-size: 0.76rem;
    color: var(--aster-on-surface-muted);
  }
  .df-stats { display: inline-flex; gap: 0.5rem; font-weight: 600; }
  .df-add { color: var(--aster-success); }
  .df-del { color: var(--aster-danger); }
  .df-body { overflow-x: auto; }
  .df-line {
    display: grid;
    grid-template-columns: 38px 20px minmax(0, 1fr);
    padding: 0.14rem 0.75rem;
    line-height: 1.55;
    white-space: pre;
  }
  .df-line.k-add { background: var(--aster-success-subtle); color: var(--aster-on-success-subtle); }
  .df-line.k-del { background: var(--aster-danger-subtle); color: var(--aster-on-danger-subtle); }
  .df-ln { color: var(--aster-on-surface-subtle); user-select: none; text-align: right; padding-right: 0.6rem; }
  .df-sig { user-select: none; font-weight: 700; }
`;

export interface DiffLine {
  kind: 'ctx' | 'add' | 'del';
  text: string;
  lineNo?: number;
}

export function DiffViewer({
  filename = 'migration.sql',
  lines,
  class: extraClass,
}: {
  filename?: string;
  lines: readonly DiffLine[];
  class?: string;
}) {
  const adds = lines.filter((l) => l.kind === 'add').length;
  const dels = lines.filter((l) => l.kind === 'del').length;

  return (
    <div class={[diffScope, extraClass].filter(Boolean).join(' ')}>
      <div class="df-head">
        <span>{filename}</span>
        <span class="df-stats">
          <span class="df-add">+{adds}</span>
          <span class="df-del">-{dels}</span>
        </span>
      </div>
      <div class="df-body">
        {lines.map((line, idx) => (
          <div key={idx} class={`df-line k-${line.kind}`}>
            <span class="df-ln">{line.lineNo ?? idx + 1}</span>
            <span class="df-sig">
              {line.kind === 'add' ? '+' : line.kind === 'del' ? '-' : ' '}
            </span>
            <span>{line.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
