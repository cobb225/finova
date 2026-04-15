"use client";

export default function PricingPage() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Essential tools for managing your personal finances.",
      features: [
        "Transaction Tracking",
        "Budget Management",
        "Financial Goals",
        "Basic Reports",
        "Manual Account Tracking",
      ],
      buttonText: "Get Started",
      highlighted: false,
    },
    {
      name: "Premium",
      price: "$9.99/mo",
      description: "Advanced tools for deeper insights and automation.",
      features: [
        "Everything in Free",
        "AI Smart Categorization",
        "Advanced Reports & Analytics",
        "Net Worth Tracking",
        "Bill Reminders & Notifications",
        "Bank Integration (Coming Soon)",
        "Priority Support",
      ],
      buttonText: "Upgrade to Premium",
      highlighted: true,
    },
  ];

  return (
    <main className="min-h-screen p-6 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold">Finova Pricing</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Choose the plan that fits your financial journey.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-2xl border p-8 shadow-sm transition ${
              plan.highlighted
                ? "border-blue-600 shadow-lg"
                : "border-gray-200 dark:border-gray-700"
            }`}
          >
            <h2 className="text-2xl font-semibold">{plan.name}</h2>
            <p className="text-3xl font-bold mt-2">{plan.price}</p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {plan.description}
            </p>

            <ul className="mt-6 space-y-2">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <span className="text-green-500">✔</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              className={`mt-6 w-full py-3 rounded-lg font-medium transition ${
                plan.highlighted
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-200 dark:bg-gray-800 dark:text-white"
              }`}
            >
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
