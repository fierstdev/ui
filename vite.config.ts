import { defineConfig } from 'vite-plus';
import aster from '@fierst/aster/vite';

export default defineConfig({
  plugins: [aster()],
  test: {
    include: ['tests/**/*.test.{ts,tsx}'],
  },
  lint: {
    ignorePatterns: ['dist/**', 'public/r/**'],
    options: { typeAware: true, typeCheck: true },
  },
  fmt: {
    ignorePatterns: ['dist/**', 'public/r/**'],
    singleQuote: true,
    semi: true,
  },
});
