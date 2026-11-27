import './theme.css';
import { ArrowUp, Paperclip, Square } from '@lucide/icons';
import { scope, type Ctx, type View } from '@fierst/aster';
import { Icon } from './icon';

const piScope = scope`
  :scope {
    display: grid;
    gap: 0.45rem;
    padding: 0.65rem 0.75rem;
    border-radius: var(--aster-radius-lg);
    border: 1px solid var(--aster-input-border);
    background: var(--aster-surface);
    box-shadow: var(--aster-shadow-xs);
    font-family: var(--aster-font-sans);
    transition: border-color var(--aster-dur-fast), box-shadow var(--aster-dur-fast);
  }
  :scope:focus-within { border-color: var(--aster-primary); box-shadow: var(--aster-focus-ring); }
  textarea {
    width: 100%;
    min-height: 44px;
    max-height: 180px;
    border: none;
    outline: none;
    resize: none;
    background: transparent;
    color: var(--aster-on-surface);
    font: inherit;
    font-size: 1rem;
    line-height: 1.5;
  }
  @media (min-width: 640px) { textarea { font-size: 0.875rem; } }
  textarea::placeholder { color: var(--aster-on-surface-subtle); }
  .pi-bar { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; }
  .pi-left { display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap; }
  .pi-icon-btn {
    width: 30px;
    height: 30px;
    border-radius: var(--aster-radius-control);
    border: 1px solid var(--aster-border);
    background: var(--aster-surface);
    color: var(--aster-on-surface-muted);
    display: inline-grid;
    place-items: center;
    cursor: pointer;
  }
  .pi-icon-btn:hover { background: var(--aster-surface-muted); color: var(--aster-on-surface); }
  .pi-send {
    width: 32px;
    height: 32px;
    border-radius: var(--aster-radius-control);
    border: none;
    background: var(--aster-primary);
    color: var(--aster-on-primary);
    display: inline-grid;
    place-items: center;
    cursor: pointer;
    transition: background-color var(--aster-dur-fast), transform var(--aster-dur-fast);
  }
  .pi-send:hover:not(:disabled) { background: var(--aster-primary-hover); }
  .pi-send:active:not(:disabled) { transform: scale(0.96); }
  .pi-send:disabled { opacity: 0.4; cursor: not-allowed; }
  .pi-stop { background: var(--aster-danger); color: var(--aster-on-danger); }
`;

export function* PromptInput(
  props: {
    value?: string;
    placeholder?: string;
    streaming?: boolean;
    disabled?: boolean;
    leading?: View;
    onAttach?: () => void;
    onChange?: (val: string) => void;
    onSubmit?: (prompt: string) => void;
    onStop?: () => void;
    class?: string;
  },
  ctx: Ctx,
) {
  let internal = '';

  for (props of ctx) {
    const isControlled = props.value !== undefined;
    const current = isControlled ? props.value! : internal;

    const setVal = (v: string) => {
      if (!isControlled) internal = v;
      props.onChange?.(v);
    };

    const submit = () => {
      const trimmed = current.trim();
      if (!trimmed || props.disabled || props.streaming) return;
      props.onSubmit?.(trimmed);
      if (!isControlled) internal = '';
    };

    yield (
      <div class={[piScope, props.class].filter(Boolean).join(' ')}>
        <textarea
          rows={2}
          disabled={props.disabled}
          placeholder={props.placeholder ?? 'Ask an agent or describe a workflow… (Enter to send)'}
          value={current}
          onInput={(e: Event) => setVal((e.target as HTMLTextAreaElement).value)}
          onKeyDown={(e: KeyboardEvent) => {
            if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
              e.preventDefault();
              submit();
            }
          }}
        />
        <div class="pi-bar">
          <div class="pi-left">
            {props.onAttach ? (
              <button
                type="button"
                class="pi-icon-btn"
                aria-label="Attach file"
                onClick={props.onAttach}
              >
                <Icon icon={Paperclip} size={14} />
              </button>
            ) : null}
            {props.leading ?? null}
          </div>
          {props.streaming ? (
            <button
              type="button"
              class="pi-send pi-stop"
              aria-label="Stop generation"
              onClick={props.onStop}
            >
              <Icon icon={Square} size={13} />
            </button>
          ) : (
            <button
              type="button"
              class="pi-send"
              aria-label="Send prompt"
              disabled={!current.trim() || props.disabled}
              onClick={submit}
            >
              <Icon icon={ArrowUp} size={15} />
            </button>
          )}
        </div>
      </div>
    );
  }
}
