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