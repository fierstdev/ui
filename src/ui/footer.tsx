import './theme.css';
import { scope, type View } from '@fierst/aster';

const ftScope = scope`
  :scope {
    border-top: 1px solid var(--aster-border);
    background: var(--aster-surface);
    color: var(--aster-on-surface-muted);
    font-family: var(--aster-font-sans);
    padding: 2.5rem 1.25rem calc(1.75rem + var(--aster-safe-bottom));
  }
  .ft-inner { max-width: 1200px; margin: 0 auto; display: grid; gap: 2rem; }
  .ft-top { display: grid; grid-template-columns: 1fr; gap: 1.75rem; }
  @media (min-width: 768px) {
    .ft-top { grid-template-columns: minmax(220px, 1.4fr) repeat(3, minmax(0, 1fr)); }
  }
  .ft-brand { display: grid; gap: 0.5rem; align-content: start; }
  .ft-tagline { margin: 0; font-size: 0.84rem; max-width: 30ch; }
  .ft-col { display: grid; gap: 0.45rem; align-content: start; }
  .ft-heading { font-size: 0.8125rem; font-weight: 600; color: var(--aster-on-surface); margin-bottom: 0.15rem; }
  .ft-col a {
    font-size: 0.84rem;
    color: var(--aster-on-surface-muted);
    text-decoration: none;
    transition: color var(--aster-dur-fast);
  }
  .ft-col a:hover { color: var(--aster-on-surface); }
  .ft-bottom {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding-top: 1.25rem;
    border-top: 1px solid var(--aster-border);
    font-size: 0.78rem;
  }
`;

export interface FooterColumn {
  heading: string;
  links: readonly { label: string; href: string }[];
}

export function Footer({
  brand,
  tagline,
  columns,
  copyright,
  extra,
  class: extraClass,
}: {
  brand: View;
  tagline?: string;
  columns: readonly FooterColumn[];
  copyright?: string;
  extra?: View;
  class?: string;
}) {
  return (
    <footer class={[ftScope, extraClass].filter(Boolean).join(' ')}>
      <div class="ft-inner">
        <div class="ft-top">
          <div class="ft-brand">
            <div>{brand}</div>
            {tagline ? <p class="ft-tagline">{tagline}</p> : null}
          </div>
          {columns.map((col) => (
            <div key={col.heading} class="ft-col">
              <span class="ft-heading">{col.heading}</span>
              {col.links.map((ln) => (
                <a key={ln.label} href={ln.href}>
                  {ln.label}
                </a>
              ))}
            </div>
          ))}
        </div>
        <div class="ft-bottom">
          <span>
            {copyright ?? `© ${new Date().getFullYear()} Fierst LLC. All rights reserved.`}
          </span>
          {extra ?? null}
        </div>
      </div>
    </footer>
  );
}
