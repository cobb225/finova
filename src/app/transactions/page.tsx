"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Transaction {
  id: string;
  date: string;
  type: string;
  category: string;
  amount: number;
  notes: string;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [form, setForm] = useState({
    date: "",
    type: "expense",
    category: "",
    amount: "",
    notes: "",
  });

  const fetchTransactions = async () => {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      console.error("Error fetching transactions:", error);
    } else if (data) {
      setTransactions(data);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addTransaction = async (e: React.FormEvent) => {
    e.preventDefault();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("You must be logged in to add a transaction.");
      return;
    }

    const { error } = await supabase.from("transactions").insert([
      {
        user_id: user.id,
        date: form.date,
        type: form.type,
        category: form.category,
        amount: parseFloat(form.amount),
        notes: form.notes,
      },
    ]);

    if (error) {
      console.error("Error adding transaction:", error);
      alert("Failed to add transaction.");
    } else {
      setForm({
        date: "",
        type: "expense",
        category: "",
        amount: "",
        notes: "",
      });
      fetchTransactions();
    }
  };

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Transactions</h1>

      {/* Add Transaction Form */}
      <form
        onSubmit={addTransaction}
        className="bg-white p-6 rounded-xl shadow mb-6 space-y-4"
      >
        <h2 className="text-xl font-semibold">Add Transaction</h2>

        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        />

        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
          <option value="transfer">Transfer</option>
          <option value="investment">Investment</option>
          <option value="savings">Savings</option>
        </select>

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        />

        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          step="0.01"
          required
        />

        <input
          type="text"
          name="notes"
          placeholder="Notes (Optional)"
          value={form.notes}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Add Transaction
        </button>
      </form>

      {/* Transactions List */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Transaction History</h2>

        {transactions.length === 0 ? (
          <p className="text-gray-500">No transactions yet.</p>
        ) : (
          <ul className="space-y-3">
            {transactions.map((tx) => (
              <li
                key={tx.id}
                className="flex justify-between items-center border-b pb-2"
              >
                <div>
                  <p className="font-medium">{tx.category}</p>
                  <p className="text-sm text-gray-500">
                    {tx.date} • {tx.type}
                  </p>
                </div>
                <p
                  className={`font-semibold ${
                    tx.type === "income"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  ${tx.amount.toFixed(2)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
