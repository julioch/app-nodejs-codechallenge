import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { TransactionService } from '../services/transaction.service';
import { CreateTransactionInput } from '../dtos/create-transaction.input';
import { TransactionResponse } from '../dtos/transaction.response';

@Controller('transactions') 
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post() 
  async create(@Body() input: CreateTransactionInput): Promise<TransactionResponse> {
    return this.transactionService.createTransaction(input);
  }

  @Get(':id') 
  async findOne(@Param('id') id: string): Promise<TransactionResponse> {
    return this.transactionService.getTransactionById(id);
  }
}