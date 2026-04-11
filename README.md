# Finova

Finova is a mobile-first personal budgeting and financial planning Progressive Web App (PWA). It helps users track income, expenses, budgets, bills, and financial goals with powerful analytics and insights.

## 🚀 Features
- Dashboard with financial insights
- Transactions and budgeting tools
- Bills and subscriptions tracking
- Financial goals and reports
- Loan calculator
- Supabase authentication and database
- Stripe and Plaid premium integrations
- Progressive Web App (PWA)

## 🛠️ Tech Stack
- Next.js (React & TypeScript)
- Tailwind CSS
- Supabase
- Stripe
- Plaid
- Recharts
- Zustand

## 📦 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/cobb225/finova.git
cd finova
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file and add:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
STRIPE_SECRET_KEY=your_stripe_secret
NEXT_PUBLIC_PLAID_CLIENT_ID=your_plaid_client_id
PLAID_SECRET=your_plaid_secret
```

### 4. Run the Development Server
```bash
npm run dev
```

Open http://localhost:3000 to view the app.

## 📄 License
MIT
