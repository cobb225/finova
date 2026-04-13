"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Account {
  id: string;
  name: string;
  balance: number;
  type: string;
}

export default function NetWorthPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [assets, setAssets] = useState(0);
  const [liabilities, setLiabilities] = useState(0);

  const fetchAccounts = async () => {
    const { data, error } = await supabase
      .from("accounts")
      .select("*");

    if (error) {
      console.error("Error fetching accounts:", error);
      return;
    }

    const accountData = data || [];
    setAccounts(accountData);

    const totalAssets = accountData
      .filter((acc) => acc.type !== "liability")
      .reduce((sum, acc) => sum + Number(acc.balance), 0);

    const totalLiabilities = accountData
      .filter((acc) => acc.type === "liability")
      .reduce((sum, acc) => sum + Number(acc.balance), 0);

    setAssets(totalAssets);
    setLiabilities(totalLiabilities);
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const netWorth = assets - liabilities;

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Net Worth</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold">Total Assets</h2>
          <p className="text-2xl font-bold text-green-600">
            ${assets.toFixed(2)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold">Total Liabilities</h2>
          <p className="text-2xl font-bold text-red-600">
            ${liabilities.toFixed(2)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold">Net Worth</h2>
          <p className="text-2xl font-bold text-blue-600">
            ${netWorth.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Accounts</h2>
        {accounts.length === 0 ? (
          <p className="text-gray-500">No accounts added yet.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Name</th>
                <th className="text-left py-2">Type</th>
                <th className="text-left py-2">Balance</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((account) => (
                <tr key={account.id} className="border-b">
                  <td className="py-2">{account.name}</td>
                  <td className="py-2 capitalize">{account.type}</td>
                  <td className="py-2 font-medium">
                    ${Number(account.balance).toFixed(2)}
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
