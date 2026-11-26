import { X } from '@lucide/icons';
import { scope, type View } from '@fierst/aster';
import { Button } from './button.tsx';
import { Icon } from './icon.tsx';

const tourScope = scope`
  :scope {
    width: min(360px, calc(100vw - 1.5rem));
    padding: 1rem 1.1rem;
    border-radius: var(--aster-radius-lg);
    display: grid;
    gap: 0.7rem;
    font-family: var(--aster-font-sans);
  }
  .tr-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 0.75rem; }
  .tr-step { font-family: var(--aster-font-mono); font-size: 0.72rem; font-weight: 600; color: var(--aster-primary); }
  .tr-title { margin: 0.15rem 0 0; font-size: 0.95rem; font-weight: 600; color: var(--aster-on-surface); }
  .tr-body { margin: 0; font-size: 0.84rem; color: var(--aster-on-surface-muted); line-height: 1.5; }
  .tr-close {
    width: 26px;
    height: 26px;
    border: none;
    border-radius: var(--aster-radius-xs);
    background: transparent;
    color: var(--aster-on-surface-muted);
    display: inline-grid;
    place-items: center;
    cursor: pointer;
  }
  .tr-close:hover { background: var(--aster-surface-muted); color: var(--aster-on-surface); }
  .tr-foot { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; padding-top: 0.35rem; }
`;

export interface TourStep {
  id: string;
  title: string;
  description: string;
}

export function TourCard({
  step,
  index,
  total,
  onPrev,
  onNext,
  onClose,
  class: extraClass,
}: {
  step: TourStep;
  index: number;
  total: number;
  onPrev?: () => void;
  onNext?: () => void;
  onClose?: () => void;
  class?: string;
}) {
  const isLast = index >= total - 1;
  return (
    <div
      role="dialog"
      aria-label={step.title}
      class={['aster-surface-popover', tourScope, extraClass].filter(Boolean).join(' ')}
    >
      <div class="tr-head">
        <div>
          <span class="tr-step">
            Step {index + 1} of {total}
          </span>
          <h4 class="tr-title">{step.title}</h4>
        </div>
        {onClose ? (
          <button type="button" class="tr-close" aria-label="Close tour" onClick={onClose}>
            <Icon icon={X} size={14} />
          </button>
        ) : null}
      </div>
      <p class="tr-body">{step.description}</p>
      <div class="tr-foot">
        <Button size="sm" variant="ghost" disabled={index <= 0} onClick={onPrev}>
          Back
        </Button>
        <Button size="sm" variant="primary" onClick={onNext}>
          {isLast ? 'Finish' : 'Next'}
        </Button>
      </div>
    </div>
  );
}

/**
 * Aster-native `yield*` Onboarding Tour Flow!
 * Returns `true` if the user completed the tour, or `false` if skipped early.
 */
export function* runTour(steps: readonly TourStep[]): Generator<View, boolean, any> {
  let idx = 0;
  let status: 'active' | 'done' | 'skipped' = 'active';

  while (status === 'active' && idx < steps.length) {
    yield (
      <TourCard
        step={steps[idx]}
        index={idx}
        total={steps.length}
        onPrev={() => (idx = Math.max(0, idx - 1))}
        onNext={() => {
          if (idx >= steps.length - 1) status = 'done';
          else idx++;
        }}
        onClose={() => (status = 'skipped')}
      />
    );
  }
  return (status as string) === 'done';
}
