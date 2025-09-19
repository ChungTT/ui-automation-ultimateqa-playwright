import { test, expect, Page, Locator } from '@playwright/test';

const URL = 'https://ultimateqa.com/simple-html-elements-for-automation/';

// prepositions giữ chữ thường khi kiểm tra tiêu đề
const PREPOSITIONS = new Set([
  'in','on','at','for','of','and','or','the','a','an','with','to','from','by','over','under','into','onto','up','down','off','via'
]);

// lấy đúng "HTML Table with no id" bằng heading rồi table ngay sau đó
const noIdTable = (page: Page): Locator =>
  page.getByRole('heading', { name: 'HTML Table with no id' })
      .locator('xpath=following::table[1]');

test.beforeEach(async ({ page }) => {
  await page.goto(URL, { waitUntil: 'domcontentloaded' });
  // scroll nhẹ để chắc chắn phần bảng render
  await page.evaluate(() => window.scrollBy(0, window.innerHeight));
});

test('Title: mỗi từ viết hoa chữ cái đầu, trừ giới từ', async ({ page }) => {
  const table = noIdTable(page);
  const rows = table.getByRole('row');
  const rowCount = await rows.count();
  // bỏ header (row 0)
  for (let i = 1; i < rowCount; i++) {
    const cells = rows.nth(i).getByRole('cell');
    const title = (await cells.nth(0).innerText()).trim();
    // kiểm tra quy tắc viết hoa
    const ok = title.split(/\s+/).every((w, idx) => {
      // giữ nguyên lowercase nếu là preposition (ngoại trừ từ đầu)
      if (idx > 0 && PREPOSITIONS.has(w.toLowerCase())) return w === w.toLowerCase();
      // còn lại phải Capitalized (chỉ chữ cái đầu viết hoa)
      const first = w.charAt(0), rest = w.slice(1);
      return first === first.toUpperCase() && rest === rest.toLowerCase();
    });
    expect(ok, `Sai định dạng title ở hàng ${i}: "${title}"`).toBeTruthy();
  }
});

test('Salary: tất cả role có lương >= $100k', async ({ page }) => {
  const table = noIdTable(page);
  const rows = table.getByRole('row');
  const rowCount = await rows.count();
  for (let i = 1; i < rowCount; i++) {
    const cells = rows.nth(i).getByRole('cell');
    const salaryRaw = (await cells.nth(2).innerText()).trim(); // cột 3
    // parse số (ví dụ "$150,000+")
    const match = salaryRaw.replace(/[^0-9]/g, '');
    const salary = parseInt(match, 10);
    expect.soft(
      salary >= 100000,
      `Lương < 100k ở hàng ${i}: "${salaryRaw}"`
    ).toBeTruthy();
  }
});

test('Work: không có "Manual"', async ({ page }) => {
  const table = noIdTable(page);
  const rows = table.getByRole('row');
  const rowCount = await rows.count();
  for (let i = 1; i < rowCount; i++) {
    const cells = rows.nth(i).getByRole('cell');
    const work = (await cells.nth(1).innerText()).trim(); // cột 2
    expect.soft(
      /manual/i.test(work),
      `Tìm thấy "Manual" ở hàng ${i}: "${work}"`
    ).toBeFalsy();
  }
});

test('Gửi "Email Me!" với 10 accounts (data-driven)', async ({ page }) => {
  // dùng label để bền vững selector
  const nameInput = page.getByLabel('Name', { exact: true });
  const emailInput = page.getByLabel('Email Address', { exact: true });
  const submitBtn = page.getByRole('button', { name: /Email Me!/i });

  for (let i = 1; i <= 10; i++) {
    await nameInput.fill(`QC User ${i}`);
    await emailInput.fill(`qc.user${i}@example.com`);
    await submitBtn.click();
    // nếu có toast/alert thì bắt optional; nếu không có, vẫn tiếp tục vòng lặp
    // chờ ngắn để tránh spam nhanh quá
    await page.waitForTimeout(200);
  }

  // xác nhận đã bấm 10 lần bằng cách không lỗi là đủ;
  // có thể thêm xác nhận network nếu trang có request (HAR/route) – tùy môi trường chạy
});
