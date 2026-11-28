import fs from 'node:fs';
import { parseSync } from 'oxc-parser';

const read = (path) => fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n').trimEnd();
const registry = JSON.parse(read('registry.json'));
const unreleased = new Set(['article-preview', 'example-viewer', 'site-menu']);
const repo = 'https://github.com/fierstdev/ui/blob/v' + registry.version + '/';
const items = registry.items.toSorted((a, b) => a.name.localeCompare(b.name, 'en'));

function declarations(file, source) {
  const parsed = parseSync(file, source);
  if (parsed.errors.length) throw new Error(JSON.stringify(parsed.errors));
  return parsed.program.body;
}

const fixtureFile = 'tests/components.test.tsx';
const fixtures = read(fixtureFile);
const fixtureMap = declarations(fixtureFile, fixtures).find((node) =>
  node.declarations?.some((decl) => decl.id.name === 'fixtures'),
).declarations[0].init.properties;
const examples = new Map(
  fixtureMap.map(({ key, value }) => [
    key.name ?? key.value,
    fixtures.slice(value.body.start, value.body.end),
  ]),
);
const showcase = [
  'src/showcase.tsx',
  ...fs
    .readdirSync('src/showcase')
    .filter((file) => file.endsWith('.tsx'))
    .map((file) => 'src/showcase/' + file),
].map((file) => ({ file, lines: read(file).split('\n') }));

const sections = [];
const index = [];
for (const item of items) {
  const file = item.files.find(({ path }) => /\.tsx?$/.test(path)).path;
  const source = read(file);
  const exported = declarations(file, source).filter(
    (node) => node.type === 'ExportNamedDeclaration',
  );
  const contracts = [];
  const names = [];
  for (const node of exported) {
    const decl = node.declaration;
    const name = decl.id?.name ?? decl.declarations[0].id.name;
    names.push(name);
    const end = decl.type === 'FunctionDeclaration' ? decl.body.start : decl.end;
    contracts.push(source.slice(node.start, end).trimEnd());
  }

  const slug = item.name;
  index.push('- [' + slug + '](#' + slug + ') — ' + item.title);
  const block = [
    '## ' + slug,
    item.description,
    (unreleased.has(slug)
      ? 'Available in the source checkout. From your app, run `node /path/to/ui/bin/aster-ui.mjs add '
      : 'Install with `vp dlx @fierst/ui add ') +
      slug +
      '`. ' +
      'Direct registry dependencies: ' +
      (item.registryDependencies.join(', ') || 'none') +
      '. Direct npm dependencies: ' +
      (item.dependencies?.join(', ') || 'none') +
      '.',
    'Exports from `./ui/' + slug + '`: ' + names.map((name) => '`' + name + '`').join(', ') + '.',
  ];
  if (slug !== 'theme') {
    const example = examples.get(slug);
    if (!example) throw new Error('Missing tested usage for ' + slug);
    const component = example.match(/<(\w+)/)[1];
    block.push(
      'Minimal TSX usage',
      '```tsx\n' +
        (slug === 'icon' ? "import { Check } from '@lucide/icons';\n" : '') +
        'import { ' +
        component +
        " } from './ui/" +
        slug +
        "';\n\n" +
        example +
        '\n```',
    );
  }
  const sourceRepo = unreleased.has(slug) ? 'https://github.com/fierstdev/ui/blob/main/' : repo;
  const links = ['[Implementation](' + sourceRepo + file + ')'];
  for (const { file: demo, lines } of showcase) {
    const use = lines.findIndex((line) =>
      names.some((name) => line.match(new RegExp('<' + name + '\\b'))),
    );
    if (use >= 0)
      links.push(
        '[' + demo.split('/').pop() + ' example](' + sourceRepo + demo + '#L' + (use + 1) + ')',
      );
  }
  block.push(links.join(' · '), 'API contracts', '```ts\n' + contracts.join('\n\n') + '\n```');
  if (slug === 'theme') {
    const css = read('src/ui/theme.css');
    const tokens = [...new Set(Array.from(css.matchAll(/(--aster-[\w-]+)\s*:/g), (m) => m[1]))];
    block.push(
      'CSS tokens defined by the shared theme',
      tokens.map((t) => '- `' + t + '`').join('\n'),
      '[Token values by mode, preset and media query](' + repo + 'src/ui/theme.css)',
    );
  }
  sections.push(block.join('\n\n'));
}

const catalog = [
  '# Component and API reference',
  'The ' +
    items.length +
    ' registry items below are sorted by install slug. Each entry includes its local imports, direct dependencies and public declarations. In function signatures, the first parameter describes the props; Aster supplies the context parameter. Open the implementation for internal defaults or the linked showcase for an example with application state.',
  index.join('\n'),
  ...sections,
].join('\n\n');

const guide = [
  '# AsterUI (@fierst/ui) ' + registry.version,
  '> Code-owned TSX components for Aster. This single-file manual contains installation, theming, integration and the public API for every registry item.',
  ...['README.md', 'docs/themes.md', 'docs/integration.md', 'DESIGN.md'].map((file) =>
    read(file).replace(/\]\((?!https?:|#)([^)]+)\)/g, '](' + repo + '$1)'),
  ),
  catalog,
].join('\n\n');

for (const [file, content] of [
  ['docs/components.md', catalog],
  ['llms.txt', guide],
]) {
  if (process.argv.includes('--check')) {
    if (read(file) !== content) throw new Error('Run npm run build:docs to refresh ' + file);
  } else {
    fs.writeFileSync(file, content + '\n');
  }
}
