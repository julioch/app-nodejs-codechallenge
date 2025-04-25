import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../entities/transaction.entity';
import { TransactionStatus } from '../entities/transaction-status.entity';
import { TransactionType } from '../entities/transaction-type.entity';
import { CreateTransactionInput } from '../dtos/create-transaction.input';
import { TransactionResponse } from '../dtos/transaction.response';
import { producer, TOPICS } from '../config/kafka.config';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(TransactionStatus)
    private statusRepository: Repository<TransactionStatus>,
    @InjectRepository(TransactionType)
    private typeRepository: Repository<TransactionType>,
  ) {}

  async createTransaction(input: CreateTransactionInput): Promise<TransactionResponse> {
    await producer.connect().catch(err => {
      console.error('Error al conectar a Kafka:', err);
      throw new Error('No se pudo conectar a Kafka');
    });

    try {
      // Obtener estados y tipos
      const pendingStatus = await this.statusRepository.findOne({ 
        where: { name: 'pending' } 
      });
      const transactionType = await this.typeRepository.findOne({ 
        where: { id: input.tranferTypeId } 
      });

      if (!pendingStatus || !transactionType) {
        throw new Error('Estado o tipo de transacción no encontrado');
      }

      //Crear transacción con tipo explícito
      const transaction = this.transactionRepository.create({
        accountExternalIdDebit: input.accountExternalIdDebit,
        accountExternalIdCredit: input.accountExternalIdCredit,
        transactionType,
        transactionStatus: pendingStatus,
        value: input.value,
      } as Transaction); // <-- Forzar tipo Transaction

      //Guardar
      const savedTransaction = await this.transactionRepository.save(transaction);
      if (Array.isArray(savedTransaction)) {
        throw new Error('Error: save() devolvió un array inesperado');
      }

      await producer.send({
        topic: TOPICS.TRANSACTION_CREATED,
        messages: [{
          value: JSON.stringify({
            transactionExternalId: savedTransaction.transactionExternalId,
            value: savedTransaction.value,
          }),
        }],
      });

      return this.mapToResponse(savedTransaction);

    } catch (error) {
      console.error('Error en createTransaction:', error);
      throw error; 
    } finally {
      try {
        await producer.disconnect();
      } catch (disconnectError) {
        console.error('Error al desconectar producer:', disconnectError);
      }
    }
  }

  async getTransactionById(id: string): Promise<TransactionResponse> {
    const transaction = await this.transactionRepository.findOne({
      where: { transactionExternalId: id },
      relations: ['transactionType', 'transactionStatus'],
    });
    if (!transaction) throw new Error('Transaction not found');
    return this.mapToResponse(transaction);
  }

  private mapToResponse(transaction: Transaction): TransactionResponse {
    if (!transaction) throw new Error('Transaction is null or undefined');
    
    return {
      transactionExternalId: transaction.transactionExternalId,
      transactionType: { 
        name: transaction.transactionType?.name || '' 
      },
      transactionStatus: { 
        name: transaction.transactionStatus?.name || '' 
      },
      value: transaction.value,
      createdAt: transaction.createdAt,
    };
  }
}