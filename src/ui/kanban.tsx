import { ArrowLeft, ArrowRight } from '@lucide/icons';
import { scope, type Ctx } from '@fierst/aster';
import { Badge, type BadgeTone } from './badge.tsx';
import { Icon } from './icon.tsx';

const kbScope = scope`
  :scope {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
    gap: 0.9rem;
    font-family: var(--aster-font-sans);
  }
  .kb-col {
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
    padding: 0.75rem;
    border-radius: var(--aster-radius-lg);
    border: 1px solid var(--aster-border);
    background: var(--aster-surface-muted);
    min-width: 0;
  }
  .kb-head { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; padding: 0 0.15rem; }
  .kb-title { font-size: 0.84rem; font-weight: 600; color: var(--aster-on-surface); }
  .kb-cards { display: grid; gap: 0.55rem; }
  .kb-card {
    padding: 0.75rem 0.85rem;
    border-radius: var(--aster-radius-md);
    border: 1px solid var(--aster-border);
    background: var(--aster-surface);
    box-shadow: var(--aster-shadow-xs);
    display: grid;
    gap: 0.45rem;
  }
  .kb-card-title { font-size: 0.84rem; font-weight: 550; color: var(--aster-on-surface); }
  .kb-card-meta { font-size: 0.76rem; color: var(--aster-on-surface-muted); }
  .kb-card-foot { display: flex; align-items: center; justify-content: space-between; gap: 0.4rem; }
  .kb-move { display: inline-flex; gap: 0.25rem; }
  .kb-mv-btn {
    width: 24px;
    height: 24px;
    border-radius: var(--aster-radius-xs);
    border: 1px solid var(--aster-border);
    background: var(--aster-surface);
    color: var(--aster-on-surface-muted);
    display: inline-grid;
    place-items: center;
    cursor: pointer;
  }
  .kb-mv-btn:hover:not(:disabled) { background: var(--aster-surface-muted); color: var(--aster-on-surface); }
  .kb-mv-btn:disabled { opacity: 0.35; cursor: not-allowed; }
`;

export interface KanbanCardItem {
  id: string;
  columnId: string;
  title: string;
  meta?: string;
  tag?: string;
  tagTone?: BadgeTone;
}

export function* KanbanBoard(
  props: {
    columns: readonly { id: string; title: string }[];
    cards: readonly KanbanCardItem[];
    onMove?: (cardId: string, toColumnId: string) => void;
    class?: string;
  },
  ctx: Ctx,
) {
  let internalCards = [...props.cards];

  for (props of ctx) {
    const cards = props.onMove ? props.cards : internalCards;

    const move = (cardId: string, targetCol: string) => {
      if (props.onMove) {
        props.onMove(cardId, targetCol);
      } else {
        internalCards = internalCards.map((c) =>
          c.id === cardId ? { ...c, columnId: targetCol } : c,
        );
      }
    };

    yield (
      <div class={[kbScope, props.class].filter(Boolean).join(' ')}>
        {props.columns.map((col, colIdx) => {
          const colCards = cards.filter((c) => c.columnId === col.id);
          return (
            <section key={col.id} class="kb-col" aria-label={col.title}>
              <header class="kb-head">
                <span class="kb-title">{col.title}</span>
                <Badge tone="neutral">{colCards.length}</Badge>
              </header>
              <div class="kb-cards">
                {colCards.map((card) => (
                  <article key={card.id} class="kb-card">
                    <span class="kb-card-title">{card.title}</span>
                    {card.meta ? <span class="kb-card-meta">{card.meta}</span> : null}
                    <div class="kb-card-foot">
                      {card.tag ? (
                        <Badge tone={card.tagTone ?? 'neutral'}>{card.tag}</Badge>
                      ) : (
                        <span />
                      )}
                      <div class="kb-move">
                        <button
                          type="button"
                          class="kb-mv-btn"
                          aria-label={`Move ${card.title} left`}
                          disabled={colIdx <= 0}
                          onClick={() => colIdx > 0 && move(card.id, props.columns[colIdx - 1].id)}
                        >
                          <Icon icon={ArrowLeft} size={12} />
                        </button>
                        <button
                          type="button"
                          class="kb-mv-btn"
                          aria-label={`Move ${card.title} right`}
                          disabled={colIdx >= props.columns.length - 1}
                          onClick={() =>
                            colIdx < props.columns.length - 1 &&
                            move(card.id, props.columns[colIdx + 1].id)
                          }
                        >
                          <Icon icon={ArrowRight} size={12} />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    );
  }
}
