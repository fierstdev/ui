import { defineConfig } from 'vite-plus';
import { readFileSync } from 'node:fs';
import aster from '@fierst/aster/vite';

export default defineConfig({
  plugins: [
    aster(),
    {
      name: 'aster-ui-documentation',
      generateBundle() {
        this.emitFile({
          type: 'asset',
          fileName: 'llms.txt',
          source: readFileSync(new URL('./llms.txt', import.meta.url)),
        });
      },
    },
  ],
  test: {
    include: ['tests/**/*.test.{ts,tsx}'],
  },
  lint: {
    ignorePatterns: ['dist/**', 'public/r/**'],
    options: { typeAware: true, typeCheck: true },
  },
  fmt: {
    ignorePatterns: ['dist/**', 'public/r/**', 'docs/components.md'],
    singleQuote: true,
    semi: true,
  },
});
