import { type View } from '@fierst/aster';
import { Sheet } from './sheet.tsx';
import { Button } from './button.tsx';

export function Drawer({
  id,
  open,
  title,
  description,
  footer,
  onClose,
  class: extraClass,
  children,
}: {
  id?: string;
  open?: any;
  title?: string;
  description?: string;
  footer?: View;
  onClose?: () => void;
  class?: string;
  children?: View;
}) {
  return (
    <Sheet
      id={id}
      open={open}
      side="bottom"
      title={title}
      description={description}
      footer={footer}
      onClose={onClose}
      class={extraClass}
    >
      {children}
    </Sheet>
  );
}

export interface DrawerAction {
  id: string;
  label: string;
  danger?: boolean;
}

/**
 * Aster-native `yield*` Mobile Action Sheet Flow:
 *   const actionId = yield* promptDrawer({ title: 'Deployment Actions', actions: [...] });
 */
export function* promptDrawer(opts: {
  title: string;
  description?: string;
  actions: readonly DrawerAction[];
  cancelLabel?: string;
}): Generator<View, string | null, any> {
  let decided = false;
  let picked: string | null = null;
  let open = true;

  while (!decided) {
    yield (
      <Drawer
        open={[
          () => open,
          (v: boolean) => {
            open = v;
            if (!v && !decided) {
              picked = null;
              decided = true;
            }
          },
        ]}
        title={opts.title}
        description={opts.description}
        footer={
          <Button
            variant="outline"
            style="width:100%"
            onClick={() => {
              open = false;
              picked = null;
              decided = true;
            }}
          >
            {opts.cancelLabel ?? 'Cancel'}
          </Button>
        }
      >
        <div style="display:grid; gap:0.5rem">
          {opts.actions.map((act) => (
            <Button
              key={act.id}
              variant={act.danger ? 'destructive' : 'outline'}
              style="width:100%; justify-content:flex-start"
              onClick={() => {
                open = false;
                picked = act.id;
                decided = true;
              }}
            >
              {act.label}
            </Button>
          ))}
        </div>
      </Drawer>
    );
  }

  return picked;
}
