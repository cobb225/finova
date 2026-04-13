"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Bill {
  id: string;
  name: string;
  amount: number;
  due_date: string;
  frequency: string;
  status: string;
}

export default function BillsPage() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [form, setForm] = useState({
    name: "",
    amount: "",
    due_date: "",
    frequency: "monthly",
  });

  const fetchBills = async () => {
    const { data, error } = await supabase
      .from("bills")
      .select("*")
      .order("due_date", { ascending: true });

    if (error) {
      console.error("Error fetching bills:", error);
    } else {
      setBills(data || []);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addBill = async (e: React.FormEvent) => {
    e.preventDefault();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("You must be logged in.");
      return;
    }

    const { error } = await supabase.from("bills").insert([
      {
        user_id: user.id,
        name: form.name,
        amount: parseFloat(form.amount),
        due_date: form.due_date,
        frequency: form.frequency,
        status: "unpaid",
      },
    ]);

    if (error) {
      console.error("Error adding bill:", error);
    } else {
      setForm({
        name: "",
        amount: "",
        due_date: "",
        frequency: "monthly",
      });
      fetchBills();
    }
  };

  const toggleStatus = async (id: string, status: string) => {
    const newStatus = status === "paid" ? "unpaid" : "paid";

    const { error } = await supabase
      .from("bills")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      console.error("Error updating bill:", error);
    } else {
      fetchBills();
    }
  };

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Bills & Subscriptions</h1>

      <form
        onSubmit={addBill}
        className="bg-white p-6 rounded-xl shadow mb-6 space-y-4"
      >
        <input
          type="text"
          name="name"
          placeholder="Bill Name"
          value={form.name}
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
          required
        />

        <input
          type="date"
          name="due_date"
          value={form.due_date}
          onChange={handleChange}
          className="w-full border p-3 rounded"
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
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg"
        >
          Add Bill
        </button>
      </form>

      <div className="bg-white p-6 rounded-xl shadow">
        {bills.length === 0 ? (
          <p className="text-gray-500">No bills added yet.</p>
        ) : (
          bills.map((bill) => (
            <div
              key={bill.id}
              className="flex justify-between items-center border-b py-2"
            >
              <div>
                <p className="font-medium">{bill.name}</p>
                <p className="text-sm text-gray-500">
                  ${bill.amount} • Due {bill.due_date}
                </p>
              </div>
              <button
                onClick={() => toggleStatus(bill.id, bill.status)}
                className={
                  bill.status === "paid"
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {bill.status}
              </button>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
