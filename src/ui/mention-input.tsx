import { scope, type Ctx } from '@fierst/aster';

const mScope = scope`
  :scope { position: relative; display: grid; gap: 0.375rem; font-family: var(--aster-font-sans); }
  .m-label { font-size: 0.84rem; font-weight: 500; color: var(--aster-on-surface); }
  textarea {
    width: 100%;
    min-height: 82px;
    padding: 0.6rem 0.75rem;
    border-radius: var(--aster-radius-control);
    border: 1px solid var(--aster-input-border);
    background: var(--aster-surface);
    color: var(--aster-on-surface);
    box-shadow: var(--aster-shadow-xs);
    font: inherit;
    font-size: 0.875rem;
    resize: vertical;
    outline: none;
  }
  textarea:focus { border-color: var(--aster-primary); box-shadow: var(--aster-focus-ring); }
  .m-menu {
    position: absolute;
    z-index: 45;
    top: calc(100% + 4px);
    left: 0;
    width: min(260px, 100%);
    padding: 0.3rem;
    border-radius: var(--aster-radius-md);
    display: grid;
    gap: 2px;
  }
  .m-opt {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.42rem 0.6rem;
    border: none;
    border-radius: var(--aster-radius-xs);
    background: transparent;
    color: var(--aster-on-surface);
    font: inherit;
    font-size: 0.84rem;
    cursor: pointer;
    text-align: left;
  }
  .m-opt:hover { background: var(--aster-surface-muted); }
  .m-handle { font-family: var(--aster-font-mono); font-size: 0.76rem; color: var(--aster-on-surface-subtle); }
`;

export interface MentionCandidate {
  handle: string;
  name: string;
}

let mSeq = 0;

export function* MentionInput(
  props: {
    label?: string;
    candidates: readonly MentionCandidate[];
    value?: string;
    defaultValue?: string;
    placeholder?: string;
    onChange?: (val: string) => void;
    class?: string;
  },
  ctx: Ctx,
) {
  const uid = `aster-mention-${++mSeq}`;
  let internal = props.defaultValue ?? '';

  for (props of ctx) {
    const isControlled = props.value !== undefined;
    const current = isControlled ? props.value! : internal;
    const match = current.match(/(?:^|\s)@([a-zA-Z0-9_-]*)$/);
    const query = match ? match[1].toLowerCase() : null;
    const hits =
      query !== null
        ? props.candidates.filter(
            (c) => c.handle.toLowerCase().includes(query) || c.name.toLowerCase().includes(query),
          )
        : [];

    const setVal = (next: string) => {
      if (!isControlled) internal = next;
      props.onChange?.(next);
    };

    const insertMention = (handle: string) => {
      if (!match) return;
      const next = current.replace(/@([a-zA-Z0-9_-]*)$/, `@${handle} `);
      setVal(next);
    };

    yield (
      <div class={[mScope, props.class].filter(Boolean).join(' ')}>
        {props.label ? (
          <label class="m-label" for={uid}>
            {props.label}
          </label>
        ) : null}
        <textarea
          id={uid}
          value={current}
          placeholder={props.placeholder ?? 'Type @ to mention a teammate…'}
          onInput={(e: Event) => setVal((e.target as HTMLTextAreaElement).value)}
        />
        {hits.length > 0 ? (
          <div role="listbox" class="aster-surface-popover m-menu">
            {hits.map((c) => (
              <button
                key={c.handle}
                type="button"
                role="option"
                class="m-opt"
                on:mousedown={(e: Event) => {
                  e.preventDefault();
                  insertMention(c.handle);
                }}
              >
                <span>{c.name}</span>
                <span class="m-handle">@{c.handle}</span>
              </button>
            ))}
          </div>
        ) : null}
      </div>
    );
  }
}
