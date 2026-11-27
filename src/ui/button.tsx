import './theme.css';
import { LoaderCircle } from '@lucide/icons';
import { scope, type View } from '@fierst/aster';
import { Icon } from './icon';

const btnScope = scope`
  :scope {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.45rem;
    font-family: var(--aster-font-sans);
    font-weight: 500;
    line-height: 1;
    border-radius: var(--aster-radius-control);
    border: 1px solid transparent;
    cursor: pointer;
    user-select: none;
    text-decoration: none;
    white-space: nowrap;
    touch-action: manipulation;
    transition:
      background-color var(--aster-dur-fast) var(--aster-ease-standard),
      border-color var(--aster-dur-fast) var(--aster-ease-standard),
      color var(--aster-dur-fast) var(--aster-ease-standard),
      box-shadow var(--aster-dur-fast) var(--aster-ease-standard),
      transform var(--aster-dur-fast) var(--aster-ease-motion);
  }
  :scope:focus-visible { outline: none; box-shadow: var(--aster-focus-ring); }
  :scope:active:not(:disabled) { transform: scale(0.98); }
  :scope:disabled { opacity: 0.5; pointer-events: none; }

  /* Proven shadcn / TailwindUI control heights */
  :scope.sz-sm { height: var(--aster-control-sm); padding: 0 0.75rem; font-size: 0.8125rem; }
  :scope.sz-md { height: var(--aster-control-md); padding: 0 1rem; font-size: 0.875rem; }
  :scope.sz-lg { height: var(--aster-control-lg); padding: 0 1.25rem; font-size: 0.9375rem; }
  :scope.sz-icon { height: var(--aster-control-md); width: var(--aster-control-md); padding: 0; }

  :scope.v-primary {
    background: var(--aster-primary);
    color: var(--aster-on-primary);
    box-shadow: var(--aster-shadow-xs);
  }
  :scope.v-primary:hover { background: var(--aster-primary-hover); }

  :scope.v-secondary {
    background: var(--aster-surface-muted);
    color: var(--aster-on-surface);
  }
  :scope.v-secondary:hover { background: var(--aster-surface-accent); }

  :scope.v-outline {
    background: var(--aster-surface);
    color: var(--aster-on-surface);
    border-color: var(--aster-input-border);
    box-shadow: var(--aster-shadow-xs);
  }
  :scope.v-outline:hover {
    background: var(--aster-surface-muted);
    border-color: var(--aster-border-strong);
  }

  :scope.v-ghost {
    background: transparent;
    color: var(--aster-on-surface);
  }
  :scope.v-ghost:hover { background: var(--aster-surface-muted); }

  :scope.v-destructive {
    background: var(--aster-danger);
    color: var(--aster-on-danger);
    box-shadow: var(--aster-shadow-xs);
  }
  :scope.v-destructive:hover { background: var(--aster-danger-hover); }

  :scope.v-link {
    background: transparent;
    color: var(--aster-primary);
    padding-left: 0.25rem;
    padding-right: 0.25rem;
  }
  :scope.v-link:hover { text-decoration: underline; text-underline-offset: 4px; }
`;

const groupScope = scope`
  :scope {
    display: inline-flex;
    align-items: center;
    max-width: 100%;
    overflow-x: auto;
    scrollbar-width: none;
  }
  :scope::-webkit-scrollbar { display: none; }
  :scope > button:not(:first-child) {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    margin-left: -1px;
  }
  :scope > button:not(:last-child) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  :scope > button:focus-visible { position: relative; z-index: 1; }
`;

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  class?: string;
  children?: View;
  [key: string]: any;
}

export function Button({
  variant = 'outline',
  size = 'md',
  loading = false,
  disabled = false,
  type = 'button',
  class: extraClass,
  children,
  ...rest
}: ButtonProps) {
  const cls = [btnScope, `v-${variant}`, `sz-${size}`, extraClass].filter(Boolean).join(' ');
  return (
    <button {...rest} type={type} class={cls} disabled={disabled || loading} aria-busy={loading}>
      {loading ? <Icon icon={LoaderCircle} size={15} spin /> : null}
      {children}
    </button>
  );
}

export function ButtonGroup(props: { class?: string; children?: View; label?: string }) {
  return (
    <div
      role="group"
      aria-label={props.label}
      class={[groupScope, props.class].filter(Boolean).join(' ')}
    >
      {props.children}
    </div>
  );
}
