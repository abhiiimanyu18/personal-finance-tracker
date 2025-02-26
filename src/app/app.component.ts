import { Component, OnInit } from '@angular/core';
import {
  Transaction,
  TransactionService,
} from './services/transactions.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  public transactions: Transaction[] = [];

  public editingTransaction: Transaction | null = null;

  public showForm: boolean = false;

  public footerText = 'Developer: Abhimanyu Saxena';

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    this.transactions = this.transactionService.getTransactions();
    this.transactionService.transactions$.subscribe((data) => {
      this.transactions = data;
    });
  }

  onSaveTransaction(tx: Transaction) {
    if (tx.id && this.transactions.find((t) => t.id === tx.id)) {
      this.transactionService.updateTransaction(tx);
    } else {
      this.transactionService.addTransaction(tx);
    }
    this.editingTransaction = null;
    this.showForm = false;
  }

  onEditTransaction(tx: Transaction) {
    this.editingTransaction = tx;
    this.showForm = true;
  }

  onDeleteTransaction(id: number) {
    this.transactionService.deleteTransaction(id);
  }

  openForm() {
    this.editingTransaction = null;
    this.showForm = true;
  }

  cancelForm(val: boolean) {
    if (val) this.showForm = false;
  }
}
