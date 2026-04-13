"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Transaction {
  id: string;
  date: string;
  category: string;
  type: string;
  amount: number;
}

export default function HistoryPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const fetchTransactions = async () => {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      console.error("Error fetching history:", error);
    } else {
      setTransactions(data || []);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Financial History</h1>

      <div className="bg-white p-6 rounded-xl shadow">
        {transactions.length === 0 ? (
          <p className="text-gray-500">No transaction history available.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Date</th>
                <th className="text-left py-2">Category</th>
                <th className="text-left py-2">Type</th>
                <th className="text-left py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-b">
                  <td className="py-2">{tx.date}</td>
                  <td className="py-2">{tx.category}</td>
                  <td className="py-2 capitalize">{tx.type}</td>
                  <td
                    className={`py-2 font-medium ${
                      tx.type === "income"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
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
