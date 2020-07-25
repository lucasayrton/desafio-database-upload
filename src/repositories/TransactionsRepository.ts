import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface ResponseAllTransactions {
  transactions: Transaction[];
  balance: Balance;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactionsIncomeType = await this.find({
      where: { type: 'income' },
    });

    const income = transactionsIncomeType.reduce((total, transaction) => {
      return total + transaction.value;
    }, 0);

    const transactionsOutcomeType = await this.find({
      where: { type: 'outcome' },
    });

    const outcome = transactionsOutcomeType.reduce((total, transaction) => {
      return total + transaction.value;
    }, 0);

    const balance: Balance = {
      income,
      outcome,
      total: income - outcome,
    };

    return balance;
  }

  public async getTransactions(): Promise<ResponseAllTransactions> {
    const transactions = await this.find();
    const balance = await this.getBalance();

    const response: ResponseAllTransactions = {
      transactions,
      balance,
    };

    return response;
  }
}

export default TransactionsRepository;
