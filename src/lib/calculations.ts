import { CalculationResult, CalculationError, TipCalculatorInputs } from '@/types/calculator';

export function validateBillAmount(billStr: string | number): CalculationError | null {
  const str = String(billStr).trim();
  if (!str) {
    return { field: 'bill', message: 'Please enter a bill amount' };
  }

  const amount = parseFloat(str);

  if (isNaN(amount)) {
    return { field: 'bill', message: 'Bill amount must be a valid number' };
  }

  if (amount <= 0) {
    return { field: 'bill', message: 'Bill amount must be greater than $0.00' };
  }

  if (amount > 1000000) {
    return { field: 'bill', message: 'Bill amount exceeds maximum allowable limit' };
  }

  return null;
}

export function validateTipPercentage(tipPercentage: number): CalculationError | null {
  if (isNaN(tipPercentage)) {
    return { field: 'tip', message: 'Please enter a valid tip percentage' };
  }

  if (tipPercentage < 0) {
    return { field: 'tip', message: 'Tip percentage cannot be negative' };
  }

  if (tipPercentage > 200) {
    return { field: 'tip', message: 'Tip percentage cannot exceed 200%' };
  }

  return null;
}

export function validateNumberOfPeople(numberOfPeople: number): CalculationError | null {
  if (isNaN(numberOfPeople)) {
    return { field: 'people', message: 'Please enter the number of people' };
  }

  if (numberOfPeople < 1) {
    return { field: 'people', message: 'Number of people must be at least 1 (cannot divide by zero)' };
  }

  if (!Number.isInteger(numberOfPeople)) {
    return { field: 'people', message: 'Number of people must be a whole number' };
  }

  if (numberOfPeople > 100) {
    return { field: 'people', message: 'Number of people cannot exceed 100' };
  }

  return null;
}

export function validateTaxAmount(taxAmount: number, billAmount: number): CalculationError | null {
  if (isNaN(taxAmount) || taxAmount < 0) {
    return { field: 'tax', message: 'Tax amount cannot be negative' };
  }

  if (taxAmount >= billAmount) {
    return { field: 'tax', message: 'Tax amount must be less than the total bill amount' };
  }

  return null;
}

/**
 * Calculates tip and bill split per person with support for pre-tax tipping and rounding.
 */
export function calculateTipSplit(inputs: {
  billAmount: number;
  tipPercentage: number;
  numberOfPeople: number;
  taxAmount?: number;
  tipOnPreTax?: boolean;
  roundUp?: 'none' | 'total' | 'perPerson';
}): CalculationResult {
  const {
    billAmount,
    tipPercentage,
    numberOfPeople,
    taxAmount = 0,
    tipOnPreTax = false,
    roundUp = 'none',
  } = inputs;

  const safePeople = Math.max(1, Math.floor(numberOfPeople));
  const safeTax = Math.max(0, taxAmount);

  // Pre-tax base amount if user elects to exclude tax from tip calculation
  const tipBaseAmount = tipOnPreTax ? Math.max(0, billAmount - safeTax) : billAmount;

  // Calculate raw tip
  let rawTip = tipBaseAmount * (tipPercentage / 100);
  let rawTotal = billAmount + rawTip;
  let rawPerPerson = rawTotal / safePeople;

  // Handle rounding options
  if (roundUp === 'total') {
    const roundedTotal = Math.ceil(rawTotal);
    rawTip = roundedTotal - billAmount;
    rawTotal = roundedTotal;
    rawPerPerson = rawTotal / safePeople;
  } else if (roundUp === 'perPerson') {
    const roundedPerPerson = Math.ceil(rawPerPerson);
    rawTotal = roundedPerPerson * safePeople;
    rawTip = rawTotal - billAmount;
    rawPerPerson = roundedPerPerson;
  }

  const finalTip = Math.round(rawTip * 100) / 100;
  const finalTotal = Math.round(rawTotal * 100) / 100;
  const perPersonTotal = Math.round(rawPerPerson * 100) / 100;
  const perPersonBill = Math.round((billAmount / safePeople) * 100) / 100;
  const perPersonTip = Math.round((finalTip / safePeople) * 100) / 100;
  const effectiveTipPercentage = billAmount > 0 ? Math.round((finalTip / billAmount) * 1000) / 10 : 0;

  return {
    billAmount: Math.round(billAmount * 100) / 100,
    tipAmount: finalTip,
    taxAmount: Math.round(safeTax * 100) / 100,
    subtotal: Math.round(tipBaseAmount * 100) / 100,
    total: finalTotal,
    perPersonBill,
    perPersonTip,
    perPersonTotal,
    effectiveTipPercentage,
    isPreTaxTip: tipOnPreTax,
    roundingApplied: roundUp,
  };
}

export function formatCurrency(amount: number): string {
  if (isNaN(amount)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
