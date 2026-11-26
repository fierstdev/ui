import { scope, type Ctx, type View } from '@fierst/aster';

const toggleScope = scope`
  :scope {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    height: var(--aster-control-md);
    min-width: var(--aster-control-md);
    padding: 0 0.65rem;
    border-radius: var(--aster-radius-control);
    border: 1px solid transparent;
    background: transparent;
    color: var(--aster-on-surface-muted);
    font-family: var(--aster-font-sans);
    font-size: 0.84rem;
    font-weight: 500;
    cursor: pointer;
    touch-action: manipulation;
    transition:
      background-color var(--aster-dur-fast) var(--aster-ease-standard),
      border-color var(--aster-dur-fast) var(--aster-ease-standard),
      color var(--aster-dur-fast) var(--aster-ease-standard);
  }
  :scope.sz-sm { height: var(--aster-control-sm); min-width: var(--aster-control-sm); padding: 0 0.5rem; font-size: 0.8rem; }
  :scope.v-outline { border-color: var(--aster-border); background: var(--aster-surface); }
  :scope:hover:not(:disabled) { background: var(--aster-surface-muted); color: var(--aster-on-surface); }
  :scope:focus-visible { outline: none; box-shadow: var(--aster-focus-ring); }
  :scope:disabled { opacity: 0.45; pointer-events: none; }
  :scope.is-pressed {
    background: var(--aster-primary-subtle);
    color: var(--aster-on-primary-subtle);
    border-color: var(--aster-primary-border);
  }
`;

const tgGroupScope = scope`
  :scope {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 3px;
    border-radius: var(--aster-radius-control);
    border: 1px solid var(--aster-border);
    background: var(--aster-surface);
  }
`;

export function* Toggle(
  props: {
    pressed?: boolean;
    defaultPressed?: boolean;
    variant?: 'default' | 'outline';
    size?: 'sm' | 'md';
    disabled?: boolean;
    label?: string;
    onPressedChange?: (pressed: boolean) => void;
    class?: string;
    children?: View;
  },
  ctx: Ctx,
) {
  let internal = props.defaultPressed ?? false;

  for (props of ctx) {
    const isControlled = props.pressed !== undefined;
    const isPressed = isControlled ? Boolean(props.pressed) : internal;

    const click = () => {
      if (props.disabled) return;
      const next = !isPressed;
      if (!isControlled) internal = next;
      props.onPressedChange?.(next);
    };

    yield (
      <button
        type="button"
        aria-pressed={isPressed}
        aria-label={props.label}
        disabled={props.disabled}
        class={[
          toggleScope,
          props.variant === 'outline' ? 'v-outline' : '',
          props.size === 'sm' ? 'sz-sm' : '',
          props.class,
        ]
          .filter(Boolean)
          .join(' ')}
        class:is-pressed={isPressed}
        onClick={click}
      >
        {props.children}
      </button>
    );
  }
}

export interface ToggleOption {
  value: string;
  label: string;
  content: View;
  disabled?: boolean;
}

export function* ToggleGroup(
  props: {
    type?: 'single' | 'multiple';
    options: readonly ToggleOption[];
    value?: string | readonly string[];
    defaultValue?: string | readonly string[];
    size?: 'sm' | 'md';
    label?: string;
    onChange?: (value: any) => void;
    class?: string;
  },
  ctx: Ctx,
) {
  const mode = props.type ?? 'single';
  let internal: string[] = Array.isArray(props.defaultValue)
    ? [...props.defaultValue]
    : typeof props.defaultValue === 'string'
      ? [props.defaultValue]
      : [];

  for (props of ctx) {
    const isControlled = props.value !== undefined;
    const selected: string[] = isControlled
      ? Array.isArray(props.value)
        ? [...props.value]
        : typeof props.value === 'string' && props.value
          ? [props.value]
          : []
      : internal;

    const handleToggle = (val: string) => {
      let next: string[];
      if (mode === 'single') {
        next = selected.includes(val) ? [] : [val];
        if (!isControlled) internal = next;
        props.onChange?.(next[0] ?? '');
      } else {
        next = selected.includes(val) ? selected.filter((v) => v !== val) : [...selected, val];
        if (!isControlled) internal = next;
        props.onChange?.(next);
      }
    };

    yield (
      <div
        role="group"
        aria-label={props.label ?? 'Toggle options'}
        class={[tgGroupScope, props.class].filter(Boolean).join(' ')}
      >
        {props.options.map((opt) => (
          <Toggle
            key={opt.value}
            size={props.size ?? 'sm'}
            label={opt.label}
            disabled={opt.disabled}
            pressed={selected.includes(opt.value)}
            onPressedChange={() => handleToggle(opt.value)}
          >
            {opt.content}
          </Toggle>
        ))}
      </div>
    );
  }
}
