export type Category = 
  | 'Food' 
  | 'Transport' 
  | 'Shopping' 
  | 'Bills' 
  | 'Health' 
  | 'Entertainment' 
  | 'Education' 
  | 'Other';

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: Category;
  amount: number;
  date: string; // ISO standard YYYY-MM-DD
  note: string;
}

export interface Budget {
  category: Category;
  limit: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface AIResult {
  unusualExpenses: string;
  predictions: string;
  savingRecommendations: string;
}

export interface CodeFile {
  name: string;
  path: string;
  language: string;
  content: string;
}

export interface FolderNode {
  name: string;
  type: 'folder' | 'file';
  path: string;
  children?: FolderNode[];
  fileContent?: string;
  language?: string;
}
