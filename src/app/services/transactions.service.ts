import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Transaction {
  id: number;
  description: string;
  amount: number;
  date: string;
  type: 'Income' | 'Expense';
  category: string;
}

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private storageKey = 'transactions';

  private transactionsSubject = new BehaviorSubject<Transaction[]>(
    this.loadTransactions()
  );

  transactions$ = this.transactionsSubject.asObservable();

  private loadTransactions(): Transaction[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  private saveTransactions(transactions: Transaction[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(transactions));
    this.transactionsSubject.next(transactions);
  }

  getTransactions(): Transaction[] {
    return this.loadTransactions();
  }

  addTransaction(transaction: Transaction): void {
    const transactions = this.loadTransactions();
    transaction.id = new Date().getTime();
    transactions.push(transaction);
    this.saveTransactions(transactions);
  }

  updateTransaction(updated: Transaction): void {
    let transactions = this.loadTransactions();
    transactions = transactions.map((tx) =>
      tx.id === updated.id ? updated : tx
    );
    this.saveTransactions(transactions);
  }

  deleteTransaction(id: number): void {
    let transactions = this.loadTransactions();
    transactions = transactions.filter((tx) => tx.id !== id);
    this.saveTransactions(transactions);
  }
}
