# 💸 Smart Expense Splitter
> A cinematic, AI-powered dashboard for managing group expenses and shared costs.

Built with the **MERN** stack and **Supabase**, this application features smooth **Framer Motion** animations, **Recharts** for real-time analytics, and a predictive AI layer for expense categorization.

---

## ✨ Features

- **Cinematic UI/UX:** High-end dark-mode dashboard with glassmorphism effects, modern component styling via Tailwind CSS, and custom Framer Motion transitions.
- **Smart Data Insights:** A custom heuristic engine that performs real-time trend analysis, identifying spending spikes and dominant expense categories.
- **Dynamic Contribution Analytics:** Interactive Pie Charts visualizing the "Squad Leaderboard" to show real-time member investment.
- **Debt Settlement Algorithm:** A complex balancing logic that calculates the most efficient "who owes whom" path to clear all group debts.
- **AI Readiness:** Component architecture designed for seamless integration with LLMs (like Gemini) for future predictive categorization features.

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React.js, Tailwind CSS, Framer Motion |
| **Icons & UI** | Lucide React, shadcn/ui |
| **Charts** | Recharts |
| **Backend** | Supabase (Database & Auth) |
| **AI Integration** | Gemini 1.5 Flash API |

---

## 🏗️ Project Architecture

The app follows a modular React architecture focused on performance and clean state management:

- **`Group.jsx`**: The main container handling the data-fetching logic from Supabase.
- **`Summary.jsx`**: The analytics bridge that processes member balances and AI insights.
- **`SpendingChart.jsx`**: A specialized visualization component using Recharts.
- **`calculateBalance.js`**: A pure utility function implementing the settlement algorithm.

---

## 📈 Database Schema (Supabase)

The application uses two primary tables with relational integrity:

### Groups Table
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Primary Key |
| `name` | Text | Name of the squad |
| `created_at` | Timestamp | Group creation date |

### Expenses Table
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Primary Key |
| `amount` | Numeric | Total cost |
| `paid_by` | UUID | Foreign Key to Members |
| `split_with`| Array | IDs of members sharing the cost |

---

## 🚀 Installation & Setup

1. **Clone & Install:**
   ```bash
   git clone (https://github.com/ramalakshmi0304/smart-expense-splitter)
   cd smart-expense-splitter
   npm install