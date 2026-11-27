import './theme.css';
import { scope, type View } from '@fierst/aster';

const labelScope = scope`
  :scope {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    font-family: var(--aster-font-sans);
    font-size: 0.84rem;
    font-weight: 500;
    color: var(--aster-on-surface);
    line-height: 1.4;
  }
  .req { color: var(--aster-danger); }
`;

const fieldWrapScope = scope`
  :scope {
    display: grid;
    gap: 0.375rem;
    font-family: var(--aster-font-sans);
  }
  .hint { font-size: 0.78rem; color: var(--aster-on-surface-muted); }
  .err { font-size: 0.78rem; color: var(--aster-danger); font-weight: 500; }
`;

export function Label({
  for: htmlFor,
  required = false,
  class: extraClass,
  children,
}: {
  for?: string;
  required?: boolean;
  class?: string;
  children?: View;
}) {
  return (
    <label for={htmlFor} class={[labelScope, extraClass].filter(Boolean).join(' ')}>
      <span>{children}</span>
      {required ? (
        <span class="req" aria-hidden="true">
          *
        </span>
      ) : null}
    </label>
  );
}

export function Field({
  label,
  for: htmlFor,
  required = false,
  hint,
  error,
  class: extraClass,
  children,
}: {
  label?: string;
  for?: string;
  required?: boolean;
  hint?: string;
  error?: string | null;
  class?: string;
  children?: View;
}) {
  return (
    <div class={[fieldWrapScope, extraClass].filter(Boolean).join(' ')}>
      {label ? (
        <Label for={htmlFor} required={required}>
          {label}
        </Label>
      ) : null}
      {children}
      {error ? (
        <span class="err" role="alert">
          {error}
        </span>
      ) : hint ? (
        <span class="hint">{hint}</span>
      ) : null}
    </div>
  );
}
