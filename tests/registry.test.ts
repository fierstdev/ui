import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vite-plus/test';
import { addComponents, listRegistryItems } from '../bin/aster-ui.mjs';

const EXPECTED_ITEMS = [
  'theme',
  'icon',
  'button',
  'badge',
  'card',
  'input',
  'switch',
  'tabs',
  'dialog',
  'popover',
  'toast',
  'data-table',
  'sheet',
  'command',
  'select',
  'accordion',
  'tooltip',
  'progress',
  'checkbox',
  'avatar',
  'alert',
  'breadcrumb',
  'pagination',
  'slider',
  'calendar',
  'app-shell',
  'separator',
  'aspect-ratio',
  'scroll-area',
  'collapsible',
  'resizable',
  'label',
  'toggle',
  'input-otp',
  'number-input',
  'tag-input',
  'multi-select',
  'file-upload',
  'combobox',
  'rating',
  'context-menu',
  'hover-card',
  'menubar',
  'stepper',
  'drawer',
  'stat-card',
  'description-list',
  'empty-state',
  'timeline',
  'kbd',
  'copy-button',
  'carousel',
  'container',
  'page-header',
  'section-header',
  'prose',
  'grid',
  'sticky-bar',
  'footer',
  'navbar',
  'sidebar-nav',
  'visually-hidden',
  'password-input',
  'search-input',
  'color-picker',
  'date-range-picker',
  'time-picker',
  'range-slider',
  'segmented-control',
  'phone-input',
  'currency-input',
  'mention-input',
  'form',
  'inline-edit',
  'alert-dialog',
  'spinner',
  'meter',
  'banner-cookie',
  'tour',
  'command-bar',
  'navigation-menu',
  'back-to-top',
  'table',
  'tree-view',
  'kanban',
  'bar-chart',
  'line-chart',
  'donut-chart',
  'sparkline',
  'calendar-heatmap',
  'diff-viewer',
  'json-viewer',
  'status-dot',
  'metric-list',
  'chat-message',
  'prompt-input',
  'streaming-text',
  'reasoning-block',
  'tool-call-card',
  'approval-card',
  'citation-badge',
  'suggestion-chips',
  'token-usage',
  'workflow-graph',
];

describe('AsterUI Code-Owned Registry & CLI (104 Items)', () => {
  it('lists all 104 built registry items with non-empty embedded source manifests', async () => {
    const items = await listRegistryItems();
    expect(items.length).toBe(104);
    const names = items.map((i) => i.name);
    for (const expected of EXPECTED_ITEMS) {
      expect(names).toContain(expected);
    }
  });

  it('recursively resolves registryDependencies + npm dependencies and installs files non-destructively', async () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'aster-ui-test-'));
    try {
      const first = await addComponents(
        ['approval-card', 'alert-dialog', 'navbar', 'date-range-picker', 'workflow-graph'],
        tmp,
      );
      for (const req of [
        'theme',
        'icon',
        'button',
        'badge',
        'dialog',
        'input',
        'sheet',
        'calendar',
        'approval-card',
        'alert-dialog',
        'navbar',
        'date-range-picker',
        'workflow-graph',
      ]) {
        expect(first.resolved).toContain(req);
      }
      expect(first.dependencies).toEqual(['@lucide/icons']);
      expect(first.copied).toContain('src/ui/approval-card.tsx');
      expect(first.copied).toContain('src/ui/workflow-graph.tsx');
      expect(first.skipped).toEqual([]);

      // Simulate user customizing owned button.tsx
      const btnPath = path.join(tmp, 'src/ui/button.tsx');
      fs.writeFileSync(btnPath, '// user customization\n', 'utf-8');

      const second = await addComponents(['bar-chart', 'diff-viewer', 'prompt-input', 'tour'], tmp);
      expect(second.skipped).toContain('src/ui/button.tsx');
      expect(second.copied).toContain('src/ui/bar-chart.tsx');
      expect(second.copied).toContain('src/ui/diff-viewer.tsx');
      expect(second.copied).toContain('src/ui/prompt-input.tsx');
      expect(fs.readFileSync(btnPath, 'utf-8')).toBe('// user customization\n');

      const third = await addComponents(['button'], tmp, { force: true });
      expect(third.copied).toContain('src/ui/button.tsx');
      expect(fs.readFileSync(btnPath, 'utf-8')).not.toBe('// user customization\n');
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  });
});
describe('standalone registry installs', () => {
  it.each(EXPECTED_ITEMS)('installs %s with its source and all local imports', async (name) => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'aster-ui-item-'));
    try {
      const result = await addComponents([name], tmp);
      for (const target of result.copied) {
        const file = path.join(tmp, target);
        const source = fs.readFileSync(file, 'utf8');
        expect(source).toBe(fs.readFileSync(target, 'utf8').replaceAll('\r\n', '\n'));
        for (const match of source.matchAll(/from ['"](\.\/[^'"]+)['"]/g)) {
          expect(fs.existsSync(path.resolve(path.dirname(file), match[1]))).toBe(true);
        }
        if (source.includes("from '@lucide/icons'"))
          expect(result.dependencies).toContain('@lucide/icons');
      }
      expect(result.resolved).toContain(name);
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  });
});
