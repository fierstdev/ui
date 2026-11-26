import { X } from '@lucide/icons';
import { signal, scope } from '@fierst/aster';
import { Icon } from './icon.tsx';

export type ToastTone = 'neutral' | 'success' | 'warning' | 'danger';

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  tone: ToastTone;
}

const toasts = signal<ToastItem[]>([]);
const timers = new Map<string, ReturnType<typeof setTimeout>>();

export function dismissToast(id: string): void {
  const t = timers.get(id);
  if (t) {
    clearTimeout(t);
    timers.delete(id);
  }
  toasts.update((list) => list.filter((item) => item.id !== id));
}

export function showToast(
  title: string,
  opts: { description?: string; tone?: ToastTone; duration?: number } = {},
): string {
  const id = `aster-t-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const item: ToastItem = {
    id,
    title,
    description: opts.description,
    tone: opts.tone ?? 'neutral',
  };
  toasts.update((list) => [item, ...list].slice(0, 5));
  const dur = opts.duration ?? 3500;
  if (dur > 0) {
    timers.set(
      id,
      setTimeout(() => dismissToast(id), dur),
    );
  }
  return id;
}

export const toast = {
  show: (title: string, description?: string) => showToast(title, { description, tone: 'neutral' }),
  success: (title: string, description?: string) =>
    showToast(title, { description, tone: 'success' }),
  warning: (title: string, description?: string) =>
    showToast(title, { description, tone: 'warning' }),
  error: (title: string, description?: string) => showToast(title, { description, tone: 'danger' }),
  dismiss: dismissToast,
};

const toasterScope = scope`
  :scope {
    position: fixed;
    left: calc(0.75rem + var(--aster-safe-left));
    right: calc(0.75rem + var(--aster-safe-right));
    bottom: calc(0.75rem + var(--aster-safe-bottom));
    z-index: 60;
    display: grid;
    gap: 0.6rem;
    pointer-events: none;
  }
  @media (min-width: 640px) {
    :scope {
      left: auto;
      right: 1.25rem;
      bottom: 1.25rem;
      width: 360px;
    }
  }
  .toast-item {
    pointer-events: auto;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0.85rem 1rem;
    border-radius: var(--aster-radius-md);
    color: var(--aster-on-surface);
  }
  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-top: 0.42rem;
    flex-shrink: 0;
    background: var(--aster-primary);
  }
  .tone-success .dot { background: var(--aster-success); }
  .tone-warning .dot { background: var(--aster-warning); }
  .tone-danger .dot { background: var(--aster-danger); }
  .body { flex: 1; display: grid; gap: 0.15rem; }
  .title { font-size: 0.88rem; font-weight: 600; }
  .desc { font-size: 0.8rem; color: var(--aster-on-surface-variant); }
  .close {
    border: none;
    background: transparent;
    color: var(--aster-on-surface-variant);
    cursor: pointer;
    padding: 0.25rem;
    display: inline-grid;
    place-items: center;
    border-radius: var(--aster-radius-xs);
  }
  .close:hover { background: var(--aster-surface-low); color: var(--aster-on-surface); }
`;

export function* Toaster() {
  try {
    for (;;) {
      const list = toasts();
      yield (
        <div class={toasterScope} role="region" aria-label="Notifications" aria-live="polite">
          {list.map((t) => (
            <div key={t.id} class={`aster-surface-popover toast-item tone-${t.tone}`} role="status">
              <span class="dot" aria-hidden="true" />
              <div class="body">
                <span class="title">{t.title}</span>
                {t.description ? <span class="desc">{t.description}</span> : null}
              </div>
              <button
                type="button"
                class="close"
                aria-label="Dismiss"
                onClick={() => dismissToast(t.id)}
              >
                <Icon icon={X} size={15} />
              </button>
            </div>
          ))}
        </div>
      );
    }
  } finally {
    for (const timer of timers.values()) clearTimeout(timer);
    timers.clear();
  }
}
