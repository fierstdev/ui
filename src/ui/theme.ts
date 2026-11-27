// AsterUI — Reactive Theme Controller & Cross-Browser Overlay Primitives
import { signal } from '@fierst/aster';

export type ThemeMode = 'system' | 'light' | 'dark';
export type ThemePreset = 'zinc' | 'blue' | 'emerald' | 'violet' | 'rose' | 'amber';
export type ThemeRadius = 'none' | 'sm' | 'md' | 'lg';
export type ThemeDensity = 'compact' | 'comfortable';

export interface ThemeConfig {
  mode: ThemeMode;
  preset: ThemePreset;
  radius: ThemeRadius;
  density: ThemeDensity;
  customHue?: number;
}

export const THEME_PRESETS: readonly {
  id: ThemePreset;
  label: string;
  hue: number;
  swatch: string;
}[] = [
  { id: 'zinc', label: 'Zinc', hue: 285, swatch: '#18181b' },
  { id: 'blue', label: 'Blue', hue: 255, swatch: '#2563eb' },
  { id: 'emerald', label: 'Emerald', hue: 158, swatch: '#059669' },
  { id: 'violet', label: 'Violet', hue: 285, swatch: '#7c3aed' },
  { id: 'rose', label: 'Rose', hue: 16, swatch: '#e11d48' },
  { id: 'amber', label: 'Amber', hue: 55, swatch: '#d97706' },
];

export const themeState = signal<ThemeConfig>({
  mode: 'system',
  preset: 'blue',
  radius: 'md',
  density: 'comfortable',
});

function applyToRoot(cfg: ThemeConfig) {
  if (typeof document === 'undefined') return;
  const el = document.documentElement;
  el.dataset.asterMode = cfg.mode;
  el.dataset.asterPreset = cfg.preset;
  el.dataset.asterRadius = cfg.radius;
  el.dataset.asterDensity = cfg.density;
  if (cfg.customHue !== undefined) {
    el.style.setProperty('--aster-seed-hue', String(cfg.customHue));
    if (cfg.preset === 'zinc') {
      el.style.setProperty('--aster-seed-chroma', '0.20');
    } else {
      el.style.removeProperty('--aster-seed-chroma');
    }
  } else {
    el.style.removeProperty('--aster-seed-hue');
    el.style.removeProperty('--aster-seed-chroma');
  }
}

export function setTheme(patch: Partial<ThemeConfig>, persist = true): void {
  const next: ThemeConfig = { ...themeState.peek(), ...patch };
  themeState.set(next);
  applyToRoot(next);
  if (persist && typeof window !== 'undefined') {
    try {
      window.localStorage.setItem('aster-ui-theme', JSON.stringify(next));
    } catch {}
  }
}

export function initTheme(defaults: Partial<ThemeConfig> = {}): ThemeConfig {
  let saved: Partial<ThemeConfig> = {};
  if (typeof window !== 'undefined') {
    try {
      const raw = window.localStorage.getItem('aster-ui-theme');
      if (raw) saved = JSON.parse(raw);
    } catch {}
  }
  const merged: ThemeConfig = { ...themeState.peek(), ...defaults, ...saved };
  themeState.set(merged);
  applyToRoot(merged);
  return merged;
}

/**
 * Cross-browser viewport-clamped anchor positioning for native `[popover]` elements.
 * Resets UA `[popover]` `inset: 0; margin: auto` (preventing Safari collapse/stretch),
 * flips cleanly above the trigger when bottom space is tight, and clamps within viewport.
 */
export function positionPopover(
  trigger: HTMLElement | null | undefined,
  pop: HTMLElement | null | undefined,
  opts: { align?: 'start' | 'end'; gap?: number; matchWidth?: boolean } = {},
): void {
  if (!trigger || !pop || typeof window === 'undefined') return;
  const gap = opts.gap ?? 6;
  const pad = 12;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const tr = trigger.getBoundingClientRect();

  pop.style.position = 'fixed';
  pop.style.inset = 'auto';
  pop.style.right = 'auto';
  pop.style.bottom = 'auto';
  pop.style.margin = '0';
  if (opts.matchWidth) {
    pop.style.minWidth = `${Math.round(Math.min(tr.width, vw - pad * 2))}px`;
  }

  const pr = pop.getBoundingClientRect();
  const pw = pr.width || 280;
  const ph = pr.height || 220;

  let left = opts.align === 'end' ? tr.right - pw : tr.left;
  left = Math.max(pad, Math.min(left, vw - pw - pad));

  const spaceBelow = vh - tr.bottom - gap - pad;
  const spaceAbove = tr.top - gap - pad;
  let top: number;
  let maxH: number;

  if (spaceBelow >= ph || spaceBelow >= spaceAbove) {
    top = tr.bottom + gap;
    maxH = Math.max(140, spaceBelow);
  } else {
    maxH = Math.max(140, spaceAbove);
    top = Math.max(pad, tr.top - gap - Math.min(ph, maxH));
  }

  pop.style.left = `${Math.round(left)}px`;
  pop.style.top = `${Math.round(top)}px`;
  pop.style.maxHeight = `${Math.round(maxH)}px`;
}

/** Move focus among enabled menu items, including wrapping at either end. */
export function navigateMenu(event: KeyboardEvent): void {
  const items = Array.from(
    (event.currentTarget as HTMLElement).querySelectorAll<HTMLButtonElement>(
      '[role="menuitem"]:enabled',
    ),
  );
  if (!items.length) return;
  const index = items.indexOf(event.target as HTMLButtonElement);
  let next: number;
  switch (event.key) {
    case 'Home':
      next = 0;
      break;
    case 'End':
      next = items.length - 1;
      break;
    case 'ArrowDown':
      next = (index + 1) % items.length;
      break;
    case 'ArrowUp':
      next = index <= 0 ? items.length - 1 : index - 1;
      break;
    default:
      return;
  }
  event.preventDefault();
  items[next].focus();
}
