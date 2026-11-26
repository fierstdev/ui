import { Check } from '@lucide/icons';
import { scope, type View } from '@fierst/aster';
import { Icon } from './icon.tsx';
import { Button } from './button.tsx';

const stepScope = scope`
  :scope {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    list-style: none;
    margin: 0;
    padding: 0;
    font-family: var(--aster-font-sans);
  }
  @media (min-width: 640px) {
    :scope {
      flex-direction: row;
      align-items: flex-start;
      gap: 0;
    }
  }
  .st-item {
    display: flex;
    align-items: flex-start;
    gap: 0.65rem;
    flex: 1;
    min-width: 0;
    position: relative;
  }
  @media (min-width: 640px) {
    .st-item {
      flex-direction: column;
      align-items: flex-start;
      padding-right: 1rem;
    }
    .st-item:not(:last-child)::after {
      content: '';
      position: absolute;
      top: 13px;
      left: 34px;
      right: 10px;
      height: 1px;
      background: var(--aster-border);
    }
    .st-item.is-done:not(:last-child)::after { background: var(--aster-primary); }
  }
  .st-dot {
    width: 28px;
    height: 28px;
    border-radius: 9999px;
    border: 1.5px solid var(--aster-border-strong);
    background: var(--aster-surface);
    color: var(--aster-on-surface-muted);
    font-size: 0.78rem;
    font-weight: 600;
    display: inline-grid;
    place-items: center;
    flex-shrink: 0;
    position: relative;
    z-index: 1;
    transition: background-color var(--aster-dur-fast), border-color var(--aster-dur-fast), color var(--aster-dur-fast);
  }
  .st-item.is-active .st-dot {
    border-color: var(--aster-primary);
    color: var(--aster-primary);
    background: var(--aster-primary-subtle);
  }
  .st-item.is-done .st-dot {
    border-color: var(--aster-primary);
    background: var(--aster-primary);
    color: var(--aster-on-primary);
  }
  .st-copy { display: grid; gap: 0.1rem; min-width: 0; }
  .st-title { font-size: 0.84rem; font-weight: 600; color: var(--aster-on-surface); }
  .st-item.is-upcoming .st-title { color: var(--aster-on-surface-muted); font-weight: 500; }
  .st-desc { font-size: 0.76rem; color: var(--aster-on-surface-muted); }
`;

const wizScope = scope`
  :scope {
    display: grid;
    gap: 1.15rem;
    padding: 1.25rem;
    border-radius: var(--aster-radius-lg);
    border: 1px solid var(--aster-border);
    background: var(--aster-surface);
    box-shadow: var(--aster-shadow-xs);
  }
  .wiz-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    padding-top: 0.85rem;
    border-top: 1px solid var(--aster-border);
  }
`;

export interface StepItem {
  id: string;
  title: string;
  description?: string;
}

export function Stepper({
  steps,
  currentStep,
  onStepClick,
  class: extraClass,
}: {
  steps: readonly StepItem[];
  currentStep: number;
  onStepClick?: (index: number) => void;
  class?: string;
}) {
  return (
    <ol class={[stepScope, extraClass].filter(Boolean).join(' ')} aria-label="Progress steps">
      {steps.map((step, idx) => {
        const done = idx < currentStep;
        const active = idx === currentStep;
        const upcoming = idx > currentStep;
        return (
          <li
            key={step.id}
            aria-current={active ? 'step' : undefined}
            class={[
              'st-item',
              done ? 'is-done' : '',
              active ? 'is-active' : '',
              upcoming ? 'is-upcoming' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <button
              type="button"
              class="st-dot"
              disabled={!onStepClick || upcoming}
              style={onStepClick && !upcoming ? 'cursor:pointer' : 'cursor:default'}
              aria-label={`Step ${idx + 1}: ${step.title}`}
              onClick={() => onStepClick && !upcoming && onStepClick(idx)}
            >
              {done ? <Icon icon={Check} size={14} strokeWidth={2.5} /> : idx + 1}
            </button>
            <div class="st-copy">
              <span class="st-title">{step.title}</span>
              {step.description ? <span class="st-desc">{step.description}</span> : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export interface WizardStepDef<TState> {
  id: string;
  title: string;
  description?: string;
  render: (state: TState, update: (patch: Partial<TState>) => void) => View;
  canProceed?: (state: TState) => boolean;
}

/**
 * Aster-native `yield*` Multi-Step Wizard Flow!
 * Walks the user through typed steps and returns the completed state (or `null` if cancelled):
 *   const config = yield* runWizard(steps, { name: '', region: 'pdx' });
 */
export function* runWizard<TState extends Record<string, any>>(
  steps: readonly WizardStepDef<TState>[],
  initial: TState,
  opts: { finishLabel?: string; cancelLabel?: string } = {},
): Generator<View, TState | null, any> {
  let stepIdx = 0;
  let state: TState = { ...initial };
  let finished = false;
  let cancelled = false;

  const update = (patch: Partial<TState>) => {
    state = { ...state, ...patch };
  };

  while (!finished && !cancelled) {
    const cur = steps[stepIdx];
    const isLast = stepIdx === steps.length - 1;
    const ok = cur?.canProceed ? cur.canProceed(state) : true;

    yield (
      <div class={wizScope}>
        <Stepper steps={steps} currentStep={stepIdx} onStepClick={(i) => (stepIdx = i)} />
        <div>{cur ? cur.render(state, update) : null}</div>
        <div class="wiz-footer">
          <Button
            variant="ghost"
            onClick={() => {
              if (stepIdx === 0) cancelled = true;
              else stepIdx--;
            }}
          >
            {stepIdx === 0 ? (opts.cancelLabel ?? 'Cancel') : 'Back'}
          </Button>
          <Button
            variant="primary"
            disabled={!ok}
            onClick={() => {
              if (isLast) finished = true;
              else stepIdx++;
            }}
          >
            {isLast ? (opts.finishLabel ?? 'Complete') : 'Continue'}
          </Button>
        </div>
      </div>
    );
  }

  return cancelled ? null : state;
}
