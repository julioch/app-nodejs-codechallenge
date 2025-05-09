import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class TransactionStatus {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;
}