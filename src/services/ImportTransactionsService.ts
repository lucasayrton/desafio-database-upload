import parse from 'csv-parse';
import fs from 'fs';
import getStream from 'get-stream';
import Transaction from '../models/Transaction';

import CreateTransactionService from './CreateTransactionService';

interface Request {
  filePath: string;
}

class ImportTransactionsService {
  async execute({ filePath }: Request): Promise<Transaction[]> {
    const createTransaction = new CreateTransactionService();
    const transactions: Transaction[] = [];

    const data: string[][] = await getStream.array(
      fs
        .createReadStream(filePath)
        .pipe(parse({ delimiter: ', ', from_line: 2 })),
    );

    // eslint-disable-next-line no-restricted-syntax
    for (const row of data) {
      // eslint-disable-next-line no-await-in-loop
      const transaction = await createTransaction.execute({
        title: row[0],
        type: row[1] as 'income' | 'outcome',
        value: +row[2],
        category: row[3],
      });

      transactions.push(transaction);
    }

    await fs.promises.unlink(filePath);

    return transactions;
  }
}

export default ImportTransactionsService;
