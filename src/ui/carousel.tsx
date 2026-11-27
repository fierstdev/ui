import { ChevronLeft, ChevronRight } from '@lucide/icons';
import { scope, type Ctx, type View } from '@fierst/aster';
import { Icon } from './icon.tsx';

const carScope = scope`
  :scope {
    position: relative;
    display: grid;
    gap: 0.75rem;
    min-width: 0;
  }
  .car-track {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
    gap: 0.75rem;
    border-radius: var(--aster-radius-lg);
  }
  .car-track::-webkit-scrollbar { display: none; }
  .car-slide {
    flex: 0 0 100%;
    scroll-snap-align: start;
    min-width: 0;
  }
  .car-controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
  }
  .car-dots { display: inline-flex; align-items: center; gap: 0.35rem; }
  .car-dot {
    width: 8px;
    height: 8px;
    padding: 0;
    border: none;
    border-radius: 9999px;
    background: var(--aster-border-strong);
    cursor: pointer;
    transition: width var(--aster-dur-med) var(--aster-ease-motion), background-color var(--aster-dur-fast);
  }
  .car-dot.is-active { width: 22px; background: var(--aster-primary); }
  .car-btns { display: inline-flex; align-items: center; gap: 0.35rem; }
  .car-btn {
    width: 32px;
    height: 32px;
    border-radius: var(--aster-radius-control);
    border: 1px solid var(--aster-border);
    background: var(--aster-surface);
    color: var(--aster-on-surface);
    display: inline-grid;
    place-items: center;
    cursor: pointer;
    touch-action: manipulation;
    transition: background-color var(--aster-dur-fast);
  }
  .car-btn:hover:not(:disabled) { background: var(--aster-surface-muted); }
  .car-btn:disabled { opacity: 0.4; cursor: not-allowed; }
`;

export function* Carousel(
  props: {
    slides: readonly { id: string; content: View }[];
    label?: string;
    class?: string;
  },
  ctx: Ctx,
) {
  let active = 0;
  let trackEl: HTMLDivElement | null = null;

  for (props of ctx) {
    const count = props.slides.length;
    if (active >= count) active = Math.max(0, count - 1);

    const goTo = (idx: number) => {
      const clamped = Math.max(0, Math.min(count - 1, idx));
      active = clamped;
      if (trackEl) {
        const slide = trackEl.children[clamped] as HTMLElement | undefined;
        slide?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
      }
    };

    const onScroll = () => {
      if (!trackEl || trackEl.clientWidth === 0) return;
      const idx = Math.round(trackEl.scrollLeft / trackEl.clientWidth);
      if (idx !== active && idx >= 0 && idx < count) {
        active = idx;
      }
    };

    yield (
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label={props.label ?? 'Carousel'}
        class={[carScope, props.class].filter(Boolean).join(' ')}
      >
        <div
          ref={(el: HTMLDivElement) => (trackEl = el)}
          class="car-track"
          tabIndex={0}
          on:scroll={onScroll}
        >
          {props.slides.map((s, idx) => (
            <div
              key={s.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${idx + 1} of ${count}`}
              class="car-slide"
            >
              {s.content}
            </div>
          ))}
        </div>

        <div class="car-controls">
          <div class="car-dots" role="group" aria-label="Slide navigation">
            {props.slides.map((s, idx) => (
              <button
                key={s.id}
                type="button"

                aria-pressed={idx === active}
                aria-label={`Go to slide ${idx + 1}`}
                class="car-dot"
                class:is-active={idx === active}
                onClick={() => goTo(idx)}
              />
            ))}
          </div>
          <div class="car-btns">
            <button
              type="button"
              class="car-btn"
              aria-label="Previous slide"
              disabled={active <= 0}
              onClick={() => goTo(active - 1)}
            >
              <Icon icon={ChevronLeft} size={15} />
            </button>
            <button
              type="button"
              class="car-btn"
              aria-label="Next slide"
              disabled={active >= count - 1}
              onClick={() => goTo(active + 1)}
            >
              <Icon icon={ChevronRight} size={15} />
            </button>
          </div>
        </div>
      </div>
    );
  }
}
