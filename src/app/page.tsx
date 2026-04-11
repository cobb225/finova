export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold text-blue-600">Finova</h1>
      <p className="mt-4 text-lg text-gray-600 text-center">
        Your smart personal budgeting and financial planning app.
      </p>
      <div className="mt-6">
        <a
          href="/dashboard"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          Go to Dashboard
        </a>
      </div>
    </main>
  );
}
