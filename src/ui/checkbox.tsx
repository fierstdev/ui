import { Check, Minus } from '@lucide/icons';
import { scope, type Ctx } from '@fierst/aster';
import { Icon } from './icon.tsx';

const checkScope = scope`
  :scope {
    position: relative;
    display: inline-flex;
    align-items: flex-start;
    gap: 0.7rem;
    cursor: pointer;
    user-select: none;
    touch-action: manipulation;
    font-family: var(--aster-font-sans);
    min-height: 28px;
  }
  :scope.is-disabled { opacity: 0.45; cursor: not-allowed; }
  :scope.is-card {
    display: flex;
    width: 100%;
    padding: 0.85rem 1rem;
    border-radius: var(--aster-radius-md);
    border: 1px solid var(--aster-outline-variant);
    background: var(--aster-surface);
    transition:
      border-color var(--aster-dur-fast) var(--aster-ease-standard),
      background var(--aster-dur-fast) var(--aster-ease-standard),
      border-radius var(--aster-dur-fast) var(--aster-ease-motion);
  }
  :scope.is-card:hover:not(.is-disabled) {
    border-color: var(--aster-outline);
    background: var(--aster-surface-low);
  }
  :scope.is-card.is-checked {
    border-color: var(--aster-primary);
    background: var(--aster-primary-container);
  }
  :scope.is-card.is-checked .label { color: var(--aster-on-primary-container); }
  :scope.is-card.is-checked .desc { color: var(--aster-on-primary-container); opacity: 0.82; }

  .native-input {
    position: absolute;
    opacity: 0;
    width: 1px;
    height: 1px;
    pointer-events: none;
  }

  .box {
    width: 20px;
    height: 20px;
    margin-top: 1px;
    border-radius: var(--aster-radius-xs);
    border: 1.5px solid var(--aster-outline);
    background: var(--aster-surface);
    color: var(--aster-on-primary);
    display: inline-grid;
    place-items: center;
    flex-shrink: 0;
    transition:
      background var(--aster-dur-fast) var(--aster-ease-standard),
      border-color var(--aster-dur-fast) var(--aster-ease-standard),
      transform var(--aster-dur-fast) var(--aster-ease-motion),
      border-radius var(--aster-dur-fast) var(--aster-ease-motion);
  }
  @media (pointer: coarse) {
    .box { width: 22px; height: 22px; }
  }
  .native-input:focus-visible + .box {
    box-shadow: var(--aster-focus-ring);
    border-color: var(--aster-primary);
  }
  :scope:active:not(.is-disabled) .box { transform: scale(0.92); }
  .box.is-checked {
    background: var(--aster-primary);
    border-color: var(--aster-primary);
  }

  .radio-dot {
    width: 20px;
    height: 20px;
    margin-top: 1px;
    border-radius: var(--aster-radius-full);
    border: 1.5px solid var(--aster-outline);
    background: var(--aster-surface);
    display: inline-grid;
    place-items: center;
    flex-shrink: 0;
    transition:
      border-color var(--aster-dur-fast) var(--aster-ease-standard),
      transform var(--aster-dur-fast) var(--aster-ease-motion);
  }
  @media (pointer: coarse) {
    .radio-dot { width: 22px; height: 22px; }
  }
  .native-input:focus-visible + .radio-dot {
    box-shadow: var(--aster-focus-ring);
    border-color: var(--aster-primary);
  }
  .radio-dot.is-checked { border-color: var(--aster-primary); border-width: 2px; }
  .radio-pip {
    width: 10px;
    height: 10px;
    border-radius: var(--aster-radius-full);
    background: var(--aster-primary);
    transform: scale(0);
    transition: transform var(--aster-dur-med) var(--aster-ease-motion);
  }
  .radio-dot.is-checked .radio-pip { transform: scale(1); }

  .copy { display: grid; gap: 0.12rem; }
  .label { font-size: 0.92rem; font-weight: 550; color: var(--aster-on-surface); line-height: 1.35; }
  .desc { font-size: 0.82rem; color: var(--aster-on-surface-variant); line-height: 1.4; }
`;

const groupScope = scope`
  :scope {
    border: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 0.55rem;
    font-family: var(--aster-font-sans);
  }
  :scope.is-horizontal {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem 1.25rem;
  }
  legend {
    padding: 0;
    margin-bottom: 0.35rem;
    font-size: 0.84rem;
    font-weight: 600;
    color: var(--aster-on-surface);
  }
`;

export function* Checkbox(
  props: {
    checked?: boolean;
    defaultChecked?: boolean;
    indeterminate?: boolean;
    label?: string;
    description?: string;
    disabled?: boolean;
    card?: boolean;
    name?: string;
    value?: string;
    onChange?: (checked: boolean) => void;
    class?: string;
  },
  ctx: Ctx,
) {
  let internal = props.defaultChecked ?? false;

  for (props of ctx) {
    const isControlled = props.checked !== undefined;
    const isChecked = isControlled ? Boolean(props.checked) : internal;
    const active = isChecked || Boolean(props.indeterminate);

    const onInputChange = (e: Event) => {
      if (props.disabled) return;
      const next = (e.target as HTMLInputElement).checked;
      if (!isControlled) internal = next;
      props.onChange?.(next);
    };

    yield (
      <label
        class={[checkScope, props.card ? 'is-card' : '', active ? 'is-checked' : '', props.class]
          .filter(Boolean)
          .join(' ')}
        class:is-disabled={Boolean(props.disabled)}
      >
        <input
          type="checkbox"
          class="native-input"
          ref={(el) => {
            if (el) el.indeterminate = Boolean(props.indeterminate);
          }}
          name={props.name}
          value={props.value}
          checked={isChecked}
          disabled={props.disabled}
          aria-checked={props.indeterminate ? 'mixed' : isChecked}
          onChange={onInputChange}
        />
        <span class="box" class:is-checked={active} aria-hidden="true">
          {props.indeterminate ? (
            <Icon icon={Minus} size={13} strokeWidth={2.6} />
          ) : isChecked ? (
            <Icon icon={Check} size={13} strokeWidth={2.6} />
          ) : null}
        </span>
        {props.label || props.description ? (
          <span class="copy">
            {props.label ? <span class="label">{props.label}</span> : null}
            {props.description ? <span class="desc">{props.description}</span> : null}
          </span>
        ) : null}
      </label>
    );
  }
}

export interface ChoiceOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export function* CheckboxGroup(
  props: {
    legend?: string;
    options: readonly ChoiceOption[];
    value?: readonly string[];
    defaultValue?: readonly string[];
    card?: boolean;
    orientation?: 'vertical' | 'horizontal';
    onChange?: (values: string[]) => void;
    class?: string;
  },
  ctx: Ctx,
) {
  let internal = [...(props.defaultValue ?? [])];

  for (props of ctx) {
    const isControlled = props.value !== undefined;
    const selected = isControlled ? props.value! : internal;

    const toggle = (val: string, checked: boolean) => {
      const next = checked
        ? [...new Set([...selected, val])]
        : selected.filter((item) => item !== val);
      if (!isControlled) internal = next;
      props.onChange?.(next);
    };

    yield (
      <fieldset
        class={[groupScope, props.orientation === 'horizontal' ? 'is-horizontal' : '', props.class]
          .filter(Boolean)
          .join(' ')}
      >
        {props.legend ? <legend>{props.legend}</legend> : null}
        {props.options.map((opt) => (
          <Checkbox
            key={opt.value}
            value={opt.value}
            label={opt.label}
            description={opt.description}
            disabled={opt.disabled}
            card={props.card}
            checked={selected.includes(opt.value)}
            onChange={(checked) => toggle(opt.value, checked)}
          />
        ))}
      </fieldset>
    );
  }
}

let radioGroupSeq = 0;

export function* RadioGroup(
  props: {
    legend?: string;
    name?: string;
    options: readonly ChoiceOption[];
    value?: string;
    defaultValue?: string;
    card?: boolean;
    orientation?: 'vertical' | 'horizontal';
    onChange?: (value: string) => void;
    class?: string;
  },
  ctx: Ctx,
) {
  const groupName = props.name ?? `aster-rg-${++radioGroupSeq}`;
  let internal = props.defaultValue ?? props.options[0]?.value ?? '';

  for (props of ctx) {
    const isControlled = props.value !== undefined;
    const current = isControlled ? props.value! : internal;

    const choose = (val: string) => {
      if (!isControlled) internal = val;
      props.onChange?.(val);
    };

    yield (
      <fieldset
        role="radiogroup"
        class={[groupScope, props.orientation === 'horizontal' ? 'is-horizontal' : '', props.class]
          .filter(Boolean)
          .join(' ')}
      >
        {props.legend ? <legend>{props.legend}</legend> : null}
        {props.options.map((opt) => {
          const isChecked = opt.value === current;
          return (
            <label
              key={opt.value}
              class={[checkScope, props.card ? 'is-card' : '', isChecked ? 'is-checked' : '']
                .filter(Boolean)
                .join(' ')}
              class:is-disabled={Boolean(opt.disabled)}
            >
              <input
                type="radio"
                class="native-input"
                name={groupName}
                value={opt.value}
                checked={isChecked}
                disabled={opt.disabled}
                onChange={() => !opt.disabled && choose(opt.value)}
              />
              <span class="radio-dot" class:is-checked={isChecked} aria-hidden="true">
                <span class="radio-pip" />
              </span>
              <span class="copy">
                <span class="label">{opt.label}</span>
                {opt.description ? <span class="desc">{opt.description}</span> : null}
              </span>
            </label>
          );
        })}
      </fieldset>
    );
  }
}
