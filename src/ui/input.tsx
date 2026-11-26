import { scope, type View } from '@fierst/aster';

const fieldScope = scope`
  :scope {
    display: grid;
    gap: 0.375rem;
    font-family: var(--aster-font-sans);
  }
  .field-label {
    font-size: 0.84rem;
    font-weight: 500;
    color: var(--aster-on-surface);
  }
  .control-wrap {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: var(--aster-surface);
    border: 1px solid var(--aster-input-border);
    border-radius: var(--aster-radius-control);
    padding: 0 0.75rem;
    min-height: var(--aster-control-md);
    box-shadow: var(--aster-shadow-xs);
    transition:
      border-color var(--aster-dur-fast) var(--aster-ease-standard),
      box-shadow var(--aster-dur-fast) var(--aster-ease-standard);
  }
  .control-wrap:hover { border-color: var(--aster-border-strong); }
  .control-wrap:focus-within {
    border-color: var(--aster-primary);
    box-shadow: var(--aster-focus-ring);
  }
  .control-wrap.is-invalid { border-color: var(--aster-danger); }
  .control-wrap.is-invalid:focus-within {
    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.22);
  }
  input, textarea {
    flex: 1;
    min-width: 0;
    border: none;
    outline: none;
    background: transparent;
    color: var(--aster-on-surface);
    font: inherit;
    /* 16px on mobile prevents iOS Safari zoom; 14px on desktop */
    font-size: 1rem;
    padding: 0.42rem 0;
  }
  @media (min-width: 640px) {
    input, textarea { font-size: 0.875rem; }
  }
  textarea { resize: vertical; min-height: 82px; line-height: 1.5; }
  input::placeholder, textarea::placeholder { color: var(--aster-on-surface-subtle); }
  .adorn {
    color: var(--aster-on-surface-subtle);
    font-size: 0.8125rem;
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
  }
  .field-hint { font-size: 0.78rem; color: var(--aster-on-surface-muted); }
  .field-error { font-size: 0.78rem; color: var(--aster-danger); font-weight: 500; }
`;

let fieldSeq = 0;

export function Input({
  id,
  label,
  hint,
  error,
  leading,
  trailing,
  class: extraClass,
  ...rest
}: {
  id?: string;
  label?: string;
  hint?: string;
  error?: string | null;
  leading?: View;
  trailing?: View;
  class?: string;
  [key: string]: any;
}) {
  const inputId = id ?? `aster-in-${++fieldSeq}`;
  const descId = error || hint ? `${inputId}-desc` : undefined;
  return (
    <div class={[fieldScope, extraClass].filter(Boolean).join(' ')}>
      {label ? (
        <label class="field-label" for={inputId}>
          {label}
        </label>
      ) : null}
      <div class="control-wrap" class:is-invalid={Boolean(error)}>
        {leading ? <span class="adorn">{leading}</span> : null}
        <input {...rest} id={inputId} aria-invalid={Boolean(error)} aria-describedby={descId} />
        {trailing ? <span class="adorn">{trailing}</span> : null}
      </div>
      {error ? (
        <span id={descId} class="field-error" role="alert">
          {error}
        </span>
      ) : hint ? (
        <span id={descId} class="field-hint">
          {hint}
        </span>
      ) : null}
    </div>
  );
}

export function Textarea({
  id,
  label,
  hint,
  error,
  class: extraClass,
  ...rest
}: {
  id?: string;
  label?: string;
  hint?: string;
  error?: string | null;
  class?: string;
  [key: string]: any;
}) {
  const inputId = id ?? `aster-ta-${++fieldSeq}`;
  const descId = error || hint ? `${inputId}-desc` : undefined;
  return (
    <div class={[fieldScope, extraClass].filter(Boolean).join(' ')}>
      {label ? (
        <label class="field-label" for={inputId}>
          {label}
        </label>
      ) : null}
      <div class="control-wrap" class:is-invalid={Boolean(error)}>
        <textarea {...rest} id={inputId} aria-invalid={Boolean(error)} aria-describedby={descId} />
      </div>
      {error ? (
        <span id={descId} class="field-error" role="alert">
          {error}
        </span>
      ) : hint ? (
        <span id={descId} class="field-hint">
          {hint}
        </span>
      ) : null}
    </div>
  );
}
