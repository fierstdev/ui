import './theme.css';
import { ExternalLink } from '@lucide/icons';
import { scope } from '@fierst/aster';
import { Icon } from './icon';

const citScope = scope`
  :scope {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 1.25rem;
    height: 1.15rem;
    padding: 0 0.3rem;
    margin: 0 0.1rem;
    border-radius: var(--aster-radius-xs);
    border: 1px solid var(--aster-primary-border);
    background: var(--aster-primary-subtle);
    color: var(--aster-on-primary-subtle);
    font-family: var(--aster-font-mono);
    font-size: 0.68rem;
    font-weight: 600;
    text-decoration: none;
    vertical-align: super;
    line-height: 1;
    transition: background-color var(--aster-dur-fast);
  }
  :scope:hover { background: var(--aster-primary); color: var(--aster-on-primary); }
`;

const srcScope = scope`
  :scope { display: flex; flex-wrap: wrap; gap: 0.45rem; font-family: var(--aster-font-sans); }
  .src-card {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.35rem 0.65rem;
    border-radius: var(--aster-radius-md);
    border: 1px solid var(--aster-border);
    background: var(--aster-surface);
    color: var(--aster-on-surface);
    text-decoration: none;
    font-size: 0.78rem;
    font-weight: 500;
    transition: border-color var(--aster-dur-fast), background-color var(--aster-dur-fast);
  }
  .src-card:hover { background: var(--aster-surface-muted); border-color: var(--aster-border-strong); }
  .src-idx { font-family: var(--aster-font-mono); font-size: 0.7rem; color: var(--aster-primary); font-weight: 600; }
`;

export function CitationBadge({
  index,
  href,
  title,
}: {
  index: number;
  href?: string;
  title?: string;
}) {
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" title={title} class={citScope}>
      {index}
    </a>
  ) : (
    <span title={title} class={citScope}>
      {index}
    </span>
  );
}

export function SourceList({
  sources,
  class: extraClass,
}: {
  sources: readonly { title: string; href: string }[];
  class?: string;
}) {
  return (
    <div class={[srcScope, extraClass].filter(Boolean).join(' ')}>
      {sources.map((s, idx) => (
        <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" class="src-card">
          <span class="src-idx">[{idx + 1}]</span>
          <span>{s.title}</span>
          <Icon icon={ExternalLink} size={12} />
        </a>
      ))}
    </div>
  );
}
