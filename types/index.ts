export type TransactionType = "income" | "expense";

export type Transaction = {
  id: string;
  date: string;
  description: string;
  merchant: string;
  amount: number;
  type: TransactionType;
  category: string;
  account: string;
  statement: string;
  confidence: number;
};

export type Account = {
  id: string;
  name: string;
};
