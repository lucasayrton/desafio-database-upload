import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transationsRepository = getRepository(Transaction);

    const transactionExists = await transationsRepository.findOne(id);

    if (!transactionExists) {
      throw new AppError('This transaction does not exists.');
    }

    await transationsRepository.delete(id);
  }
}

export default DeleteTransactionService;
