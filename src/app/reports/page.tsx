"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Transaction {
  id: string;
  type: string;
  category: string;
  amount: number;
  date: string;
}

export default function ReportsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);

  const fetchTransactions = async () => {
    const { data, error } = await supabase
      .from("transactions")
      .select("*");

    if (error) {
      console.error("Error fetching reports:", error);
      return;
    }

    const tx = data || [];
    setTransactions(tx);

    const totalIncome = tx
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalExpenses = tx
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    setIncome(totalIncome);
    setExpenses(totalExpenses);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const netSavings = income - expenses;

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Reports & Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold">Income</h2>
          <p className="text-2xl text-green-600 font-bold">
            ${income.toFixed(2)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold">Expenses</h2>
          <p className="text-2xl text-red-600 font-bold">
            ${expenses.toFixed(2)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold">Net Savings</h2>
          <p className="text-2xl text-blue-600 font-bold">
            ${netSavings.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Transaction Summary</h2>
        {transactions.length === 0 ? (
          <p className="text-gray-500">No data available.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-2">Date</th>
                <th className="py-2">Category</th>
                <th className="py-2">Type</th>
                <th className="py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-b">
                  <td className="py-2">{tx.date}</td>
                  <td className="py-2">{tx.category}</td>
                  <td className="py-2 capitalize">{tx.type}</td>
                  <td className="py-2 font-medium">
                    ${Number(tx.amount).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
