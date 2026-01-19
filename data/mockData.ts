import type { Transaction } from "@/types";

export const mockTransactions: Transaction[] = [
  {
    id: "1",
    date: "2024-01-05T15:15:00",
    description: "January salary",
    merchant: "TechCorp",
    amount: 5200,
    type: "income",
    category: "Salary",
    account: "Main Checking",
    statement: "Jan 2024",
    confidence: 98
  },
  {
    id: "2",
    date: "2024-01-07T11:45:00",
    description: "Grocery run",
    merchant: "Whole Foods",
    amount: -145.38,
    type: "expense",
    category: "Groceries",
    account: "Main Checking",
    statement: "Jan 2024",
    confidence: 92
  },
  {
    id: "3",
    date: "2024-01-10T10:33:00",
    description: "Gym membership",
    merchant: "Equinox",
    amount: -210,
    type: "expense",
    category: "Health",
    account: "Main Checking",
    statement: "Jan 2024",
    confidence: 87
  },
  {
    id: "4",
    date: "2024-01-11T13:15:00",
    description: "Monthly rent",
    merchant: "Maple Apartments",
    amount: -1800,
    type: "expense",
    category: "Housing",
    account: "Main Checking",
    statement: "Jan 2024",
    confidence: 95
  },
  {
    id: "5",
    date: "2024-01-12T10:56:00",
    description: "Dinner with friends",
    merchant: "Nobu",
    amount: -125.4,
    type: "expense",
    category: "Dining",
    account: "Rewards Card",
    statement: "Jan 2024",
    confidence: 89
  },
  {
    id: "6",
    date: "2024-01-15T10:38:00",
    description: "Freelance project",
    merchant: "Design Studio",
    amount: 1200,
    type: "income",
    category: "Freelance",
    account: "Main Checking",
    statement: "Jan 2024",
    confidence: 94
  },
  {
    id: "7",
    date: "2024-01-18T17:22:00",
    description: "Ride share",
    merchant: "Uber",
    amount: -24.5,
    type: "expense",
    category: "Transport",
    account: "Rewards Card",
    statement: "Jan 2024",
    confidence: 85
  },
  {
    id: "8",
    date: "2024-01-20T16:56:00",
    description: "Coffee and snacks",
    merchant: "Blue Bottle",
    amount: -18.75,
    type: "expense",
    category: "Coffee",
    account: "Main Checking",
    statement: "Jan 2024",
    confidence: 88
  },
  {
    id: "9",
    date: "2024-01-23T12:18:00",
    description: "Streaming subscription",
    merchant: "Netflix",
    amount: -15.99,
    type: "expense",
    category: "Entertainment",
    account: "Rewards Card",
    statement: "Jan 2024",
    confidence: 90
  },
  {
    id: "10",
    date: "2024-01-26T10:02:00",
    description: "Bonus payout",
    merchant: "TechCorp",
    amount: 800,
    type: "income",
    category: "Bonus",
    account: "Savings",
    statement: "Jan 2024",
    confidence: 96
  }
];
