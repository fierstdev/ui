#!/usr/bin/env node
// AsterUI CLI — Zero-Dependency Code-Owned Component Registry Installer
// Usage:
//   vp dlx @fierst/ui init [--dir src/ui]
//   vp dlx @fierst/ui list
//   vp dlx @fierst/ui add button dialog toast [--dir src/ui] [--force] [--registry https://ui.fierst.dev/r]

import fs from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const BIN_DIR = path.dirname(fileURLToPath(import.meta.url));
const LOCAL_REGISTRY_DIR = path.resolve(BIN_DIR, '../public/r');

async function loadManifest(name, registrySource) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)) throw new Error('Invalid registry item name');
  if (registrySource && /^https?:\/\//.test(registrySource)) {
    const base = registrySource.replace(/\/+$/, '');
    const res = await fetch(`${base}/${name}.json`);
    if (!res.ok)
      throw new Error(`Registry item "${name}" not found at ${base} (HTTP ${res.status})`);
    return res.json();
  }
  const dir = registrySource ? path.resolve(registrySource) : LOCAL_REGISTRY_DIR;
  const filePath = path.join(dir, `${name}.json`);
  if (!fs.existsSync(filePath)) {
    throw new Error(
      `Unknown AsterUI component "${name}". Run "aster-ui list" to see available components.`,
    );
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

export async function listRegistryItems(registrySource) {
  const idx = await loadManifest('index', registrySource);
  return idx.items ?? [];
}

/**
 * Recursively resolve `registryDependencies`, collect required npm `dependencies`
 * (such as `@lucide/icons`), and copy owned `.tsx` / `.css` source files into the
 * user's project directory. Never overwrites existing files unless `force: true`.
 */
export async function addComponents(names, projectRoot = process.cwd(), options = {}) {
  const targetUiDir = options.uiDir ?? 'src/ui';
  const force = Boolean(options.force);
  const registrySource = options.registry;

  const resolved = new Map();
  const visiting = new Set();
  const npmDeps = new Set();

  const visit = async (name) => {
    if (resolved.has(name)) return;
    if (visiting.has(name)) throw new Error('Cyclic registry dependency: ' + name);
    visiting.add(name);
    const item = await loadManifest(name, registrySource);
    if (item.name !== name || !Array.isArray(item.files))
      throw new Error('Invalid manifest: ' + name);
    for (const file of item.files) {
      if (
        !/^src\/ui\/[a-z0-9][a-z0-9.-]*\.(?:tsx?|css)$/.test(file.target) ||
        typeof file.content !== 'string'
      ) {
        throw new Error('Invalid registry file in ' + name);
      }
      if (
        file.sha256 !== undefined &&
        createHash('sha256').update(file.content).digest('hex') !== file.sha256
      ) {
        throw new Error('Registry checksum mismatch: ' + file.target);
      }
    }
    for (const dep of item.registryDependencies ?? []) {
      await visit(dep);
    }
    for (const pkg of item.dependencies ?? []) {
      npmDeps.add(pkg);
    }
    visiting.delete(name);
    resolved.set(name, item);
  };

  for (const name of names) {
    await visit(name);
  }

  const copied = [];
  const skipped = [];

  for (const item of resolved.values()) {
    for (const f of item.files ?? []) {
      const relTarget = f.target.replace(/^src\/ui\//, `${targetUiDir.replace(/\/+$/, '')}/`);
      const absDest = path.resolve(projectRoot, relTarget);
      fs.mkdirSync(path.dirname(absDest), { recursive: true });
      if (fs.existsSync(absDest) && !force) {
        skipped.push(relTarget);
        continue;
      }
      if (fs.lstatSync(absDest, { throwIfNoEntry: false })?.isSymbolicLink())
        throw new Error('Refusing to replace a symbolic link: ' + relTarget);
      try {
        fs.writeFileSync(absDest, f.content, { encoding: 'utf-8', flag: force ? 'w' : 'wx' });
      } catch (error) {
        if (force || error.code !== 'EEXIST') throw error;
        skipped.push(relTarget);
        continue;
      }
      copied.push(relTarget);
    }
  }

  return {
    resolved: [...resolved.keys()],
    dependencies: [...npmDeps],
    copied,
    skipped,
  };
}

const selfPath = (() => {
  const raw = fileURLToPath(import.meta.url);
  try {
    return fs.realpathSync(raw);
  } catch {
    return path.resolve(raw);
  }
})();

const isMain = [process.argv[1], process.argv[2]].filter(Boolean).some((candidate) => {
  const resolvedCandidate = path.resolve(candidate);
  try {
    return fs.realpathSync(resolvedCandidate) === selfPath;
  } catch {
    return resolvedCandidate === selfPath;
  }
});

if (isMain) {
  const args = process.argv.slice(2);
  const cmd = args[0] ?? 'help';
  const force = args.includes('--force');
  const dirFlagIdx = args.indexOf('--dir');
  const uiDir = dirFlagIdx !== -1 ? args[dirFlagIdx + 1] : 'src/ui';
  const regFlagIdx = args.indexOf('--registry');
  const registry = regFlagIdx !== -1 ? args[regFlagIdx + 1] : undefined;

  const skipIdx = new Set([0]);
  if (dirFlagIdx !== -1) {
    skipIdx.add(dirFlagIdx);
    skipIdx.add(dirFlagIdx + 1);
  }
  if (regFlagIdx !== -1) {
    skipIdx.add(regFlagIdx);
    skipIdx.add(regFlagIdx + 1);
  }
  const positional = args.filter((a, i) => !skipIdx.has(i) && !a.startsWith('-'));

  try {
    if (cmd === 'list') {
      const items = await listRegistryItems(registry);
      console.log('\nAsterUI Registry Components:\n');
      for (const it of items) {
        const deps = it.registryDependencies?.length
          ? ` (deps: ${it.registryDependencies.join(', ')})`
          : '';
        console.log(`  ${it.name.padEnd(14)} ${it.description}${deps}`);
      }
      console.log('');
    } else if (cmd === 'init') {
      const res = await addComponents(['theme', 'icon'], process.cwd(), { uiDir, force, registry });
      for (const f of res.copied) console.log(`  + ${f}`);
      for (const f of res.skipped) console.log(`  ~ skipped ${f} (use --force to overwrite)`);
      if (res.dependencies.length > 0) {
        console.log(`\nInstall required icon package:\n  vp add ${res.dependencies.join(' ')}`);
      }
      console.log(
        `\nInitialized AsterUI theme tokens & Lucide Icon helper in ${uiDir}/. UI components load theme.css automatically.\n`,
      );
    } else if (cmd === 'add') {
      if (positional.length === 0) {
        console.error('Usage: aster-ui add <component...> [--dir src/ui] [--force]');
        process.exit(1);
      }
      const res = await addComponents(positional, process.cwd(), { uiDir, force, registry });
      console.log(`\nResolved components: ${res.resolved.join(', ')}\n`);
      for (const f of res.copied) console.log(`  + ${f}`);
      for (const f of res.skipped) console.log(`  ~ skipped ${f} (use --force to overwrite)`);
      if (res.dependencies.length > 0) {
        console.log(
          `\nEnsure npm dependencies are installed:\n  vp add ${res.dependencies.join(' ')}`,
        );
      }
      console.log('');
    } else {
      console.log(`AsterUI — Code-Owned Native Web Component Registry by Fierst LLC

Usage:
  vp dlx @fierst/ui init                  Install theme.css, theme.ts, and Lucide icon.tsx into src/ui/
  vp dlx @fierst/ui list                  List all available registry components
  vp dlx @fierst/ui add <names...>        Copy owned components + registryDependencies into src/ui/
`);
    }
  } catch (err) {
    console.error(`[@fierst/ui] ${err instanceof Error ? err.message : String(err)}`);
    process.exit(1);
  }
}
