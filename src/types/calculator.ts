export interface TipCalculatorInputs {
  billAmount: number;
  tipPercentage: number;
  numberOfPeople: number;
  taxAmount: number;
  tipOnPreTax: boolean;
  roundUp: 'none' | 'total' | 'perPerson';
}

export interface CalculationResult {
  billAmount: number;
  tipAmount: number;
  taxAmount: number;
  subtotal: number;
  total: number;
  perPersonBill: number;
  perPersonTip: number;
  perPersonTotal: number;
  effectiveTipPercentage: number;
  isPreTaxTip: boolean;
  roundingApplied: 'none' | 'total' | 'perPerson';
}

export interface CalculationError {
  field: 'bill' | 'tip' | 'people' | 'tax' | 'general';
  message: string;
}
