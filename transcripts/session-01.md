# AI Coding Session Transcript (Session 01)

- **Date**: October 8, 2026
- **Project**: Tip & Bill Splitter Calculator (`talha-sadiq-calculator`)
- **Developer**: Talha Sadiq
- **AI Coding Tool**: Antigravity (Powered by Google DeepMind)

---

## 1. Initial Prompt & Direction

### User Input:
> "Take-Home Assignment: Build a Calculator Web App with an AI Coding Tool
> KnowledgeCity, Technology Division
> What type of calculator would you like to build?
> Tip and bill splitter
> Talha Sadiq, and create it and also focus on UI and file and folder structure and follow the centralized code and things and also everything as requirement."

### AI Response & Plan:
- Acknowledge choice: **Tip and bill splitter** for Talha Sadiq.
- Project name: `talha-sadiq-calculator`.
- Architectural Goals:
  - Centralized calculations and validation logic in `src/lib/calculations.ts`.
  - Type definitions in `src/types/calculator.ts`.
  - Responsive, modern user interface in `src/components/TipCalculator.tsx`.
  - Next.js App Router entry in `src/app/page.tsx` and `src/app/layout.tsx`.
  - Three product documents: `docs/app-roles.md`, `docs/jobs-to-be-done.md`, `docs/user-stories.md`.
  - Automated unit test suite in `tests/calculator.test.ts`.

---

## 2. Iterative Development & Problem Solving

### Iteration 1: Centralizing Data Model & Validation
- Created `src/types/calculator.ts` with `TipCalculatorInputs`, `CalculationResult`, and `CalculationError`.
- Created `src/lib/calculations.ts` implementing `validateBillAmount`, `validateTipPercentage`, `validateNumberOfPeople`, `validateTaxAmount`, and `calculateTipSplit`.
- Guarded against division by zero: if `numberOfPeople` is 0 or negative, `validateNumberOfPeople` blocks execution with an error, while `calculateTipSplit` defaults safely to 1.

### Iteration 2: Pre-Tax Tipping Requirement
- The user specified the key user story:
  > "As a Bill Payer, I want to exclude tax from the tip calculation, so that I tip only on the service amount rather than the total bill.
  > Acceptance criteria: Given I enter a bill of $100 with $10 tax and select 20% tip, when I choose 'Tip on pre-tax amount', then the tip is calculated as $18 (20% of $90) instead of $20."
- Implemented `tipOnPreTax` toggle with configurable `taxAmount`.
- When active: $\text{Subtotal} = \text{Bill Amount} - \text{Tax Amount}$, $\text{Tip} = \text{Subtotal} \times \text{Tip \%}$.

### Iteration 3: UI & Styling Resolution
- Encountered CSS module resolution issue when old paths (`./app.css`) were referenced.
- Centralized Tailwind CSS v4 in `src/app/globals.css` with custom animations (`animate-shake`, `animate-fadeIn`).
- Updated `src/app/layout.tsx` to reference `./globals.css`.
- Crafted sleek dark mode theme with Lucide icons (`DollarSign`, `Percent`, `Users`, `Receipt`, `Copy`, `RotateCcw`).

### Iteration 4: Unit Testing & Verification
- Authored 11 comprehensive Vitest tests in `tests/calculator.test.ts`:
  - Standard tipping and split calculations.
  - Acceptance criteria validation for pre-tax tipping ($100 bill, $10 tax, 20% tip = $18 tip).
  - Rounding modes (round total vs round each person).
  - Division by zero prevention.
  - Formatter verification.
- Ran test suite: All 11 tests passed successfully.

---

## 3. Product Documentation Authoring
- Created `docs/app-roles.md` detailing Solo Diner, Group Bill Payer, Budget-Conscious Diner, and Fair-Share Advocate.
- Created `docs/jobs-to-be-done.md` with JTBD framework statements.
- Created `docs/user-stories.md` with acceptance criteria for all implemented features.
- Created `README.md` explaining the rationale, setup instructions, and architecture.
