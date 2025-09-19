import { test, expect } from '@playwright/test';
import { isTitleCaseWithPrepositions, parseMoney } from '../utils/titleCase';

const PAGE = '/simple-html-elements-for-automation/';

test.describe('HTML Table with no id validations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');
  });

  test('titles are Title Case (prepositions lowercase)', async ({ page }) => {
    const targetTable = page.getByRole('table').nth(1); // bảng "no id" là cái thứ 2
    const rows = targetTable.getByRole('row');
    const rowCount = await rows.count();
    for (let i = 0; i < rowCount; i++) {
      const cells = rows.nth(i).getByRole('cell');
      if (await cells.count() < 3) continue;
      const titleText = (await cells.nth(0).innerText()).trim();
      expect.soft(
        isTitleCaseWithPrepositions(titleText),
        `Title case check failed for: "${titleText}"`
      ).toBeTruthy();
    }
  });

  test('all roles have at least $100k', async ({ page }) => {
    const targetTable = page.getByRole('table').nth(1);
    const rows = targetTable.getByRole('row');
    const rowCount = await rows.count();
    for (let i = 0; i < rowCount; i++) {
      const cells = rows.nth(i).getByRole('cell');
      if (await cells.count() < 3) continue;
      const salaryText = (await cells.nth(2).innerText()).trim();
      const amount = parseMoney(salaryText);
      expect.soft(amount, `Salary parse for "${salaryText}"`)
        .toBeGreaterThanOrEqual(100000);
    }
  });

  test('there is no Manual work', async ({ page }) => {
    const targetTable = page.getByRole('table').nth(1);
    const rows = targetTable.getByRole('row');
    const rowCount = await rows.count();
    for (let i = 0; i < rowCount; i++) {
      const cells = rows.nth(i).getByRole('cell');
      if (await cells.count() < 3) continue;
      const workText = (await cells.nth(1).innerText()).trim().toLowerCase();
      expect.soft(workText).not.toContain('manual');
    }
  });
});
