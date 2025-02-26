import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Transaction } from '../../services/transactions.service';

@Component({
  selector: 'app-transaction-form',
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.scss'],
  standalone: false,
})
export class TransactionFormComponent implements OnInit, OnChanges {
  @Output() saveTransaction = new EventEmitter<Transaction>();

  @Output() cancelTransaction = new EventEmitter<boolean>();

  @Input() transaction: Transaction | null = null;

  public transactionForm!: FormGroup;

  public cancelled: boolean = false;

  public selectedOption: string = 'Salary';

  public options: string[] = ['Salary'];

  constructor(private fb: FormBuilder) {}

  ngOnChanges(): void {
    if (this.transaction) {
      if (this.transaction?.type === 'Income') {
        this.onSelectingIncome();
      } else {
        this.onSelectingExpenses();
      }
    }
  }

  ngOnInit(): void {
    this.cancelled = false;
    this.transactionForm = this.fb.group({
      description: [
        this.transaction ? this.transaction.description : '',
        Validators.required,
      ],
      amount: [
        this.transaction ? this.transaction.amount : '',
        [
          Validators.required,
          Validators.pattern(/^-?\d+(\.\d{1,2})?$/),
          Validators.min(0),
        ],
      ],
      date: [
        this.transaction ? this.transaction.date : '',
        Validators.required,
      ],
      type: [
        this.transaction ? this.transaction.type : 'Income',
        Validators.required,
      ],
      category: [
        this.transaction ? this.transaction.category : this.selectedOption,
      ],
    });
  }

  onSelectingExpenses(): void {
    this.options = ['Groceries', 'Rent', 'Car', 'Other expenses'];
    this.selectedOption = 'Other expenses';
  }

  onSelectingIncome(): void {
    this.options = ['Salary'];
    this.selectedOption = 'Salary';
  }

  onSubmit() {
    if (this.transactionForm.valid && !this.cancelled) {
      const formValue = this.transactionForm.value;
      const tx: Transaction = {
        id: this.transaction ? this.transaction.id : 0,
        description: formValue.description,
        amount: +formValue.amount,
        date: formValue.date,
        type: formValue.type,
        category: formValue.category,
      };
      this.saveTransaction.emit(tx);
      this.transactionForm.reset({ type: 'Income' });
    }
  }

  onCancel() {
    this.cancelled = true;
    this.cancelTransaction.emit(true);
  }
}
