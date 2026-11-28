import { expect, test } from '@playwright/test';
import axe from 'axe-core';

declare global {
  interface Window {
    axe: typeof axe;
  }
}

for (const section of ['overview', 'ops', 'ai', 'forms', 'overlays', 'directory']) {
  test(section, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto('/?section=' + section);
    await expect(page.locator('main')).toContainText(/\S/);
    if (section === 'forms') await page.getByRole('radio', { name: 'All Sections' }).click();
    await page.addScriptTag({ content: axe.source });
    const violations = await page.evaluate(async () => {
      const result = await window.axe.run(document, {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] },
      });
      return result.violations.map((v) => [
        v.id,
        v.nodes.map((n) => n.html + ' ' + n.failureSummary),
      ]);
    });
    expect(errors).toEqual([]);
    expect(violations).toEqual([]);
  });
}
test('confirmation is cleared after Escape and focus returns to its trigger', async ({ page }) => {
  await page.goto('/?section=overlays');
  const trigger = page.getByRole('button', { name: 'Open AlertDialog', exact: true });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Delete Staging Environment?' });
  const confirm = dialog.getByRole('button', { name: 'Delete Cluster' });
  await expect(confirm).toBeDisabled();
  await dialog.getByRole('textbox').fill('DELETE');
  await expect(confirm).toBeEnabled();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await expect(confirm).toBeDisabled();
});

test('keyboard selection changes the form layout and names the highlighted combobox option', async ({
  page,
}) => {
  await page.goto('/?section=forms');
  const layout = page.getByRole('radio', { name: 'Step-by-Step' });
  await layout.focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('radio', { name: 'All Sections' })).toBeChecked();
  const input = page.getByRole('combobox', { name: 'Runtime Preset (Combobox)' });
  await input.fill('');
  await input.press('ArrowDown');
  const active = await input.getAttribute('aria-activedescendant');
  expect(active).toBeTruthy();
  const option = page.locator('#' + active);
  const value = await option.innerText();
  await input.press('Enter');
  await expect(input).toHaveValue(value.trim());
});
test('multi-select removes a chip independently and restores it through the listbox', async ({
  page,
}) => {
  await page.goto('/?section=forms');
  const control = page.getByRole('combobox', { name: 'Replica Regions (MultiSelect)' });
  const group = control.locator('..');
  const remove = group.getByRole('button', { name: /^Remove / }).first();
  const label = (await remove.getAttribute('aria-label'))!.slice('Remove '.length);
  await remove.focus();
  await page.keyboard.press('Enter');
  await expect(group.getByRole('button', { name: 'Remove ' + label, exact: true })).toHaveCount(0);
  await control.click();
  const option = page
    .getByRole('listbox', { name: 'Replica Regions (MultiSelect)' })
    .getByRole('option', { name: label, exact: true });
  await option.click();
  await expect(option).toHaveAttribute('aria-selected', 'true');
  await page.keyboard.press('Escape');
  await expect(group.getByRole('button', { name: 'Remove ' + label, exact: true })).toBeVisible();
});

test('editorial and documentation components', async ({ page }) => {
  await page.goto('/?section=overview');
  await page.getByRole('button', { name: 'Essential Only' }).click();
  const viewer = page.getByRole('region', { name: 'Manuscript title' });
  const input = viewer.getByLabel('Working title');
  await input.fill('Keep this draft');
  await viewer.getByRole('radio', { name: 'Source' }).click();
  await expect(input).toBeHidden();
  await expect(viewer.locator('pre')).toContainText('Untitled draft');
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  await viewer.getByRole('button', { name: 'Copy' }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain('Untitled draft');
  await viewer.getByRole('radio', { name: 'Source' }).press('ArrowLeft');
  await expect(input).toHaveValue('Keep this draft');
  const menu = page.getByRole('button', { name: 'Journal navigation' });
  await menu.click();
  const panel = page.getByRole('navigation', { name: 'Journal navigation' });
  await expect(panel.getByRole('link', { name: 'Engineering notes' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(panel).toBeHidden();
  await expect(menu).toBeFocused();
  const article = page
    .getByRole('article')
    .filter({ hasText: 'When should a one-time QR code stop working?' });
  await expect(article.locator('time')).toHaveAttribute('datetime', '2026-11-28');
});
