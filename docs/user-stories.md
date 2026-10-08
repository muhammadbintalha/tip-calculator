# User Stories & Acceptance Criteria

All user stories marked as **[Implemented]** below have been tested and verified to work exactly as described.

---

## Story US-1: Bill Amount Entry & Validation [Implemented]

**As a** diner,  
**I want to** enter my bill amount,  
**so that** the app has a base figure to calculate tip and split amounts.

**Acceptance Criteria:**
- Given I enter a valid number (e.g. `100.00`), when the app processes it, then the tip and totals are updated instantly.
- Given I enter an empty value or zero, when the app processes it, then a clear error message is displayed: `"Please enter a bill amount"` or `"Bill amount must be greater than $0.00"`.
- Given I enter negative numbers or non-numeric characters, when the app processes it, then an error message is shown and the app does not crash or produce `NaN`.

---

## Story US-2: Tip Percentage Selection & Custom Entry [Implemented]

**As a** diner,  
**I want to** select common tip percentages (10%, 15%, 18%, 20%, 25%) or type a custom percentage,  
**so that** I can tip according to the service level and my budget.

**Acceptance Criteria:**
- Given I click a preset button (e.g. `15%`), when clicked, then the button is highlighted and the tip recalculates immediately.
- Given I enter a custom percentage (e.g. `22%`), when typed, then the custom tip is applied and presets are unhighlighted.
- Given I enter an invalid custom tip (negative or >200%), when typed, then an error message prevents invalid calculation.

---

## Story US-3: Split Bill Among People (Division by Zero Prevention) [Implemented]

**As a** Group Bill Payer,  
**I want to** specify the number of people sharing the bill using inputs or increment/decrement buttons,  
**so that** each person knows their exact fair share.

**Acceptance Criteria:**
- Given a bill of $100 and a tip of 15% ($115 total) and 2 people, when calculated, then the per-person total is $57.50 ($50.00 bill + $7.50 tip).
- Given the user attempts to enter 0 or a negative number of people, when evaluated, then the app displays `"Number of people must be at least 1 (cannot divide by zero)"` and prevents division by zero.
- Given I click the `+` or `-` buttons, when clicked, then the count increases or decreases safely (minimum 1).

---

## Story US-4: Exclude Tax from Tip Calculation (Pre-Tax Tipping) [Implemented]

**As a** Bill Payer,  
**I want to** exclude tax from the tip calculation,  
**so that** I tip only on the service amount rather than the total bill.

**Acceptance Criteria:**
- Given I enter a bill of $100 with $10 tax and select 20% tip, when I choose "Tip on pre-tax amount", then the tip is calculated as $18 (20% of $90) instead of $20.
- Given "Tip on pre-tax amount" is disabled, when calculated with the same $100 bill and 20% tip, then the tip is calculated as $20.00.
- Given the entered tax is greater than or equal to the bill, when evaluated, then a validation warning is displayed: `"Tax amount must be less than the total bill amount"`.

---

## Story US-5: Rounding Total or Per-Person Up [Implemented]

**As a** diner paying with cash or digital apps,  
**I want to** round the total bill or the per-person share up to the nearest dollar,  
**so that** settling the bill is clean without counting small cents.

**Acceptance Criteria:**
- Given a bill of $45.60 with 15% tip ($52.44 raw total), when I select "Round Total", then the total is rounded up to $53.00 and the tip is adjusted to $7.40.
- Given a split bill resulting in $38.33 per person for 3 people, when I select "Round Each", then each person owes $39.00 and total is adjusted to $117.00.
- Given I select "Exact Cents", when clicked, then standard two-decimal precision is restored.

---

## Story US-6: Copy Bill Split Summary [Implemented]

**As a** Group Bill Payer,  
**I want to** copy the itemized bill split to my clipboard with one click,  
**so that** I can paste it into WhatsApp, iMessage, or group chats for easy reimbursement.

**Acceptance Criteria:**
- Given a completed calculation, when I click "Copy Breakdown for Group", then formatted text is copied to the clipboard.
- Given the button is clicked, when copied, then a checkmark confirmation appears for 2 seconds.
