


# UI Automation: UltimateQA (Playwright + TypeScript)

## Scope
Trang: https://ultimateqa.com/simple-html-elements-for-automation/

**Bảng "HTML Table with no id":**
1) Title phải Title Case; giới từ/articles có thể lowercase (trừ từ đầu/cuối).
2) Tất cả Salary ≥ $100,000.
3) Không có Work = "Manual".

**Form "Email Me!":**
- Điền và kích hoạt hành động với 10 email.

## Thiết kế framework
- Runner: Playwright Test (TypeScript)
- Cấu trúc: `tests/` specs, `utils/` helpers
- `playwright.config.ts`: HTML report, video/screenshot/trace on failure
- Dockerfile: chạy trong container
- (Tuỳ chọn) CI: GitHub Actions

## Chạy bằng Docker
```bash
docker build -t ultimateqa-tests .
# Windows PowerShell
docker run --rm -it `
  -v "${PWD}\playwright-report:/app/playwright-report" `
  -v "${PWD}\test-results:/app/test-results" `
  ultimateqa-tests
# Windows CMD
docker run --rm -it ^
  -v "%cd%\playwright-report:/app/playwright-report" ^
  -v "%cd%\test-results:/app/test-results" ^
  ultimateqa-tests

##  Structure
ui-automation-ultimateqa-playwright/
│
├─ Dockerfile
├─ .dockerignore
├─ package.json
├─ tsconfig.json
├─ playwright.config.ts
│
├─ utils/
│   └─ titleCase.ts
│
└─ tests/
    ├─ table.spec.ts
    └─ email.spec.ts