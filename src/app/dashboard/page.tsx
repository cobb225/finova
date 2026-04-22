"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import { supabase } from "@/lib/supabaseClient";

type Transaction = {
  id: string;
  date: string;
  type: string;
  category: string;
  amount: number;
};

type Budget = {
  id: string;
  category: string;
  limit_amount: number;
};

type Goal = {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
};

type DashboardState = {
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
};

const COLORS = ["#2563eb", "#16a34a", "#f97316", "#9333ea", "#0891b2"];

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const shortMonth = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "2-digit",
});

export default function Dashboard() {
  const [data, setData] = useState<DashboardState>({
    transactions: [],
    budgets: [],
    goals: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      const [{ data: txs, error: txErr }, { data: budgets, error: budgetErr }, { data: goals, error: goalErr }] = await Promise.all([
        supabase.from("transactions").select("id,date,type,category,amount").order("date", { ascending: false }),
        supabase.from("budgets").select("id,category,limit_amount"),
        supabase.from("goals").select("id,name,target_amount,current_amount"),
      ]);

      if (txErr || budgetErr || goalErr) {
        setError("Could not load some dashboard data. Please refresh.");
      }

      setData({
        transactions: txs ?? [],
        budgets: budgets ?? [],
        goals: goals ?? [],
      });
      setLoading(false);
    };

    loadData();
  }, []);

  const insights = useMemo(() => {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();

    const monthTransactions = data.transactions.filter((t) => {
      const d = new Date(t.date);
      return d.getMonth() === month && d.getFullYear() === year;
    });

    const income = monthTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const expenses = monthTransactions
      .filter((t) => t.type !== "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const balance = data.transactions.reduce((sum, t) => {
      return t.type === "income" ? sum + Number(t.amount) : sum - Number(t.amount);
    }, 0);

    const netSavings = income - expenses;

    const budgetMap = data.budgets.reduce<Record<string, number>>((acc, budget) => {
      acc[budget.category] = Number(budget.limit_amount);
      return acc;
    }, {});

    const spentByCategory = monthTransactions
      .filter((t) => t.type !== "income")
      .reduce<Record<string, number>>((acc, t) => {
        acc[t.category] = (acc[t.category] ?? 0) + Number(t.amount);
        return acc;
      }, {});

    const budgetProgress = Object.entries(budgetMap)
      .map(([category, limit]) => ({
        category,
        spent: spentByCategory[category] ?? 0,
        limit,
        percent: limit > 0 ? Math.round(((spentByCategory[category] ?? 0) / limit) * 100) : 0,
      }))
      .sort((a, b) => b.percent - a.percent)
      .slice(0, 5);

    const goalsProgress = data.goals.map((g) => {
      const percent = g.target_amount > 0 ? Math.min(100, Math.round((g.current_amount / g.target_amount) * 100)) : 0;
      return { ...g, percent };
    });

    const monthlyTrend = Array.from({ length: 6 }).map((_, index) => {
      const dt = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
      const m = dt.getMonth();
      const y = dt.getFullYear();
      const monthly = data.transactions.filter((t) => {
        const d = new Date(t.date);
        return d.getMonth() === m && d.getFullYear() === y;
      });
      const monthIncome = monthly.filter((t) => t.type === "income").reduce((sum, t) => sum + Number(t.amount), 0);
      const monthExpenses = monthly.filter((t) => t.type !== "income").reduce((sum, t) => sum + Number(t.amount), 0);
      return {
        month: shortMonth.format(dt),
        savings: Math.round(monthIncome - monthExpenses),
      };
    });

    const topCategories = Object.entries(spentByCategory)
      .map(([name, value]) => ({ name, value: Math.round(value) }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    return {
      balance,
      income,
      expenses,
      netSavings,
      budgetProgress,
      goalsProgress,
      monthlyTrend,
      topCategories,
    };
  }, [data]);

  if (loading) {
    return (
      <main className="p-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <p className="text-gray-500">Loading your financial snapshot...</p>
      </main>
    );
  }

  return (
    <main className="p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-sm text-gray-500">Live snapshot of your cashflow, budgets, and goals.</p>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard title="Total Balance" value={currency.format(insights.balance)} />
        <MetricCard title="Monthly Income" value={currency.format(insights.income)} />
        <MetricCard title="Monthly Expenses" value={currency.format(insights.expenses)} />
        <MetricCard
          title="Net Savings"
          value={currency.format(insights.netSavings)}
          valueClassName={insights.netSavings >= 0 ? "text-green-600" : "text-red-600"}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <section className="bg-white rounded-xl shadow p-4 xl:col-span-2">
          <h2 className="text-lg font-semibold mb-3">6-Month Savings Trend</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={insights.monthlyTrend}>
                <defs>
                  <linearGradient id="savingsFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(val: number) => currency.format(val)} />
                <Area type="monotone" dataKey="savings" stroke="#2563eb" fill="url(#savingsFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-semibold mb-3">Top Spending Categories</h2>
          {insights.topCategories.length === 0 ? (
            <p className="text-gray-500 text-sm">No expense data for this month yet.</p>
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={insights.topCategories} dataKey="value" nameKey="name" outerRadius={95} label>
                    {insights.topCategories.map((entry, index) => (
                      <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val: number) => currency.format(val)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <section className="bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-semibold mb-3">Budget Health (This Month)</h2>
          {insights.budgetProgress.length === 0 ? (
            <p className="text-gray-500 text-sm">Create budgets to track category performance.</p>
          ) : (
            <div className="space-y-4">
              {insights.budgetProgress.map((budget) => (
                <div key={budget.category}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="font-medium">{budget.category}</span>
                    <span className={budget.percent > 100 ? "text-red-600" : "text-gray-600"}>
                      {currency.format(budget.spent)} / {currency.format(budget.limit)} ({budget.percent}%)
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className={`h-2 ${budget.percent > 100 ? "bg-red-500" : budget.percent > 85 ? "bg-amber-500" : "bg-green-500"}`}
                      style={{ width: `${Math.min(100, budget.percent)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-semibold mb-3">Goal Progress</h2>
          {insights.goalsProgress.length === 0 ? (
            <p className="text-gray-500 text-sm">Add goals to monitor your savings milestones.</p>
          ) : (
            <div className="space-y-4">
              {insights.goalsProgress.map((goal) => (
                <div key={goal.id}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="font-medium">{goal.name}</span>
                    <span className="text-gray-600">{goal.percent}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                    <div className="h-2 bg-blue-500" style={{ width: `${goal.percent}%` }} />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {currency.format(goal.current_amount)} of {currency.format(goal.target_amount)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function MetricCard({
  title,
  value,
  valueClassName,
}: {
  title: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="rounded-xl bg-white p-4 shadow">
      <h2 className="text-sm text-gray-500">{title}</h2>
      <p className={`text-2xl font-semibold ${valueClassName ?? "text-gray-900"}`}>{value}</p>
    </div>
  );
}
