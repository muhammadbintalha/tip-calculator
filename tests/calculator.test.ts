import { describe, it, expect } from 'vitest';
import {
  calculateTipSplit,
  validateBillAmount,
  validateTipPercentage,
  validateNumberOfPeople,
  validateTaxAmount,
  formatCurrency,
} from '../src/lib/calculations';

describe('Tip and Bill Splitter Calculations', () => {
  it('calculates standard tip and per-person split correctly', () => {
    // Bill $100, 15% tip, 2 people
    const result = calculateTipSplit({
      billAmount: 100,
      tipPercentage: 15,
      numberOfPeople: 2,
    });

    expect(result.tipAmount).toBe(15.0);
    expect(result.total).toBe(115.0);
    expect(result.perPersonTotal).toBe(57.5);
    expect(result.perPersonBill).toBe(50.0);
    expect(result.perPersonTip).toBe(7.5);
  });

  it('calculates tip on pre-tax amount matching acceptance criteria', () => {
    // Acceptance criteria: Given I enter a bill of $100 with $10 tax and select 20% tip,
    // when I choose "Tip on pre-tax amount", then the tip is calculated as $18 (20% of $90) instead of $20.
    const result = calculateTipSplit({
      billAmount: 100,
      tipPercentage: 20,
      numberOfPeople: 2,
      taxAmount: 10,
      tipOnPreTax: true,
    });

    expect(result.subtotal).toBe(90.0); // $100 - $10
    expect(result.tipAmount).toBe(18.0); // 20% of $90
    expect(result.total).toBe(118.0); // $100 bill + $18 tip
    expect(result.perPersonTotal).toBe(59.0); // $118 / 2
  });

  it('calculates normal tip when tipOnPreTax is false', () => {
    // $100 bill with $10 tax, but tipOnPreTax is false -> 20% on $100 = $20
    const result = calculateTipSplit({
      billAmount: 100,
      tipPercentage: 20,
      numberOfPeople: 2,
      taxAmount: 10,
      tipOnPreTax: false,
    });

    expect(result.tipAmount).toBe(20.0);
    expect(result.total).toBe(120.0);
    expect(result.perPersonTotal).toBe(60.0);
  });

  it('supports rounding total up to the nearest dollar', () => {
    // Bill $45.60, 15% tip ($6.84) -> Total $52.44 -> Round up total to $53.00
    const result = calculateTipSplit({
      billAmount: 45.6,
      tipPercentage: 15,
      numberOfPeople: 1,
      roundUp: 'total',
    });

    expect(result.total).toBe(53.0);
    expect(result.tipAmount).toBe(7.4); // adjusted tip to meet rounded total
  });

  it('supports rounding per-person up to the nearest dollar', () => {
    // Bill $100, 15% tip ($15) -> Total $115 -> 3 people = $38.33 each -> Round each to $39.00
    const result = calculateTipSplit({
      billAmount: 100,
      tipPercentage: 15,
      numberOfPeople: 3,
      roundUp: 'perPerson',
    });

    expect(result.perPersonTotal).toBe(39.0);
    expect(result.total).toBe(117.0); // 3 * 39
  });

  it('prevents division by zero when numberOfPeople is 0 or negative', () => {
    const result = calculateTipSplit({
      billAmount: 50,
      tipPercentage: 10,
      numberOfPeople: 0,
    });

    // Should safely default to at least 1 person, never NaN or Infinity
    expect(result.perPersonTotal).toBe(55.0);
    expect(isFinite(result.perPersonTotal)).toBe(true);
  });
});

describe('Validation Logic', () => {
  it('validates bill amount correctly', () => {
    expect(validateBillAmount('')).not.toBeNull();
    expect(validateBillAmount('-5')).not.toBeNull();
    expect(validateBillAmount('0')).not.toBeNull();
    expect(validateBillAmount('abc')).not.toBeNull();
    expect(validateBillAmount('50.25')).toBeNull();
  });

  it('validates tip percentage correctly', () => {
    expect(validateTipPercentage(-1)).not.toBeNull();
    expect(validateTipPercentage(250)).not.toBeNull();
    expect(validateTipPercentage(15)).toBeNull();
    expect(validateTipPercentage(0)).toBeNull();
  });

  it('validates number of people correctly (preventing division by zero)', () => {
    expect(validateNumberOfPeople(0)).not.toBeNull();
    expect(validateNumberOfPeople(-2)).not.toBeNull();
    expect(validateNumberOfPeople(1.5)).not.toBeNull();
    expect(validateNumberOfPeople(4)).toBeNull();
  });

  it('validates tax amount relative to bill', () => {
    expect(validateTaxAmount(-1, 100)).not.toBeNull();
    expect(validateTaxAmount(105, 100)).not.toBeNull();
    expect(validateTaxAmount(10, 100)).toBeNull();
  });
});

describe('Currency Formatter', () => {
  it('formats USD values cleanly', () => {
    expect(formatCurrency(50)).toBe('$50.00');
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
    expect(formatCurrency(0)).toBe('$0.00');
  });
});
