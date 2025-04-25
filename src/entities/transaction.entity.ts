import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { TransactionStatus } from './transaction-status.entity';
import { TransactionType } from './transaction-type.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  transactionExternalId!: string;

  @Column('uuid')
  accountExternalIdDebit!: string;

  @Column('uuid')
  accountExternalIdCredit!: string;

  @ManyToOne(() => TransactionType)
  transactionType!: TransactionType;

  @ManyToOne(() => TransactionStatus)
  transactionStatus!: TransactionStatus;

  @Column('decimal', { precision: 10, scale: 2 })
  value!: number;

  @CreateDateColumn()
  createdAt!: Date;
}