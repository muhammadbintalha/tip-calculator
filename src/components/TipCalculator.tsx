'use client';

import { useState, useMemo } from 'react';
import {
  validateBillAmount,
  validateTipPercentage,
  validateNumberOfPeople,
  validateTaxAmount,
  calculateTipSplit,
  formatCurrency,
} from '@/lib/calculations';
import { CalculationError } from '@/types/calculator';
import {
  DollarSign,
  Percent,
  Users,
  AlertCircle,
  Check,
  Copy,
  RotateCcw,
  Sparkles,
  Receipt,
  Plus,
  Minus,
} from 'lucide-react';

const TIP_OPTIONS = [10, 15, 18, 20, 25];

export default function TipCalculator() {
  // Empty initial values so no static results are shown on first page visit
  const [billAmount, setBillAmount] = useState('');
  const [tipPercentage, setTipPercentage] = useState(15);
  const [customTip, setCustomTip] = useState('');
  const [isCustomTip, setIsCustomTip] = useState(false);
  const [numberOfPeople, setNumberOfPeople] = useState(2);
  const [tipOnPreTax, setTipOnPreTax] = useState(false);
  const [taxAmount, setTaxAmount] = useState('');
  const [roundUp, setRoundUp] = useState<'none' | 'total' | 'perPerson'>('none');
  const [copied, setCopied] = useState(false);

  const isBillEmpty = !billAmount.trim();

  // Validation: only validate when user has interacted or entered data
  const errors = useMemo(() => {
    const errs: Record<string, CalculationError> = {};

    if (isBillEmpty) {
      // Do not display error banners on pristine empty state
      return errs;
    }

    const billErr = validateBillAmount(billAmount);
    if (billErr) errs.bill = billErr;

    const tipErr = validateTipPercentage(tipPercentage);
    if (tipErr) errs.tip = tipErr;

    const peopleErr = validateNumberOfPeople(numberOfPeople);
    if (peopleErr) errs.people = peopleErr;

    if (tipOnPreTax && taxAmount.trim()) {
      const billNum = parseFloat(billAmount) || 0;
      const taxNum = parseFloat(taxAmount) || 0;
      const taxErr = validateTaxAmount(taxNum, billNum);
      if (taxErr) errs.tax = taxErr;
    }

    return errs;
  }, [billAmount, isBillEmpty, tipPercentage, numberOfPeople, tipOnPreTax, taxAmount]);

  // Calculation Result
  const result = useMemo(() => {
    if (isBillEmpty || Object.keys(errors).length > 0) return null;

    const bill = parseFloat(billAmount);
    if (isNaN(bill) || bill <= 0) return null;

    const tax = tipOnPreTax && taxAmount.trim() ? parseFloat(taxAmount) || 0 : 0;

    return calculateTipSplit({
      billAmount: bill,
      tipPercentage,
      numberOfPeople,
      taxAmount: tax,
      tipOnPreTax,
      roundUp,
    });
  }, [billAmount, isBillEmpty, tipPercentage, numberOfPeople, tipOnPreTax, taxAmount, roundUp, errors]);

  const handleTipOptionClick = (percentage: number) => {
    setIsCustomTip(false);
    setCustomTip('');
    setTipPercentage(percentage);
  };

  const handleCustomTipChange = (value: string) => {
    setIsCustomTip(true);
    setCustomTip(value);
    const num = parseFloat(value);
    if (!isNaN(num) && num >= 0) {
      setTipPercentage(num);
    }
  };

  const incrementPeople = () => {
    setNumberOfPeople((prev) => Math.min(prev + 1, 100));
  };

  const decrementPeople = () => {
    setNumberOfPeople((prev) => Math.max(prev - 1, 1));
  };

  const handleReset = () => {
    setBillAmount('');
    setTipPercentage(15);
    setCustomTip('');
    setIsCustomTip(false);
    setNumberOfPeople(2);
    setTipOnPreTax(false);
    setTaxAmount('');
    setRoundUp('none');
  };

  const copyToClipboard = () => {
    if (!result) return;
    const text = `Bill Split Summary:
• Total Bill (with tip): ${formatCurrency(result.total)}
• Total Tip: ${formatCurrency(result.tipAmount)} (${tipPercentage}%)
• Number of People: ${numberOfPeople}
• Per Person Share: ${formatCurrency(result.perPersonTotal)}${
      result.isPreTaxTip ? `\n• Tip computed on pre-tax subtotal (${formatCurrency(result.subtotal)})` : ''
    }`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between selection:bg-violet-500 selection:text-white">
      {/* Background radial glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/70 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/20">
              <Receipt className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-white">
                Tip & Bill Splitter
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs text-slate-400 font-medium border-l pl-2 border-slate-700">
                Talha Sadiq Calculator
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-100 bg-slate-800/80 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700/60 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-6 sm:p-7 shadow-xl space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-violet-400" />
                  Bill Details
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Enter your restaurant or group expense details to split the tab accurately.
                </p>
              </div>

              {/* Bill Amount */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-violet-400" />
                  Bill Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg select-none">
                    $
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={billAmount}
                    onChange={(e) => setBillAmount(e.target.value)}
                    className={`w-full pl-9 pr-4 py-3.5 bg-slate-900/90 border rounded-2xl text-xl font-bold text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all ${
                      errors.bill ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-700 focus:border-violet-500'
                    }`}
                  />
                </div>
                {errors.bill && (
                  <p className="text-xs font-semibold text-rose-400 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {errors.bill.message}
                  </p>
                )}
              </div>

              {/* Tip Percentage Selection */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Percent className="w-3.5 h-3.5 text-violet-400" />
                    Select Tip %
                  </label>
                  <span className="text-xs font-bold text-violet-400">
                    Selected: {tipPercentage}%
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {TIP_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleTipOptionClick(opt)}
                      className={`py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                        !isCustomTip && tipPercentage === opt
                          ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30 scale-[1.02]'
                          : 'bg-slate-900/80 text-slate-300 hover:bg-slate-700/80 border border-slate-700/70'
                      }`}
                    >
                      {opt}%
                    </button>
                  ))}
                </div>

                {/* Custom Tip Input */}
                <div className="pt-1">
                  <div className="relative">
                    <input
                      type="number"
                      step="1"
                      min="0"
                      max="200"
                      placeholder="Or enter custom tip %"
                      value={customTip}
                      onChange={(e) => handleCustomTipChange(e.target.value)}
                      className={`w-full pl-4 pr-9 py-2.5 bg-slate-900/70 border rounded-xl text-sm font-semibold text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all ${
                        isCustomTip ? 'border-violet-500 ring-1 ring-violet-500' : 'border-slate-700'
                      }`}
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                      %
                    </span>
                  </div>
                </div>
                {errors.tip && (
                  <p className="text-xs font-semibold text-rose-400 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {errors.tip.message}
                  </p>
                )}
              </div>

              {/* Number of People */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-violet-400" />
                  Split Among How Many People?
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={decrementPeople}
                    disabled={numberOfPeople <= 1}
                    className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-700 active:bg-slate-600 text-slate-300 disabled:opacity-30 disabled:pointer-events-none border border-slate-700 transition-colors cursor-pointer"
                    aria-label="Decrease people"
                  >
                    <Minus className="w-5 h-5" />
                  </button>

                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={numberOfPeople}
                    onChange={(e) => setNumberOfPeople(parseInt(e.target.value) || 0)}
                    className={`flex-1 text-center py-3 bg-slate-900/90 border rounded-2xl text-xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                      errors.people ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-700'
                    }`}
                  />

                  <button
                    type="button"
                    onClick={incrementPeople}
                    className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-700 active:bg-slate-600 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
                    aria-label="Increase people"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                {errors.people && (
                  <p className="text-xs font-semibold text-rose-400 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {errors.people.message}
                  </p>
                )}
              </div>

              {/* Pre-tax Tip Toggle & Tax Amount */}
              <div className="p-4 rounded-2xl border border-slate-700/80 bg-slate-900/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-sm font-semibold text-slate-200 block">
                      Tip on pre-tax amount
                    </span>
                    <span className="text-xs text-slate-400">
                      Exclude sales tax from the tip calculation so you tip only on food/drinks.
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={tipOnPreTax}
                      onChange={(e) => setTipOnPreTax(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
                  </label>
                </div>

                {tipOnPreTax && (
                  <div className="pt-2 border-t border-slate-800 space-y-1.5 animate-fadeIn">
                    <label className="text-xs font-medium text-slate-300 flex items-center gap-1">
                      Tax Included in Bill ($)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm select-none">
                        $
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={taxAmount}
                        onChange={(e) => setTaxAmount(e.target.value)}
                        className={`w-full pl-7 pr-3 py-2 bg-slate-900 border rounded-xl text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                          errors.tax ? 'border-rose-500' : 'border-slate-700'
                        }`}
                      />
                    </div>
                    {errors.tax && (
                      <p className="text-xs text-rose-400 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.tax.message}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Rounding Mode Options */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Rounding Preference
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRoundUp('none')}
                    className={`py-2 px-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      roundUp === 'none'
                        ? 'bg-violet-600 text-white'
                        : 'bg-slate-900/70 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    Exact Cents
                  </button>
                  <button
                    type="button"
                    onClick={() => setRoundUp('total')}
                    className={`py-2 px-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      roundUp === 'total'
                        ? 'bg-violet-600 text-white'
                        : 'bg-slate-900/70 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    Round Total
                  </button>
                  <button
                    type="button"
                    onClick={() => setRoundUp('perPerson')}
                    className={`py-2 px-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      roundUp === 'perPerson'
                        ? 'bg-violet-600 text-white'
                        : 'bg-slate-900/70 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    Round Each
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-5 space-y-6">
            {result ? (
              <div className="space-y-6 animate-fadeIn">
                {/* Primary Hero Result Card */}
                <div className="rounded-3xl p-7 bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 text-white shadow-2xl relative overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs uppercase font-bold tracking-widest text-violet-200">
                      Amount Each Person Owes
                    </span>
                    <span className="text-xs bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full font-semibold">
                      {numberOfPeople} {numberOfPeople === 1 ? 'person' : 'people'}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-1 my-3">
                    <span className="text-5xl font-black tracking-tight">
                      {formatCurrency(result.perPersonTotal)}
                    </span>
                    <span className="text-violet-200 text-sm font-medium">/ person</span>
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-violet-200 block">Food & Bill Portion:</span>
                      <strong className="text-sm font-bold">{formatCurrency(result.perPersonBill)}</strong>
                    </div>
                    <div>
                      <span className="text-violet-200 block">Tip Portion:</span>
                      <strong className="text-sm font-bold">{formatCurrency(result.perPersonTip)}</strong>
                    </div>
                  </div>

                  {/* Copy Button */}
                  <div className="mt-5">
                    <button
                      type="button"
                      onClick={copyToClipboard}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/30 backdrop-blur-md text-xs font-bold uppercase tracking-wider border border-white/20 transition-all cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-300" />
                          <span>Copied Summary to Clipboard!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy Breakdown for Group</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Overall Tab Summary Card */}
                <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-6 shadow-xl space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                    Grand Total Breakdown
                  </h3>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center py-1.5 border-b border-slate-700/50">
                      <span className="text-slate-400">Original Bill</span>
                      <span className="font-semibold text-slate-200">{formatCurrency(result.billAmount)}</span>
                    </div>

                    {result.isPreTaxTip && (
                      <div className="flex justify-between items-center py-1.5 border-b border-slate-700/50 text-xs">
                        <span className="text-slate-400 flex items-center gap-1">
                          Tax Excluded from Tip
                        </span>
                        <span className="text-slate-300">-{formatCurrency(result.taxAmount)}</span>
                      </div>
                    )}

                    {result.isPreTaxTip && (
                      <div className="flex justify-between items-center py-1.5 border-b border-slate-700/50 text-xs">
                        <span className="text-slate-400">Pre-tax Tipping Subtotal</span>
                        <span className="text-slate-300">{formatCurrency(result.subtotal)}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center py-1.5 border-b border-slate-700/50">
                      <span className="text-slate-400">
                        Tip Amount ({tipPercentage}%)
                      </span>
                      <span className="font-bold text-violet-400">+{formatCurrency(result.tipAmount)}</span>
                    </div>

                    {result.roundingApplied !== 'none' && (
                      <div className="flex justify-between items-center py-1.5 border-b border-slate-700/50 text-xs text-amber-400">
                        <span>Rounding Adjusted</span>
                        <span>{result.roundingApplied === 'total' ? 'Total Up' : 'Per Person Up'}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-2 text-base font-bold text-white">
                      <span>Total with Tip</span>
                      <span className="text-xl text-violet-300">{formatCurrency(result.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : hasErrors ? (
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-8 text-center space-y-3 animate-shake">
                <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
                <h3 className="text-base font-bold text-white">Please check your inputs</h3>
                <p className="text-xs text-slate-400">
                  Resolve the error indicated on the left to see your split bill and tip calculation.
                </p>
              </div>
            ) : (
              /* Clean Welcome / Empty State when user first opens the page */
              <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/60 rounded-3xl p-8 sm:p-10 text-center space-y-5 flex flex-col items-center justify-center min-h-[380px]">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600/20 to-indigo-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 shadow-inner">
                  <Receipt className="w-8 h-8" />
                </div>
                <div className="space-y-1.5 max-w-sm">
                  <h3 className="text-lg font-bold text-white">Ready to Calculate</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Enter your bill amount on the left to see the tip, total, and per-person split in real time.
                  </p>
                </div>
                <div className="w-full pt-4 border-t border-slate-700/50 grid grid-cols-2 gap-3 text-left">
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-400">
                    <span className="font-semibold text-slate-200 block mb-0.5">⚡ Live Updates</span>
                    Calculates tip and split instantly as you type.
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-400">
                    <span className="font-semibold text-slate-200 block mb-0.5">🧾 Pre-Tax Option</span>
                    Optionally exclude sales tax from the tip amount.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950/80 py-5 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Tip & Bill Splitter Calculator &bull; Talha Sadiq</span>
          <span>KnowledgeCity Take-Home Assignment</span>
        </div>
      </footer>
    </div>
  );
}
