import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { TransactionService } from '../services/transaction.service';
import { CreateTransactionInput } from '../dtos/create-transaction.input';
import { TransactionResponse } from '../dtos/transaction.response';

@Resolver()
export class TransactionResolver {
  constructor(private readonly transactionService: TransactionService) {}

  @Mutation(() => TransactionResponse)
  async createTransaction(@Args('input') input: CreateTransactionInput): Promise<TransactionResponse> {
    return this.transactionService.createTransaction(input);
  }

  @Query(() => TransactionResponse)
  async transaction(@Args('id') id: string): Promise<TransactionResponse> {
    return this.transactionService.getTransactionById(id);
  }
}