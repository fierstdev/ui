import './theme.css';
import { scope, type Ctx } from '@fierst/aster';

const switchScope = scope`
  :scope {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.85rem;
    cursor: pointer;
    user-select: none;
    touch-action: manipulation;
  }
  :scope.is-disabled { opacity: 0.5; cursor: not-allowed; }
  .copy { display: grid; gap: 0.1rem; }
  .label { font-size: 0.875rem; font-weight: 500; color: var(--aster-on-surface); }
  .desc { font-size: 0.8125rem; color: var(--aster-on-surface-muted); }

  .track {
    position: relative;
    width: 40px;
    height: 22px;
    padding: 2px;
    border-radius: 9999px;
    border: 1px solid transparent;
    background: var(--aster-border-strong);
    display: inline-flex;
    align-items: center;
    cursor: inherit;
    flex-shrink: 0;
    transition:
      background-color var(--aster-dur-med) var(--aster-ease-standard),
      box-shadow var(--aster-dur-fast) var(--aster-ease-standard);
  }
  .track:focus-visible { outline: none; box-shadow: var(--aster-focus-ring); }
  .track.is-on { background: var(--aster-primary); }
  .thumb {
    width: 16px;
    height: 16px;
    border-radius: 9999px;
    background: var(--aster-on-primary);
    box-shadow: var(--aster-shadow-sm);
    transition: transform var(--aster-dur-med) var(--aster-ease-spring);
  }
  .track:not(.is-on) .thumb { background: #ffffff; }
  .track.is-on .thumb { transform: translateX(18px); }
`;

export function* Switch(
  props: {
    checked?: boolean;
    defaultChecked?: boolean;
    label?: string;
    description?: string;
    disabled?: boolean;
    onChange?: (checked: boolean) => void;
    class?: string;
  },
  ctx: Ctx,
) {
  let internal = props.defaultChecked ?? false;

  for (props of ctx) {
    const isControlled = props.checked !== undefined;
    const isOn = isControlled ? Boolean(props.checked) : internal;

    const toggle = () => {
      if (props.disabled) return;
      const next = !isOn;
      if (!isControlled) internal = next;
      props.onChange?.(next);
    };

    yield (
      <div
        class={[switchScope, props.class].filter(Boolean).join(' ')}
        class:is-disabled={Boolean(props.disabled)}
        onClick={toggle}
      >
        {props.label || props.description ? (
          <div class="copy">
            {props.label ? <span class="label">{props.label}</span> : null}
            {props.description ? <span class="desc">{props.description}</span> : null}
          </div>
        ) : null}
        <button
          type="button"
          role="switch"
          aria-checked={isOn}
          aria-label={props.label ?? 'Toggle'}
          disabled={props.disabled}
          class="track"
          class:is-on={isOn}
          onClick={(e: MouseEvent) => {
            e.stopPropagation();
            toggle();
          }}
        >
          <span class="thumb" aria-hidden="true" />
        </button>
      </div>
    );
  }
}
