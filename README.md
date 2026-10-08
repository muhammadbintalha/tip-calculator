# Tip & Bill Splitter Calculator

**Candidate:** Talha Sadiq  
**Project:** `talha-sadiq-calculator`  
**Take-Home Assignment:** KnowledgeCity, Technology Division  

---

## 🎯 Choice of Calculator & Problem Solved

### Why a Tip & Bill Splitter?
Dining out in groups is one of the most common everyday financial interactions, yet it is notoriously prone to friction:
1. **Unfair Bill Splitting**: People often struggle to do mental arithmetic for percentage tips and even splits under pressure.
2. **The "Tax on Tip" Penalty**: Standard receipt suggested tips usually apply tip percentages to the post-tax bill, effectively making diners pay a tip on top of government taxes.
3. **Budget Consciousness**: Diners on a tight budget need real-time clarity on how different tip percentages alter their personal share.
4. **Settling Up Hassle**: Splitting cash or peer-to-peer payments often causes loose-change awkwardness unless rounded up cleanly.

This app solves these exact pain points by providing instant, transparent tip calculation, fair pre-tax tipping options, split-bill allocation with zero-division safeguards, rounding options, and one-click copyable summaries for group chats.

---

## 📁 Project Structure

```
talha-sadiq-calculator/
│
├── README.md                      # Project documentation, instructions & rationale
├── package.json                   # Dependencies, scripts, and Vitest test runner
├── next.config.ts                 # Next.js configuration
├── tsconfig.json                  # TypeScript configuration
├── eslint.config.mjs              # ESLint configuration
│
├── src/
│   ├── app/
│   │   ├── globals.css            # Tailwind CSS v4 styling & animations
│   │   ├── layout.tsx             # Root layout with dark theme & metadata
│   │   └── page.tsx               # Next.js entry page rendering TipCalculator
│   │
│   ├── components/
│   │   └── TipCalculator.tsx      # Main reactive Tip Calculator UI component
│   │
│   ├── lib/
│   │   └── calculations.ts        # Centralized mathematical logic & validators
│   │
│   └── types/
│       └── calculator.ts          # Centralized TypeScript interfaces
│
├── tests/
│   └── calculator.test.ts         # Vitest unit test suite (11/11 tests passing)
│
├── docs/
│   ├── app-roles.md               # User personas (Solo Diner, Budget-Conscious, Bill Payer)
│   ├── jobs-to-be-done.md         # Jobs to Be Done (JTBD) framework
│   └── user-stories.md            # User stories with acceptance criteria
│
└── transcripts/
    └── session-01.md              # AI coding session transcript & prompt progression
```

---

## 🚀 How to Run the App (No Paid Accounts or Keys Required)

### Prerequisites
- Node.js (v18.x, v20.x, or v22.x)
- npm (comes bundled with Node.js)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start the Development Server
```bash
npm run dev
```

Open your browser (Chrome, Edge, Firefox, or Safari) and navigate to:
```
http://localhost:3000
```

### Step 3: Run the Automated Test Suite
```bash
npm test
```

### Step 4: Build for Production (Optional)
```bash
npm run build
npm run start
```

---

## ✅ Implemented User Stories

All user stories listed in `docs/user-stories.md` are marked as **[Implemented]** and verified in the live app:

- [x] **US-1: Bill Amount Entry & Validation**: Real-time validation preventing negative, empty, or non-numeric values.
- [x] **US-2: Tip Percentage Selection & Custom Entry**: Quick-select buttons (10%, 15%, 18%, 20%, 25%) and custom percentage input.
- [x] **US-3: Split Bill Among People**: Flexible split between 1 to 100 people with increment/decrement buttons and strict division-by-zero protection.
- [x] **US-4: Pre-Tax Tipping (Exclude Tax from Tip)**: Allows users to input tax amount and calculate tip solely on the food/beverage subtotal (e.g. $100 bill with $10 tax and 20% tip yields $18 tip on $90 pre-tax subtotal).
- [x] **US-5: Rounding Preferences**: Options for Exact Cents, Round Total Up, and Round Each Person Up.
- [x] **US-6: One-Click Summary Copy**: Generates formatted breakdown ready to paste into WhatsApp/SMS.

---

## 🛡️ Error Prevention & Defensive Code

- **Division by Zero**: If 0 or negative people are entered, input is caught by validation and safely defaults to 1 without crashing or returning `NaN` or `Infinity`.
- **Negative Values**: Prevented for bill, tip, tax, and people count.
- **Tax Cap**: Enforces that tax must be less than the total bill amount.

---

## 🤖 AI Tool Usage

- **AI Tool Used**: Antigravity (Powered by Google DeepMind)
- **Role of the Human**: Directed the problem scope, specified the user personas, defined acceptance criteria (such as pre-tax tipping and rounding), reviewed UI responsiveness, and validated test cases.
- **Manual Code Changes**: None. All code, tests, and documentation were directed and generated through the AI pair programming session as recorded in `transcripts/session-01.md`.
# tip-calculator
