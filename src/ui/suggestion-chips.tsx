import './theme.css';
import { Sparkles } from '@lucide/icons';
import { scope } from '@fierst/aster';
import { Icon } from './icon';

const sugScope = scope`
  :scope {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;
    font-family: var(--aster-font-sans);
  }
  .sug-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.4rem 0.75rem;
    border-radius: 9999px;
    border: 1px solid var(--aster-border);
    background: var(--aster-surface);
    color: var(--aster-on-surface);
    box-shadow: var(--aster-shadow-xs);
    font: inherit;
    font-size: 0.8125rem;
    font-weight: 500;
    cursor: pointer;
    touch-action: manipulation;
    transition: border-color var(--aster-dur-fast), background-color var(--aster-dur-fast), transform var(--aster-dur-fast);
  }
  .sug-btn:hover { background: var(--aster-surface-muted); border-color: var(--aster-border-strong); }
  .sug-btn:active { transform: scale(0.98); }
  .sug-ic { color: var(--aster-primary); display: inline-flex; }
`;

export function SuggestionChips({
  prompts,
  onSelect,
  class: extraClass,
}: {
  prompts: readonly string[];
  onSelect: (prompt: string) => void;
  class?: string;
}) {
  return (
    <div
      class={[sugScope, extraClass].filter(Boolean).join(' ')}
      role="group"
      aria-label="Suggested prompts"
    >
      {prompts.map((p) => (
        <button key={p} type="button" class="sug-btn" onClick={() => onSelect(p)}>
          <span class="sug-ic" aria-hidden="true">
            <Icon icon={Sparkles} size={13} />
          </span>
          <span>{p}</span>
        </button>
      ))}
    </div>
  );
}
