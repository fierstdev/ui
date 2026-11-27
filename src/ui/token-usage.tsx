import './theme.css';
import { scope } from '@fierst/aster';

const tokScope = scope`
  :scope { display: grid; gap: 0.45rem; font-family: var(--aster-font-sans); }
  .tu-head { display: flex; justify-content: space-between; font-size: 0.8125rem; }
  .tu-lbl { font-weight: 500; color: var(--aster-on-surface); }
  .tu-num { font-family: var(--aster-font-mono); color: var(--aster-on-surface-muted); }
  .tu-bar {
    display: flex;
    height: 8px;
    border-radius: 9999px;
    overflow: hidden;
    background: var(--aster-surface-muted);
    border: 1px solid var(--aster-border);
  }
  .seg-in { background: var(--aster-primary); }
  .seg-cache { background: var(--aster-success); }
  .seg-out { background: var(--aster-warning); }
  .tu-leg { display: flex; flex-wrap: wrap; gap: 0.75rem; font-size: 0.75rem; color: var(--aster-on-surface-muted); }
  .tu-item { display: inline-flex; align-items: center; gap: 0.35rem; }
  .tu-dot { width: 8px; height: 8px; border-radius: 2px; }
`;

export function TokenUsageBar({
  inputTokens,
  cachedTokens = 0,
  outputTokens,
  limit = 128000,
  class: extraClass,
}: {
  inputTokens: number;
  cachedTokens?: number;
  outputTokens: number;
  limit?: number;
  class?: string;
}) {
  const total = inputTokens + cachedTokens + outputTokens;
  const denom = Math.max(1, limit);
  const inPct = Math.min(100, (inputTokens / denom) * 100);
  const caPct = Math.min(100 - inPct, (cachedTokens / denom) * 100);
  const outPct = Math.min(100 - inPct - caPct, (outputTokens / denom) * 100);

  return (
    <div class={[tokScope, extraClass].filter(Boolean).join(' ')}>
      <div class="tu-head">
        <span class="tu-lbl">Context Window</span>
        <span class="tu-num">
          {total.toLocaleString()} / {limit.toLocaleString()} tokens
        </span>
      </div>
      <div class="tu-bar" role="img" aria-label={`Used ${total} of ${limit} tokens`}>
        <span class="seg-in" style={{ width: `${inPct}%` }} />
        <span class="seg-cache" style={{ width: `${caPct}%` }} />
        <span class="seg-out" style={{ width: `${outPct}%` }} />
      </div>
      <div class="tu-leg">
        <span class="tu-item">
          <span class="tu-dot seg-in" /> Input: {inputTokens.toLocaleString()}
        </span>
        {cachedTokens > 0 ? (
          <span class="tu-item">
            <span class="tu-dot seg-cache" /> Replayed/Cached: {cachedTokens.toLocaleString()}
          </span>
        ) : null}
        <span class="tu-item">
          <span class="tu-dot seg-out" /> Output: {outputTokens.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
