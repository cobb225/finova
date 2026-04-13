"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Goal {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [form, setForm] = useState({
    name: "",
    target_amount: "",
    current_amount: "",
  });

  const fetchGoals = async () => {
    const { data, error } = await supabase.from("goals").select("*");
    if (error) {
      console.error("Error fetching goals:", error);
    } else {
      setGoals(data || []);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const addGoal = async (e: React.FormEvent) => {
    e.preventDefault();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase.from("goals").insert([
      {
        user_id: user.id,
        name: form.name,
        target_amount: parseFloat(form.target_amount),
        current_amount: parseFloat(form.current_amount),
      },
    ]);

    if (error) {
      console.error("Error adding goal:", error);
    } else {
      setForm({ name: "", target_amount: "", current_amount: "" });
      fetchGoals();
    }
  };

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Financial Goals</h1>

      <form
        onSubmit={addGoal}
        className="bg-white p-6 rounded-xl shadow mb-6 space-y-4"
      >
        <input
          type="text"
          placeholder="Goal Name"
          className="w-full border p-3 rounded"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Target Amount"
          className="w-full border p-3 rounded"
          value={form.target_amount}
          onChange={(e) =>
            setForm({ ...form, target_amount: e.target.value })
          }
          required
        />
        <input
          type="number"
          placeholder="Current Amount"
          className="w-full border p-3 rounded"
          value={form.current_amount}
          onChange={(e) =>
            setForm({ ...form, current_amount: e.target.value })
          }
          required
        />
        <button className="w-full bg-blue-600 text-white py-3 rounded-lg">
          Add Goal
        </button>
      </form>

      <div className="bg-white p-6 rounded-xl shadow">
        {goals.length === 0 ? (
          <p className="text-gray-500">No goals added yet.</p>
        ) : (
          goals.map((goal) => {
            const progress =
              (goal.current_amount / goal.target_amount) * 100;

            return (
              <div key={goal.id} className="mb-4">
                <p className="font-medium">{goal.name}</p>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-500 h-3 rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  ${goal.current_amount} of ${goal.target_amount}
                </p>
              </div>
            );
          })
        )}
      </div>
    </main>
  );
}
