import { Component, Input, OnChanges } from '@angular/core';
import { Transaction } from '../../services/transactions.service';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
  standalone: false,
})
export class SummaryComponent implements OnChanges {
  @Input() transactions: Transaction[] = [];

  public totalIncome: number = 0;

  public totalExpenses: number = 0;

  public balance: number = 0;

  public chartLabels: string[] = [];

  public chartDataNumber: number[] = [];

  public chartData!: ChartConfiguration<'pie'>['data'];

  public chartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
  };

  ngOnChanges(): void {
    this.calculateSummary();
    this.aggregateByCategory();
  }

  calculateSummary() {
    this.totalIncome = this.transactions
      .filter((tx) => tx.type === 'Income')
      .reduce((sum, tx) => sum + tx.amount, 0);

    this.totalExpenses = this.transactions
      .filter((tx) => tx.type === 'Expense')
      .reduce((sum, tx) => sum + tx.amount, 0);

    this.balance = this.totalIncome - this.totalExpenses;
  }

  aggregateByCategory(): void {
    const categoryMap: { [key: string]: number } = {};

    this.transactions.forEach((transaction) => {
      if (!categoryMap[transaction.category]) {
        categoryMap[transaction.category] = 0;
      }
      categoryMap[transaction.category] += transaction.amount;
    });

    this.chartLabels = Object.keys(categoryMap);

    this.chartDataNumber = Object.values(categoryMap);

    this.chartData = {
      labels: this.chartLabels,
      datasets: [
        {
          data: this.chartDataNumber,
          backgroundColor: [
            '#42A5F5',
            '#66BB6A',
            '#FFA726',
            '#24789cb8',
            '#a21559',
          ],
        },
      ],
    };
  }
}
