"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Budget {
  id: string;
  category: string;
  limit_amount: number;
  frequency: string;
  recurring: boolean;
}

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [form, setForm] = useState({
    category: "",
    limit_amount: "",
    frequency: "monthly",
    recurring: true,
  });

  const fetchBudgets = async () => {
    const { data, error } = await supabase
      .from("budgets")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching budgets:", error);
    } else {
      setBudgets(data || []);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const addBudget = async (e: React.FormEvent) => {
    e.preventDefault();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("You must be logged in.");
      return;
    }

    const { error } = await supabase.from("budgets").insert([
      {
        user_id: user.id,
        category: form.category,
        limit_amount: parseFloat(form.limit_amount),
        frequency: form.frequency,
        recurring: form.recurring,
      },
    ]);

    if (error) {
      console.error("Error adding budget:", error);
      alert("Failed to add budget.");
    } else {
      setForm({
        category: "",
        limit_amount: "",
        frequency: "monthly",
        recurring: true,
      });
      fetchBudgets();
    }
  };

  const deleteBudget = async (id: string) => {
    const { error } = await supabase
      .from("budgets")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting budget:", error);
    } else {
      fetchBudgets();
    }
  };

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Budgets</h1>

      {/* Add Budget Form */}
      <form
        onSubmit={addBudget}
        className="bg-white p-6 rounded-xl shadow mb-6 space-y-4"
      >
        <h2 className="text-xl font-semibold">Create Budget</h2>

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
          name="limit_amount"
          placeholder="Budget Limit"
          value={form.limit_amount}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          step="0.01"
          required
        />

        <select
          name="frequency"
          value={form.frequency}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        >
          <option value="weekly">Weekly</option>
          <option value="bi-weekly">Bi-Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
          <option value="yearly">Yearly</option>
          <option value="one-time">One-Time</option>
        </select>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="recurring"
            checked={form.recurring}
            onChange={handleChange}
          />
          Recurring Budget
        </label>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
        >
          Add Budget
        </button>
      </form>

      {/* Budget List */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Your Budgets</h2>

        {budgets.length === 0 ? (
          <p className="text-gray-500">No budgets created yet.</p>
        ) : (
          <ul className="space-y-3">
            {budgets.map((budget) => (
              <li
                key={budget.id}
                className="flex justify-between items-center border-b pb-2"
              >
                <div>
                  <p className="font-medium">{budget.category}</p>
                  <p className="text-sm text-gray-500">
                    ${budget.limit_amount.toFixed(2)} • {budget.frequency}
                  </p>
                </div>
                <button
                  onClick={() => deleteBudget(budget.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
