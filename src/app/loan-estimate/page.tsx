"use client";

import { useState } from "react";

export default function LoanEstimatePage() {
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [termMonths, setTermMonths] = useState("");
  const [result, setResult] = useState<any>(null);

  const calculateLoan = () => {
    const P = parseFloat(loanAmount);
    const r = parseFloat(interestRate) / 100 / 12;
    const n = parseFloat(termMonths);

    if (!P || !r || !n) return;

    const monthlyPayment =
      (P * r * Math.pow(1 + r, n)) /
      (Math.pow(1 + r, n) - 1);

    const totalPaid = monthlyPayment * n;
    const totalInterest = totalPaid - P;

    setResult({
      monthlyPayment,
      totalPaid,
      totalInterest,
    });
  };

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        Loan Estimate Calculator
      </h1>

      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <input
          type="number"
          placeholder="Loan Amount"
          className="w-full border p-3 rounded"
          onChange={(e) => setLoanAmount(e.target.value)}
        />
        <input
          type="number"
          placeholder="Interest Rate (%)"
          className="w-full border p-3 rounded"
          onChange={(e) => setInterestRate(e.target.value)}
        />
        <input
          type="number"
          placeholder="Loan Term (Months)"
          className="w-full border p-3 rounded"
          onChange={(e) => setTermMonths(e.target.value)}
        />

        <button
          onClick={calculateLoan}
          className="w-full bg-blue-600 text-white py-3 rounded-lg"
        >
          Calculate
        </button>

        {result && (
          <div className="pt-4 space-y-2">
            <p>
              Monthly Payment: ${result.monthlyPayment.toFixed(2)}
            </p>
            <p>Total Paid: ${result.totalPaid.toFixed(2)}</p>
            <p>
              Total Interest: ${result.totalInterest.toFixed(2)}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
