
export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  avatarUrl: string;
}

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  note?: string;
}

export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  date: string;
}

export interface SavingsEntry {
  id: string;
  userId: string;
  amount: number;
  description: string;
  date: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  currentUser: User | null;
}

export type ViewType = 'dashboard' | 'notes' | 'transactions' | 'savings' | 'advisor' | 'calculator' | 'language-exchange' | 'settings' | 'admin';
