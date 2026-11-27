#!/usr/bin/env node
// Compiles `registry.json` + `src/ui/*` into static registry JSON files under `public/r/`.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export function buildRegistry(rootDir = ROOT) {
  const reg = JSON.parse(fs.readFileSync(path.join(rootDir, 'registry.json'), 'utf-8'));
  const outDir = path.join(rootDir, 'public/r');
  fs.mkdirSync(outDir, { recursive: true });

  const indexItems = [];

  for (const item of reg.items) {
    const files = item.files.map((f) => {
      const abs = path.join(rootDir, f.path);
      const content = fs.readFileSync(abs, 'utf-8').replace(/\r\n/g, '\n');
      const sha256 = crypto.createHash('sha256').update(content).digest('hex');
      return {
        path: f.path,
        target: f.target,
        sha256,
        content,
      };
    });

    const manifest = {
      name: item.name,
      type: item.type,
      title: item.title,
      description: item.description,
      dependencies: item.dependencies ?? [],
      registryDependencies: item.registryDependencies ?? [],
      files,
    };

    fs.writeFileSync(
      path.join(outDir, `${item.name}.json`),
      JSON.stringify(manifest, null, 2) + '\n',
    );
    indexItems.push({
      name: item.name,
      type: item.type,
      title: item.title,
      description: item.description,
      dependencies: item.dependencies ?? [],
      registryDependencies: item.registryDependencies ?? [],
      files: files.map((f) => f.target),
    });
  }

  fs.writeFileSync(
    path.join(outDir, 'index.json'),
    JSON.stringify(
      { name: reg.name, version: reg.version, homepage: reg.homepage, items: indexItems },
      null,
      2,
    ) + '\n',
  );

  return indexItems.length;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const count = buildRegistry();
  console.log(`[@fierst/ui] Built ${count} registry manifests in public/r/`);
}
