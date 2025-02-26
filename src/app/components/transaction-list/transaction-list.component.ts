import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Transaction } from '../../services/transactions.service';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss'],
  standalone: false,
})
export class TransactionListComponent {
  @Input() transactions: Transaction[] = [];

  @Output() editTransaction = new EventEmitter<Transaction>();

  @Output() deleteTransaction = new EventEmitter<number>();

  onEdit(tx: Transaction) {
    this.editTransaction.emit(tx);
  }

  onDelete(id: number) {
    this.deleteTransaction.emit(id);
  }
}
