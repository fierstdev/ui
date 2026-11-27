# Themes

## Choose a starting theme

Call `initTheme()` once in the browser entry before mounting. Its defaults are system mode, blue preset, medium radius and comfortable density. CSS works before JavaScript runs. For a specific first paint, render the corresponding attributes on the document root, for example `<html data-aster-mode="dark" data-aster-preset="violet">`. If your server knows the user's preferences, use the same values on both sides. The controller stores state in a module-level signal, so keep per-request preferences in the rendered HTML during SSR.

| Preset  | Seed hue | Seed chroma |
| ------- | -------: | ----------: |
| zinc    |      285 |       0.006 |
| blue    |      255 |        0.20 |
| emerald |      158 |        0.16 |
| violet  |      285 |        0.20 |
| rose    |       16 |        0.20 |
| amber   |       55 |        0.18 |

`THEME_PRESETS` supplies each preset's id, display label, hue and swatch for a picker. The zinc preset has explicit monochrome primary roles. Use a chromatic preset as the base for a custom accent.

## Switch and remember preferences

```tsx
import { THEME_PRESETS, initTheme, setTheme, themeState } from './ui/theme';

initTheme({ preset: 'emerald' }); // A saved preference takes precedence.

export function* ThemePicker() {
  for (;;) {
    const current = themeState();
    yield (
      <fieldset>
        <legend>Appearance</legend>
        {(['system', 'light', 'dark'] as const).map((mode) => (
          <button
            type="button"
            aria-pressed={current.mode === mode}
            onClick={() => setTheme({ mode })}
          >
            {mode}
          </button>
        ))}
        {THEME_PRESETS.map(({ id, label }) => (
          <button
            type="button"
            aria-pressed={current.preset === id && current.customHue === undefined}
            onClick={() => setTheme({ preset: id, customHue: undefined })}
          >
            {label}
          </button>
        ))}
      </fieldset>
    );
  }
}
```

`system` follows the OS via `prefers-color-scheme`, including later OS changes. Explicit light and dark modes override it. `setTheme(patch)` merges fields, updates the signal and root attributes, and writes the entire configuration to local storage under `aster-ui-theme`. `setTheme(patch, false)` applies a temporary change. The next persisted change saves the then-current configuration. Use `themeState()` for reactive reads and `themeState.peek()` for snapshots. Apply changes through `setTheme` so the DOM and storage stay in sync.

`initTheme(defaults)` merges current state, supplied defaults, then saved values and returns the result. Storage access and JSON parse failures are tolerated. To restore factory settings and remember them, call `setTheme({ mode: 'system', preset: 'blue', radius: 'md', density: 'comfortable', customHue: undefined })`.

## Build a custom theme

For a user-selected accent, supply a numeric hue in degrees. Clearing `customHue` restores the preset seed. Radius options are `none`, `sm`, `md`, and `lg` (control radii 0, 6, 8 and 12 px). Density options are `compact` (0.9) and `comfortable` (1). Coarse pointers use dedicated control sizes.

```ts
setTheme({ preset: 'blue', customHue: 205, radius: 'lg', density: 'compact' });
```

For a named brand, add an application stylesheet after the theme import. The library defines its defaults in CSS cascade layers. Keep your brand rules unlayered. Put the seed on the root where the derived tokens are computed. Give your brand its own attribute, leaving the typed preset field available to the controller.

```css
:root[data-brand='lagoon'] {
  --aster-seed-hue: 205;
  --aster-seed-chroma: 0.14;
  --aster-neutral-tint: 0.006;
  --aster-font-sans: system-ui, sans-serif;
}
```

```ts
setTheme({ preset: 'blue', customHue: undefined });
document.documentElement.dataset.brand = 'lagoon';
// Return to the selected built-in preset:
delete document.documentElement.dataset.brand;
```

Persist the application-owned brand separately if users can select it. A controller-set custom hue is an inline CSS property and takes precedence over stylesheet seeds. To add a preset to your owned copy itself, extend `ThemePreset`, add its id/label/hue/swatch to `THEME_PRESETS`, and add its `:root[data-aster-preset='…']` seed rules in `theme.css`.

Use semantic roles in app CSS, for example `background: var(--aster-surface)` and `color: var(--aster-on-surface)`. The seed drives OKLCH-derived roles where supported. The stylesheet also defines static sRGB fallbacks. For an exact brand color across browsers override the semantic roles directly, including hover, foreground, subtle fill/ink, border and focus ring. Provide dark values for both explicit dark mode and system dark mode. Verify contrast, focus, disabled controls and chart labels under each mode. Individual components can also define local styling; edit their owned source for exceptions.

The shared stylesheet defines global box sizing, body colors and typography, modal scroll locking and popover surfaces. It adjusts borders for increased contrast, transition durations for reduced motion, and touch control sizes for coarse pointers. The component reference includes the full token inventory.
