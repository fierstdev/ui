import { Check, Copy } from '@lucide/icons';
import { scope, type Ctx } from '@fierst/aster';
import { Icon } from './icon.tsx';

const copyScope = scope`
  :scope {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
    height: 30px;
    padding: 0 0.55rem;
    border-radius: var(--aster-radius-sm);
    border: 1px solid var(--aster-border);
    background: var(--aster-surface);
    color: var(--aster-on-surface-muted);
    font-family: var(--aster-font-sans);
    font-size: 0.78rem;
    font-weight: 500;
    cursor: pointer;
    touch-action: manipulation;
    transition: background-color var(--aster-dur-fast), color var(--aster-dur-fast), border-color var(--aster-dur-fast);
  }
  :scope:hover { background: var(--aster-surface-muted); color: var(--aster-on-surface); }
  :scope:focus-visible { outline: none; box-shadow: var(--aster-focus-ring); }
  :scope.is-copied {
    color: var(--aster-success);
    border-color: var(--aster-success-border);
    background: var(--aster-success-subtle);
  }
`;

const codeScope = scope`
  :scope {
    border-radius: var(--aster-radius-lg);
    border: 1px solid var(--aster-border);
    background: var(--aster-surface);
    overflow: hidden;
  }
  .cb-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0.5rem 0.85rem;
    border-bottom: 1px solid var(--aster-border);
    background: var(--aster-surface-muted);
    font-family: var(--aster-font-mono);
    font-size: 0.76rem;
    color: var(--aster-on-surface-muted);
  }
  pre {
    margin: 0;
    padding: 0.9rem 1rem;
    overflow-x: auto;
    font-family: var(--aster-font-mono);
    font-size: 0.8125rem;
    line-height: 1.55;
    color: var(--aster-on-surface);
  }
`;

export function* CopyButton(
  props: {
    text: string;
    label?: string;
    copiedLabel?: string;
    resetMs?: number;
    onCopy?: () => void;
    class?: string;
  },
  ctx: Ctx,
) {
  let copied = false;
  let timer: ReturnType<typeof setTimeout> | null = null;

  const clearTimer = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };

  try {
    for (props of ctx) {
      const doCopy = async () => {
        try {
          await navigator.clipboard?.writeText(props.text);
        } catch {}
        copied = true;
        props.onCopy?.();
        clearTimer();
        timer = setTimeout(() => {
          copied = false;
          ctx.refresh();
        }, props.resetMs ?? 1800);
        ctx.refresh();
      };

      yield (
        <button
          type="button"
          class={[copyScope, copied ? 'is-copied' : '', props.class].filter(Boolean).join(' ')}
          aria-label={copied ? 'Copied' : (props.label ?? 'Copy to clipboard')}
          onClick={doCopy}
        >
          <Icon icon={copied ? Check : Copy} size={13} />
          {props.label || copied ? (
            <span>{copied ? (props.copiedLabel ?? 'Copied') : props.label}</span>
          ) : null}
        </button>
      );
    }
  } finally {
    clearTimer();
  }
}

export function CodeBlock({
  code,
  filename,
  class: extraClass,
}: {
  code: string;
  filename?: string;
  class?: string;
}) {
  return (
    <div class={[codeScope, extraClass].filter(Boolean).join(' ')}>
      <div class="cb-head">
        <span>{filename ?? 'terminal'}</span>
        <CopyButton text={code} label="Copy" />
      </div>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}
