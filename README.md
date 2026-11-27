# AsterUI

AsterUI (`@fierst/ui`) is a source registry for Aster applications. Installing a registry item copies TypeScript, TSX and CSS into your project. Import the named exports from those local files. You can edit, test and version them with the rest of your application.

## Install and render your first component

Start in the root of an Aster project using Node.js 20.19 or later, `@fierst/aster@^1.2.0`, and the Aster Vite plugin. With Vite+ installed, run the following commands. You can also use `npx @fierst/ui` in place of `vp dlx @fierst/ui`.

```sh
vp dlx @fierst/ui init
vp add @lucide/icons
vp dlx @fierst/ui add button
```

In `src/main.tsx`, mount a button into the starter page's `#app` element.

```tsx
import { render } from '@fierst/aster';
import { Button } from './ui/button';
import { initTheme, setTheme } from './ui/theme';

initTheme();
render(
  <Button variant="primary" onClick={() => setTheme({ mode: 'dark' })}>
    Use dark mode
  </Button>,
  document.getElementById('app')!,
);
```

Run your project's development server (`vp dev` in the starter). Components import the shared stylesheet automatically. Import `./ui/theme.css` yourself on pages that use only the tokens or controller.

## Documentation

- [Component and API reference](docs/components.md) lists every registry item, companion export, prop type, callback, dependency and source file.
- [Theme cookbook](docs/themes.md) covers presets, light/dark/system switching, saved preferences, custom palettes and accessible styling.
- [Integration guide](docs/integration.md) covers CLI flags, code-owned updates, programmatic installation, state, forms, overlays, charts, AI workflows and all eight generator flows.
- [Design guide](DESIGN.md) describes the visual system.
- [Single-file reference for language models](llms.txt) combines the guides and API contracts in one text file. The showcase build serves it at `/llms.txt`.
- [Release history](CHANGELOG.md) records changes to installed components. [Explore the showcase](https://ui.fierst.dev).

## Working on the registry

Install dependencies with `pnpm install --frozen-lockfile`. Edit component source under `src/ui` and item metadata in `registry.json`. Run `npm run build:registry` to refresh the static manifests and `npm run build:docs` to refresh the API reference and single-file guide. Run `npm run check`, `npm test`, `npm run build` and `npm run test:browser` before release. The browser suite uses Playwright Chromium.
