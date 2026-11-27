import './theme.css';
import { scope, type Ctx } from '@fierst/aster';
import { Button } from './button';

const cbScope = scope`
  :scope {
    position: fixed;
    left: calc(0.75rem + var(--aster-safe-left));
    right: calc(0.75rem + var(--aster-safe-right));
    bottom: calc(0.75rem + var(--aster-safe-bottom));
    z-index: 55;
    max-width: 520px;
    padding: 1rem 1.15rem;
    border-radius: var(--aster-radius-lg);
    display: grid;
    gap: 0.75rem;
    font-family: var(--aster-font-sans);
  }
  .cb-title { margin: 0; font-size: 0.9rem; font-weight: 600; color: var(--aster-on-surface); }
  .cb-desc { margin: 0.2rem 0 0; font-size: 0.8125rem; color: var(--aster-on-surface-muted); line-height: 1.45; }
  .cb-actions { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 0.45rem; }
`;

export function* ConsentBanner(
  props: {
    title?: string;
    description?: string;
    onAccept?: () => void;
    onDecline?: () => void;
    class?: string;
  },
  ctx: Ctx,
) {
  let dismissed = false;

  for (props of ctx) {
    if (dismissed) {
      yield null;
      continue;
    }

    yield (
      <div
        role="dialog"
        aria-label="Privacy preferences"
        class={['aster-surface-popover', cbScope, props.class].filter(Boolean).join(' ')}
      >
        <div>
          <p class="cb-title">{props.title ?? 'Cookie Preferences'}</p>
          <p class="cb-desc">
            {props.description ??
              'We use essential cookies to preserve your theme and session preferences. No third-party ad tracking.'}
          </p>
        </div>
        <div class="cb-actions">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              dismissed = true;
              props.onDecline?.();
            }}
          >
            Essential Only
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={() => {
              dismissed = true;
              props.onAccept?.();
            }}
          >
            Accept All
          </Button>
        </div>
      </div>
    );
  }
}
