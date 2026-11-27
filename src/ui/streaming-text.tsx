import './theme.css';
import { scope } from '@fierst/aster';

const stScope = scope`
  :scope {
    font-family: var(--aster-font-sans);
    white-space: pre-wrap;
    word-break: break-word;
  }
  .caret {
    display: inline-block;
    width: 2px;
    height: 1em;
    margin-left: 2px;
    vertical-align: -0.15em;
    background: var(--aster-primary);
    animation: aster-blink 0.9s steps(2, start) infinite;
  }
  @keyframes aster-blink {
    to { opacity: 0; }
  }
`;

export function StreamingText({
  text,
  streaming = false,
  class: extraClass,
}: {
  text: string;
  streaming?: boolean;
  class?: string;
}) {
  return (
    <span class={[stScope, extraClass].filter(Boolean).join(' ')} aria-busy={streaming}>
      {text}
      {streaming ? <span class="caret" aria-hidden="true" /> : null}
    </span>
  );
}
