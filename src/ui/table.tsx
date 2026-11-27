import './theme.css';
import { scope, type View } from '@fierst/aster';

const tblScope = scope`
  :scope {
    width: 100%;
    overflow-x: auto;
    border-radius: var(--aster-radius-lg);
    border: 1px solid var(--aster-border);
    background: var(--aster-surface);
    font-family: var(--aster-font-sans);
  }
  table { width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: left; }
  caption { padding: 0.65rem 1rem; font-size: 0.78rem; color: var(--aster-on-surface-muted); caption-side: bottom; border-top: 1px solid var(--aster-border); }
  thead { background: var(--aster-surface-muted); }
  th {
    padding: 0.65rem 0.9rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--aster-on-surface-muted);
    border-bottom: 1px solid var(--aster-border);
    white-space: nowrap;
  }
  td {
    padding: 0.7rem 0.9rem;
    color: var(--aster-on-surface);
    border-bottom: 1px solid var(--aster-border);
  }
  tbody tr:last-child td { border-bottom: none; }
  tbody tr:hover { background: var(--aster-surface-muted); }
  .is-num { text-align: right; font-family: var(--aster-font-mono); font-variant-numeric: tabular-nums; }
`;

export function Table(props: { class?: string; children?: View }) {
  return (
    <div class={[tblScope, props.class].filter(Boolean).join(' ')}>
      <table>{props.children}</table>
    </div>
  );
}
export function TableHeader(props: { children?: View }) {
  return <thead>{props.children}</thead>;
}
export function TableBody(props: { children?: View }) {
  return <tbody>{props.children}</tbody>;
}
export function TableRow(props: { children?: View }) {
  return <tr>{props.children}</tr>;
}
export function TableHead(props: { numeric?: boolean; children?: View }) {
  return <th class={props.numeric ? 'is-num' : undefined}>{props.children}</th>;
}
export function TableCell(props: { numeric?: boolean; children?: View }) {
  return <td class={props.numeric ? 'is-num' : undefined}>{props.children}</td>;
}
export function TableCaption(props: { children?: View }) {
  return <caption>{props.children}</caption>;
}
