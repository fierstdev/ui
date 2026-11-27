import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { expect, it } from 'vite-plus/test';
import { addComponents } from '../bin/aster-ui.mjs';

it('ships UI tokens in the initial CSS of a production Aster starter', async () => {
  const app = fs.mkdtempSync(path.resolve('.aster-ui-scaffold-'));
  const build = path.resolve('node_modules/vite-plus/bin/vp');
  const entryStyles = () => {
    execFileSync(process.execPath, [build, 'build'], { cwd: app });
    const html = fs.readFileSync(path.join(app, 'dist/index.html'), 'utf8');
    return Array.from(html.matchAll(/<link rel="stylesheet"[^>]+href="\/([^"]+)"/g), (match) =>
      fs.readFileSync(path.join(app, 'dist', match[1]), 'utf8'),
    ).join('\n');
  };
  try {
    execFileSync(process.execPath, ['node_modules/@fierst/aster/bin/create.mjs', app]);
    expect(entryStyles()).not.toContain('--aster-radius-control:');
    await addComponents(['button'], app, { uiDir: 'src/controls' });
    fs.writeFileSync(
      path.join(app, 'src/main.tsx'),
      `import { render } from '@fierst/aster';
import { Button } from './controls/button';
render(<Button>Continue</Button>, document.getElementById('app')!);
`,
    );
    expect(entryStyles()).toContain('--aster-radius-control:');
  } finally {
    fs.rmSync(app, { recursive: true, force: true });
  }
}, 30000);
