import './theme.css';
import { scope } from '@fierst/aster';

const articleScope = scope`
  :scope { min-width:0; padding:1rem 0; border-top:1px solid var(--aster-border); color:var(--aster-on-surface); overflow-wrap:anywhere; }
  :scope.featured { padding:clamp(1rem,3vw,2rem); border:1px solid var(--aster-border); border-block-start:3px solid var(--aster-primary); border-radius:var(--aster-radius-lg); background:var(--aster-surface); }
  h2,h3 { margin:0; line-height:1.16; font-family:var(--aster-font-display); font-size:clamp(1.35rem,3vw,2rem); }
  a { color:inherit; text-underline-offset:.16em; }
  .eyebrow { margin:0 0 .75rem; font:600 .8rem var(--aster-font-mono); }
  .meta { display:flex; gap:.35rem .85rem; flex-wrap:wrap; margin:.95rem 0 0; font-size:.88rem; color:var(--aster-on-surface-muted); }
  .summary { margin:.8rem 0 0; line-height:1.55; }
`;

export function ArticlePreview(props: {
  title: string;
  href: string;
  summary?: string;
  eyebrow?: string;
  featured?: boolean;
  headingLevel?: 2 | 3;
  author?: string;
  published?: { dateTime: string; label: string };
  readingTime?: string;
}) {
  const link = <a href={props.href}>{props.title}</a>;
  return (
    <article class={[articleScope, props.featured ? 'featured' : ''].join(' ')}>
      {props.eyebrow && <p class="eyebrow">{props.eyebrow}</p>}
      {props.headingLevel === 3 ? <h3>{link}</h3> : <h2>{link}</h2>}
      {(props.author || props.published || props.readingTime) && (
        <p class="meta">
          {props.author && <span>{props.author}</span>}
          {props.published && (
            <time datetime={props.published.dateTime}>{props.published.label}</time>
          )}
          {props.readingTime && <span>{props.readingTime}</span>}
        </p>
      )}
      {props.summary && <p class="summary">{props.summary}</p>}
    </article>
  );
}
