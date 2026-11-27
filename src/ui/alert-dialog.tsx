import { AlertTriangle } from '@lucide/icons';
import { scope, signal, type Ctx, type View } from '@fierst/aster';
import { Dialog } from './dialog.tsx';
import { Button } from './button.tsx';
import { Input } from './input.tsx';
import { Icon } from './icon.tsx';

const adScope = scope`
  :scope { display: flex; align-items: flex-start; gap: 0.85rem; }
  .ad-icon {
    width: 38px;
    height: 38px;
    border-radius: 9999px;
    background: var(--aster-danger-subtle);
    color: var(--aster-danger);
    border: 1px solid var(--aster-danger-border);
    display: inline-grid;
    place-items: center;
    flex-shrink: 0;
  }
  .ad-copy { display: grid; gap: 0.65rem; flex: 1; min-width: 0; font-size: 0.86rem; color: var(--aster-on-surface-muted); }
`;

export function* AlertDialog(
  props: {
    open?: any;
    title: string;
    description: string;
    confirmPhrase?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onCancel?: () => void;
  },
  ctx: Ctx,
) {
  let typed = '';

  for (props of ctx) {
    const canConfirm = !props.confirmPhrase || typed.trim() === props.confirmPhrase;
    const close = () => {
      typed = '';
      if (Array.isArray(props.open)) props.open[1]?.(false);
      else props.open?.set?.(false);
      props.onCancel?.();
    };

    yield (
      <Dialog
        open={props.open}
        onClose={() => {
          typed = '';
          ctx.refresh();
        }}
        title={props.title}
        showClose={false}
        footer={
          <>
            <Button variant="outline" onClick={close}>
              {props.cancelLabel ?? 'Cancel'}
            </Button>
            <Button
              variant="destructive"
              disabled={!canConfirm}
              onClick={() => {
                typed = '';
                props.onConfirm();
              }}
            >
              {props.confirmLabel ?? 'Delete Permanently'}
            </Button>
          </>
        }
      >
        <div class={adScope}>
          <span class="ad-icon" aria-hidden="true">
            <Icon icon={AlertTriangle} size={18} />
          </span>
          <div class="ad-copy">
            <p style="margin:0">{props.description}</p>
            {props.confirmPhrase ? (
              <Input
                label={`Type "${props.confirmPhrase}" to confirm`}
                placeholder={props.confirmPhrase}
                value={typed}
                onInput={(e: Event) => {
                  typed = (e.target as HTMLInputElement).value;
                  ctx.refresh();
                }}
              />
            ) : null}
          </div>
        </div>
      </Dialog>
    );
  }
}

/**
 * Aster-native `yield*` Destructive Guard Flow (supports optional slug typing confirmation):
 *   const ok = yield* confirmDestructive({ title: 'Delete project?', description: '...', confirmPhrase: 'aster-cloud' });
 */
export function* confirmDestructive(opts: {
  title: string;
  description: string;
  confirmPhrase?: string;
  confirmLabel?: string;
}): Generator<View, boolean, any> {
  const result = signal<boolean | null>(null);

  while (result() === null) {
    yield (
      <AlertDialog
        open={[
          () => result() === null,
          (v: boolean) => {
            if (!v && result() === null) result.set(false);
          },
        ]}
        title={opts.title}
        description={opts.description}
        confirmPhrase={opts.confirmPhrase}
        confirmLabel={opts.confirmLabel}
        onConfirm={() => result.set(true)}
        onCancel={() => result.set(false)}
      />
    );
  }

  return result()!;
}
