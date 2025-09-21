# UI Automation: UltimateQA (Playwright + TypeScript)

## Scope
Target page: [Simple HTML Elements for Automation](https://ultimateqa.com/simple-html-elements-for-automation/)

**Table: "HTML Table with no id"**
1. Titles must follow **Title Case**; prepositions/articles may remain lowercase (except first/last word).
2. All **Salary** values must be ≥ $100,000.
3. No record with **Work = "Manual"**.

**Form: "Email Me!"**
- Fill out and trigger the action for **10 different emails**.

---

## Framework Design
- **Test Runner:** Playwright Test (TypeScript)  
- **Structure:**  
  - `tests/` → test specs  
  - `utils/` → reusable helpers  
- **Config:** `playwright.config.ts` with HTML report, video/screenshot/trace on failure  
- **Containerization:** `Dockerfile` for running inside Docker  
- **(Optional) CI:** GitHub Actions  

---

## Run with Docker
### Build the image
```bash
docker build -t ultimateqa-tests .

##  Structure
// Add UI + API
ui-automation-ultimateqa-playwright/
│
├─ tests/
│   ├─ ui/              # UI test (table, email form…)
│   └─ api/             # API test (profile)
│
├─ utils/               # helpers (titleCase.ts, data.ts…)
├─ schemas/             # json schema để validate API response
├─ playwright.config.ts # config 
├─ package.json
├─ Dockerfile
└─ .github/workflows/ci.yml
