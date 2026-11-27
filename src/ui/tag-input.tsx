import './theme.css';
import { X } from '@lucide/icons';
import { scope, type Ctx } from '@fierst/aster';
import { Icon } from './icon';

const tagScope = scope`
  :scope {
    display: grid;
    gap: 0.375rem;
    font-family: var(--aster-font-sans);
  }
  .tag-label { font-size: 0.84rem; font-weight: 500; color: var(--aster-on-surface); }
  .tag-box {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.35rem;
    min-height: var(--aster-control-md);
    padding: 0.3rem 0.55rem;
    border-radius: var(--aster-radius-control);
    border: 1px solid var(--aster-input-border);
    background: var(--aster-surface);
    box-shadow: var(--aster-shadow-xs);
    transition: border-color var(--aster-dur-fast), box-shadow var(--aster-dur-fast);
  }
  .tag-box:focus-within { border-color: var(--aster-primary); box-shadow: var(--aster-focus-ring); }
  .chip {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.14rem 0.45rem;
    border-radius: var(--aster-radius-xs);
    background: var(--aster-surface-muted);
    border: 1px solid var(--aster-border);
    color: var(--aster-on-surface);
    font-size: 0.78rem;
    font-weight: 500;
  }
  .chip-x {
    border: none;
    background: transparent;
    color: var(--aster-on-surface-subtle);
    padding: 0;
    display: inline-grid;
    place-items: center;
    cursor: pointer;
    border-radius: 2px;
  }
  .chip-x:hover { color: var(--aster-on-surface); }
  .tag-input {
    flex: 1;
    min-width: 90px;
    border: none;
    outline: none;
    background: transparent;
    color: var(--aster-on-surface);
    font: inherit;
    font-size: 1rem;
    padding: 0.15rem 0.2rem;
  }
  @media (min-width: 640px) {
    .tag-input { font-size: 0.875rem; }
  }
  .tag-input::placeholder { color: var(--aster-on-surface-subtle); }
  .tag-hint { font-size: 0.78rem; color: var(--aster-on-surface-muted); }
`;

let tagSeq = 0;

export function* TagInput(
  props: {
    label?: string;
    value?: readonly string[];
    defaultValue?: readonly string[];
    placeholder?: string;
    hint?: string;
    maxTags?: number;
    disabled?: boolean;
    onChange?: (tags: string[]) => void;
    class?: string;
  },
  ctx: Ctx,
) {
  const uid = `aster-tag-${++tagSeq}`;
  let internal = [...(props.defaultValue ?? [])];
  let draft = '';

  for (props of ctx) {
    const isControlled = props.value !== undefined;
    const tags = isControlled ? [...props.value!] : internal;
    const maxTags = props.maxTags ?? 20;

    const commit = (next: string[]) => {
      if (!isControlled) internal = next;
      props.onChange?.(next);
    };

    const addTag = (raw: string) => {
      const cleaned = raw.trim();
      if (!cleaned || tags.length >= maxTags) return;
      if (!tags.includes(cleaned)) commit([...tags, cleaned]);
      draft = '';
    };

    const removeTag = (val: string) => {
      commit(tags.filter((t) => t !== val));
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        addTag(draft);
      } else if (e.key === 'Backspace' && !draft && tags.length > 0) {
        removeTag(tags[tags.length - 1]);
      }
    };

    yield (
      <div class={[tagScope, props.class].filter(Boolean).join(' ')}>
        {props.label ? (
          <label class="tag-label" for={uid}>
            {props.label}
          </label>
        ) : null}
        <div class="tag-box">
          {tags.map((tag) => (
            <span key={tag} class="chip">
              <span>{tag}</span>
              {!props.disabled ? (
                <button
                  type="button"
                  class="chip-x"
                  aria-label={`Remove ${tag}`}
                  onClick={() => removeTag(tag)}
                >
                  <Icon icon={X} size={12} />
                </button>
              ) : null}
            </span>
          ))}
          <input
            id={uid}
            type="text"
            class="tag-input"
            disabled={props.disabled || tags.length >= maxTags}
            bind:value={draft}
            placeholder={tags.length === 0 ? (props.placeholder ?? 'Add tag and press Enter…') : ''}
            onKeyDown={onKeyDown}
            onBlur={() => draft.trim() && addTag(draft)}
          />
        </div>
        {props.hint ? <span class="tag-hint">{props.hint}</span> : null}
      </div>
    );
  }
}
