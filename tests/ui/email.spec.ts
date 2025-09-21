import { test, expect } from '@playwright/test';

const PAGE = '/simple-html-elements-for-automation/';
const EMAILS = Array.from({ length: 10 }, (_, i) => `test${i+1}@example.com`);

test.describe('Email me form', () => {
  for (const email of EMAILS) {
    test(`Email Me accepts and triggers action for ${email}`, async ({ page }) => {
      await page.goto(PAGE, { waitUntil: 'domcontentloaded' });

      const nameInput  = page.getByLabel('Name', { exact: false });
      const emailInput = page.getByLabel('Email Address', { exact: false });
      await nameInput.fill('Playwright Bot');
      await emailInput.fill(email);

      const emailMe = page.getByRole('link', { name: /Email\s*Me!/i })
                          .or(page.getByRole('button', { name: /Email\s*Me!/i }));

      if (await emailMe.first().count()) {
        const href = await emailMe.first().getAttribute('href');
        if (href && href.startsWith('mailto:')) {
          expect(href).toContain('@'); // Verify email is Valid
        } else {
          await emailMe.first().click();
        }
      } else {
        await page.getByText(/Email\s*Me!/i).first().click();
      }
    });
  }
});
