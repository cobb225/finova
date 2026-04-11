export default function Dashboard() {
  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl shadow">
          <h2 className="text-sm text-gray-500">Total Balance</h2>
          <p className="text-2xl font-semibold">$0.00</p>
        </div>
        <div className="p-4 bg-white rounded-xl shadow">
          <h2 className="text-sm text-gray-500">Monthly Income</h2>
          <p className="text-2xl font-semibold">$0.00</p>
        </div>
        <div className="p-4 bg-white rounded-xl shadow">
          <h2 className="text-sm text-gray-500">Monthly Expenses</h2>
          <p className="text-2xl font-semibold">$0.00</p>
        </div>
        <div className="p-4 bg-white rounded-xl shadow">
          <h2 className="text-sm text-gray-500">Net Savings</h2>
          <p className="text-2xl font-semibold">$0.00</p>
        </div>
      </div>
    </main>
  );
}
