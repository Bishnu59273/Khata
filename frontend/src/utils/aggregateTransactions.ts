import type { Transaction } from '../types/models';

export interface TransactionAggregates {
  totalProfit: number;
  totalCollected: number;
  totalCost: number;
  count: number;
}

export function aggregateTransactions(transactions: Transaction[]): TransactionAggregates {
  return transactions.reduce(
    (acc, tx) => ({
      totalProfit: acc.totalProfit + tx.profit,
      totalCollected: acc.totalCollected + tx.customer_charge,
      totalCost: acc.totalCost + tx.cost_paid,
      count: acc.count + 1,
    }),
    { totalProfit: 0, totalCollected: 0, totalCost: 0, count: 0 }
  );
}
